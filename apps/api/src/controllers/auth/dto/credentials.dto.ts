import { IsString, MaxLength } from "class-validator";

export class CredentialsDto {
    @IsString()
    @MaxLength(20)
    public readonly hostname: string;

    @IsString()
    @MaxLength(100)
    public readonly username: string;

    @IsString()
    @MaxLength(30)
    public readonly password: string;
}