import { RegisterCustomerHandler } from './register-customer/register-customer.handler';
import { DeleteCustomerHandler } from './delete-customer/delete-customer.handler';

export const CustomerCommandHandlers = [
  RegisterCustomerHandler,
  DeleteCustomerHandler,
];
