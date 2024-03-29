import { Global, Module } from '@nestjs/common';

import { DeployService } from '@api/common/deploy';
import { DbUsersService } from './database/services/db-users/db-users.service';
import { DbApplicationsService } from './database/services/db-apps/db-apps.service';
import { DbTokensService } from './database/services/db-tokens/db-tokens.service';
import { Pm2Service } from './pm2/pm2.service';
import { DbConnection } from './database';
import { ConfigService } from './config/config.service';

const services = [
    ConfigService,
    DeployService,
    Pm2Service,
    DbConnection,
    DbApplicationsService,
    DbUsersService,
    DbTokensService
];

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
