import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ProfileController } from './profile/profile.controller';
import { UsersController } from './users/users.controller';
import { AppsController } from './apps/apps.controller';

@Module({
    controllers:[
        AuthController,
        ProfileController,
        UsersController,
        AppsController
    ]
})
export class ControllersModule {}
