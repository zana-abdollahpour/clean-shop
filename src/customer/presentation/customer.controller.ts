import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Customer } from 'src/customer/domain/entities/customer.entity';

import { RegisterCustomerDto } from 'src/customer/presentation/dto/register-customer.dto';
import { CustomerResponseDto } from 'src/customer/presentation/dto/customer-response.dto';

import { RegisterCustomerCommand } from 'src/customer/application/use-cases/register-customer/register-customer.command';
import { listCustomersQuery } from 'src/customer/application/queries/list-customers/list-customers.query';
import { GetCustomerQuery } from 'src/customer/application/queries/get-customer/get-customer.query';
import { DeleteCustomerCommand } from 'src/customer/application/use-cases/delete-customer/delete-customer.command';

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

  @Get()
  async list(): Promise<CustomerResponseDto[]> {
    const customers = await this.queryBus.execute<
      listCustomersQuery,
      Customer[]
    >(new listCustomersQuery());

    return customers.map((customer) =>
      CustomerResponseDto.fromDomain(customer),
    );
  }

  @Get('id')
  async findOne(
    @Param(':id', ParseUUIDPipe) id: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(
      new GetCustomerQuery(id),
    );

    return CustomerResponseDto.fromDomain(customer);
  }

  @Delete('id')
  async deleteOne(@Param('id') customerId: string): Promise<void> {
    await this.commandBus.execute<DeleteCustomerCommand, void>(
      new DeleteCustomerCommand(customerId),
    );
  }
}
