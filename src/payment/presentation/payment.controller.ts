import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreatePaymentCommand } from 'src/payment/application/use-cases/create-payment/create-payment.command';
import { CreatePaymentResponse } from 'src/payment/application/use-cases/create-payment/create-payment.handler';

import { CreatePaymentDto } from 'src/payment/presentation/dtos/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createPayment(
    @Body() { orderId, successUrl, cancelUrl }: CreatePaymentDto,
  ) {
    return this.commandBus.execute<CreatePaymentCommand, CreatePaymentResponse>(
      new CreatePaymentCommand(orderId, successUrl, cancelUrl),
    );
  }
}
