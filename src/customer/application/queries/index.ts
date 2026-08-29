import { ListCustomersHandler } from './list-customers/list-customers.handler';
import { GetCustomerHandler } from './get-customer/get-customer.handler';

export const customerQueryHandlers = [ListCustomersHandler, GetCustomerHandler];
