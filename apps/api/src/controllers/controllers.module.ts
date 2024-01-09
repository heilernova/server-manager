import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ProfileController } from './profile/profile.controller';
import { UsersController } from './users/users.controller';

@Module({
    controllers:[
        AuthController,
        ProfileController,
        UsersController
    ]
})
export class ControllersModule {}
