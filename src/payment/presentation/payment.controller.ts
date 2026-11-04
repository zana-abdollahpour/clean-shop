import {
  Body,
  Controller,
  Headers,
  Inject,
  Logger,
  Post,
  RawBody,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Event as StripeEvent } from 'stripe';

import {
  PAYMENT_GATEWAY,
  PaymentGatewayPort,
} from 'src/payment/application/ports/payment.gateway.port';

import { CreatePaymentCommand } from 'src/payment/application/use-cases/create-payment/create-payment.command';
import { CreatePaymentResponse } from 'src/payment/application/use-cases/create-payment/create-payment.handler';

import { CreatePaymentDto } from 'src/payment/presentation/dtos/create-payment.dto';
import { ConfirmPaymentCommand } from 'src/payment/application/use-cases/confirm-payment/confirm-payment.command';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  @Post()
  async createPayment(
    @Body() { orderId, successUrl, cancelUrl }: CreatePaymentDto,
  ) {
    return this.commandBus.execute<CreatePaymentCommand, CreatePaymentResponse>(
      new CreatePaymentCommand(orderId, successUrl, cancelUrl),
    );
  }

  @Post('webhook')
  async handleWebhook(
    @RawBody() payload: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.paymentGateway.constructWebhookEvent(
      payload,
      signature,
    ) as StripeEvent;
    this.logger.log('Got stripe webhook event', event);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const paymentId = session.metadata?.paymentId;
        const gatewayTransactionId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        if (paymentId && gatewayTransactionId) {
          await this.commandBus.execute(
            new ConfirmPaymentCommand(paymentId, gatewayTransactionId),
          );
        }
        break;
      }
      default:
        break;
    }
  }
}
