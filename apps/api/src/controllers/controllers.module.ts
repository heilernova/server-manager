import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ProfileController } from './profile/profile.controller';
import { UsersController } from './users/users.controller';
import { AppsController } from './apps/apps.controller';
import { DeployController } from './deploy/deploy.controller';

@Module({
    controllers:[
        AuthController,
        ProfileController,
        UsersController,
        AppsController,
        DeployController
    ]
})
export class ControllersModule {}
