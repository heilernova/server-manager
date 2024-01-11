import { IsString, MaxLength } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @MaxLength(50)
    currentPassword: string;

    @IsString()
    @MaxLength(50)
    newPassword: string;
}