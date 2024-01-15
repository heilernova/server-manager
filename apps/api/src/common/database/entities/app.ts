import { PartialType } from "@nestjs/mapped-types";
import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

import { Framework, IAppInsert, RunningOn, RuntimeEnvironment } from "@api/common/database";
import { runtime_environment_list, framework_list,  running_on_list } from '@api/common/database/schemas/types';

export class AppCreateDto implements IAppInsert {

    @IsString()
    @IsOptional()
    version?: string | null | undefined;

    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    url: string | null;
    
    @IsIn(running_on_list)
    @IsOptional()
    runningOn: RunningOn | null;

    @IsString()
    @IsOptional()
    startupFile: string | null;

    @IsIn(framework_list)
    @IsOptional()
    framework: Framework | null;

    @IsIn(runtime_environment_list)
    @IsOptional()
    runtimeEnvironment: RuntimeEnvironment | null;
    
    @IsObject()
    @IsOptional()
    env: { [key: string]: any };
    
    @IsString()
    @IsNotEmpty()
    location: string;
    
    @IsString({ each: true})
    @IsOptional()
    ignore: string[];
    
    @IsString()
    @IsOptional()
    observation?: string | null;
}

export class AppUpdateDto extends PartialType(AppCreateDto) {}