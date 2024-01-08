import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

import { uuid } from '@api/common/database';

export class UserCreateDto {
    @IsUUID()
    @IsOptional()
    id?: uuid;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsPhoneNumber()
    cellphone: string;
}

export class UserUpdateDto extends PartialType(UserCreateDto) {}