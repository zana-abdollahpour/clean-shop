import { Inject, Injectable } from '@nestjs/common';
import { and, eq, notInArray, sql } from 'drizzle-orm';

import { OrderRepositoryPort } from 'src/order/application/ports/order-repository.port';
import { Order } from 'src/order/domain/entities/order.entity';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';
import { OrderItem } from 'src/order/domain/entities/order-item.entity';
import {
  orderItems,
  orders,
} from 'src/shared/infrastructure/database/postgres/schema/orders.schema';

import { Money } from 'src/shared/domain/value-objects/money.vo';
import { UniqueId } from 'src/shared/domain/value-objects/unique-id.vo';
import { ShippingAddress } from 'src/order/domain/value-objects/shipping-address.vo';
import {
  DRIZZLE,
  DrizzleDB,
} from 'src/shared/infrastructure/database/postgres/drizzle.provider';

@Injectable()
export class DrizzleOrderRepository implements OrderRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  private static toOrderPersistence(order: Order): typeof orders.$inferSelect {
    const total = order.getTotal();
    return {
      id: order.id.getValue(),
      customerId: order.customerId,
      status: order.status.getValue(),
      totalAmount: total.toCents(),
      totalCurrency: total.getCurrency(),
      shippingStreet: order.shippingAddress.street,
      shippingCity: order.shippingAddress.city,
      shippingState: order.shippingAddress.state,
      shippingZipCode: order.shippingAddress.zipCode,
      shippingCountry: order.shippingAddress.country,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private static toDomain(
    orderRow: typeof orders.$inferSelect,
    itemRows: (typeof orderItems.$inferInsert)[],
  ): Order {
    const items = itemRows.map((row) => {
      const discount =
        row.discountAmount !== null && row.discountCurrency !== null
          ? Money.create(row.discountAmount! / 100, row.discountCurrency)
          : null;

      return OrderItem.reconstitute({
        id: new UniqueId(row.id),
        productId: row.productId,
        productName: row.productName,
        unitPrice: Money.create(
          row.unitPriceAmount / 100,
          row.unitPriceCurrency,
        ),
        quantity: row.quantity,
        discount: discount,
      });
    });

    const shippingAddress = ShippingAddress.create({
      street: orderRow.shippingStreet ?? '',
      city: orderRow.shippingCity ?? '',
      state: orderRow.shippingState ?? '',
      zipCode: orderRow.shippingZipCode ?? '',
      country: orderRow.shippingCountry ?? '',
    });

    return Order.reconstitute({
      id: new OrderId(orderRow.id),
      customerId: orderRow.customerId,
      status: OrderStatus.fromString(orderRow.status),
      items: items,
      shippingAddress,
      trackingNumber: orderRow.trackingNumber,
      notes: orderRow.notes,
      createdAt: orderRow.createdAt,
      updatedAt: orderRow.updatedAt,
    });
  }

  private static toItemPersistence(item: OrderItem, orderId: string) {
    return {
      id: item.getId().getValue(),
      orderId: orderId,
      productId: item.productId,
      productName: item.productName,
      unitPriceAmount: item.unitPrice.toCents(),
      unitPriceCurrency: item.unitPrice.getCurrency(),
      quantity: item.quantity,
      discountAmount: item.discount?.toCents() ?? null,
      discountCurrency: item.discount?.getCurrency() ?? null,
      createdAt: new Date(),
    };
  }

  async save(order: Order): Promise<void> {
    const orderRow = DrizzleOrderRepository.toOrderPersistence(order);
    const itemRows = order.items.map((item) =>
      DrizzleOrderRepository.toItemPersistence(item, order.id.getValue()),
    );

    await this.db.transaction(async (tx) => {
      await tx
        .insert(orders)
        .values(orderRow)
        .onConflictDoUpdate({
          target: orders.id,
          set: {
            status: orderRow.status,
            totalAmount: orderRow.totalAmount,
            totalCurrency: orderRow.totalCurrency,
            shippingStreet: orderRow.shippingStreet,
            shippingCity: orderRow.shippingCity,
            shippingState: orderRow.shippingState,
            shippingZipCode: orderRow.shippingZipCode,
            shippingCountry: orderRow.shippingCountry,
            trackingNumber: orderRow.trackingNumber,
            notes: orderRow.notes,
            updatedAt: orderRow.updatedAt,
          },
        });

      await tx
        .insert(orderItems)
        .values(itemRows)
        .onConflictDoUpdate({
          target: orderItems.id,
          set: {
            productName: sql`excluded.product_name`,
            unitPriceAmount: sql`excluded.unit_price_amount`,
            unitPriceCurrency: sql`excluded.unit_price_currency`,
            quantity: sql`excluded.quantity`,
            discountAmount: sql`excluded.discount_amount`,
            discountCurrency: sql`excluded.discount_currency`,
          },
        });

      const currentItemIds = itemRows.map((row) => row.id);
      if (currentItemIds.length) {
        await tx
          .delete(orderItems)
          .where(
            and(
              eq(orderItems.orderId, order.id.getValue()),
              notInArray(orderItems.id, currentItemIds),
            ),
          );
      } else {
        await tx
          .delete(orderItems)
          .where(eq(orderItems.orderId, order.id.getValue()));
      }
    });
  }

  async findById(id: OrderId): Promise<Order | null> {
    /* for reference, without relations
    const orderRows = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id.getValue()));

    if (!orderRows.length) {
      return null;
    }

    const itemsRows = await this.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id.getValue()));

      return DrizzleOrderRepository.toDomain(orderRows[0], itemsRows);
      */

    const result = await this.db.query.orders.findFirst({
      where: eq(orders.id, id.getValue()),
      with: { items: true },
    });

    if (!result) {
      return null;
    }

    return DrizzleOrderRepository.toDomain(result, result.items);
  }

  async findByCustomerId(customerId: string): Promise<Order[] | null> {
    const results = await this.db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
      with: { items: true },
    });

    return results.map((result) =>
      DrizzleOrderRepository.toDomain(result, result.items),
    );
  }

  async findAll(): Promise<Order[]> {
    const results = await this.db.query.orders.findMany({
      with: { items: true },
    });

    return results.map((result) =>
      DrizzleOrderRepository.toDomain(result, result.items),
    );
  }

  async delete(id: OrderId): Promise<void> {
    await this.db.delete(orders).where(eq(orders.id, id.getValue()));
  }
}
