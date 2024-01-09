import { uuid } from "@api/common/database";
import { IsUUID } from "class-validator";

export class DeployDto {
    @IsUUID()
    appId: uuid;
}