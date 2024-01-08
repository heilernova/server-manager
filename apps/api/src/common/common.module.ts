import { Global, Module } from '@nestjs/common';

import { DeployService } from '@api/common/deploy';
import { DbUsersService } from './database/services/db-users/db-users.service';
import { DbAppsService } from './database/services/db-apps/db-apps.service';
import { DbTokensService } from './database/services/db-tokens/db-tokens.service';
import { Pm2Service } from './pm2/pm2.service';
import { DbConnection } from './database';

const services = [
    DeployService,
    Pm2Service,
    DbConnection,
    DbAppsService,
    DbUsersService,
    DbTokensService
];

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
