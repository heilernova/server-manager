import { ArgumentMetadata, HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class IsUUIDPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isUUID(value)) throw new HttpException('El parámetro ID debe ser de formato UUID', 400);
    return value;
  }
}
