import { writeFileSync } from 'node:fs';

import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DatabaseError } from 'pg';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    let version: string = (process.env.APP_VERSION as string);
    let name: string = (process.env.APP_NAME as string);

    if (!(exception instanceof HttpException)){
      if (exception instanceof DatabaseError){
        exception = new HttpException({
          name,
          version,
          status: 500,
          message: true ? `Error con las consulta SQL: ${exception.message}` : 'Error interno del servidor',
          detail: {
            message: exception.detail,
            command: (exception as any)?.query?.command,
            params: (exception as any)?.query?.params,
          }
        }, 500);
      } else if (exception instanceof Error) {
        exception = new HttpException({
          name,
          version,
          status: 500,
          message: true ? `Error inesperado: ${exception.message}` : 'Error interno del servidor'
        }, 500);
      }
      // Registro de errores del sistema;
      let date = new Date();
      let dateString: string = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate()} ${date.getUTCHours().toString().padStart(2, ' ')}:${date.getUTCMinutes().toString().padEnd(2, '0')}:${date.getSeconds()}:${date.getMilliseconds().toString().padEnd(3, '0')}`;
      let method: string = host.switchToHttp().getRequest().method;
      let url: string = host.switchToHttp().getRequest().url;
      let ip: string = host.switchToHttp().getRequest().ip;
      let log: string = `[${dateString}] ${ip} ${method} ${url} ${Buffer.from(JSON.stringify((exception as any).response)).toString('base64')}\n`;
      writeFileSync('./api.errors.log', log, { flag: 'a' })
    }
    super.catch(exception, host);
  }
}