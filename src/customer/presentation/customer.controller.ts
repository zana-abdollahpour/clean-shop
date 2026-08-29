import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { RegisterCustomerDto } from 'src/customer/presentation/dto/register-customer.dto';
import { RegisterCustomerCommand } from 'src/customer/application/use-cases/register-customer/register-customer.handler';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async register(
    @Body() registerCustomerDto: RegisterCustomerDto,
  ): Promise<void> {
    await this.commandBus.execute<RegisterCustomerCommand, void>(
      new RegisterCustomerCommand(
        registerCustomerDto.email,
        registerCustomerDto.firstName,
        registerCustomerDto.lastNam,
        registerCustomerDto.phone,
      ),
    );
  }
}
