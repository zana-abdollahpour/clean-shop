import { ConfirmPaymentHandler } from 'src/payment/application/use-cases/confirm-payment/confirm-payment.handler';
import { CreatePaymentHandler } from 'src/payment/application/use-cases/create-payment/create-payment.handler';

export const PaymentCommandHandlers = [
  CreatePaymentHandler,
  ConfirmPaymentHandler,
];
