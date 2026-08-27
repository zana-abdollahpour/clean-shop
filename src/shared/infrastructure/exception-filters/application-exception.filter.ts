import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exception/application.exception';

const CODE_TO_HTTP = new Map<ApplicationExceptionCode, HttpStatus>([
  [ApplicationExceptionCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST],
  [ApplicationExceptionCode.NOT_FOUND, HttpStatus.NOT_FOUND],
  [ApplicationExceptionCode.CONFLICT, HttpStatus.CONFLICT],
]);

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      CODE_TO_HTTP.get(exception.code) ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      message: exception.message,
      statusCode: status,
    });
  }
}
