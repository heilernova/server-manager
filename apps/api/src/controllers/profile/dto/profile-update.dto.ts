import { IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class ProfileUpdateDto {
    @IsString()
    @MaxLength(40)
    name: string;

    @IsString()
    @MaxLength(40)
    lastName: string;
    
    @IsString()
    @MaxLength(30)
    username: string;

    @IsString()
    @MaxLength(100)
    email: string;

    @IsPhoneNumber()
    cellphone: string;
}