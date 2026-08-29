import { CreateProductHandler } from './create-product/create-product.handler';
import { DeleteProductHandler } from './delete-product/delete-product.handler';

export const productCommandHandlers = [
  CreateProductHandler,
  DeleteProductHandler,
];
