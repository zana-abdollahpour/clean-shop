import { Inject, Injectable } from '@nestjs/common';
import { and, eq, notInArray, sql } from 'drizzle-orm';

import { OrderRepositoryPort } from 'src/order/application/ports/order-repository.port';
import { Order } from 'src/order/domain/entities/order.entity';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import {
  orderItems,
  orders,
} from 'src/shared/infrastructure/database/postgres/schema/orders.schema';

import { OrderItem } from 'src/order/domain/entities/order-item.entity';
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
      shippingZipCode: order.shippingAddress.zipcode,
      shippingCountry: order.shippingAddress.country,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
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

  findById(id: OrderId): Promise<Order | null> {
    throw new Error('Method not implemented.');
  }

  findCustomerById(customerId: string): Promise<Order[] | null> {
    throw new Error('Method not implemented.');
  }

  findAll(id: OrderId): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: OrderId): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
