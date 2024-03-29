import { DbApplicationsService, IApplication, IUser, uuid } from '@api/common/database';
import { DeployService } from '@api/common/deploy';
import { IsUUIDPipe } from '@api/common/pipes';
import { GetSession, IsLoggedInGuard } from '@api/common/session';
import { Body, Controller, FileTypeValidator, HttpException, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(IsLoggedInGuard)
@Controller('deploy')
export class DeployController {

    constructor(private readonly _dbApps: DbApplicationsService, private readonly _deploy: DeployService){}

    @Post()
    @UseInterceptors(FileInterceptor('zip'))
    async deploy(
        @Body('id', IsUUIDPipe) id: uuid,
        @GetSession() user: IUser, 
        @UploadedFile(new ParseFilePipe({ validators: [  new FileTypeValidator({ fileType: 'zip' }) ]}))  file: Express.Multer.File
    ){
        let app: IApplication | undefined = await this._dbApps.get(id, user.id);
        if (!app) throw new HttpException('Aplicación no encontrada', 400);
        let res: any = await this._deploy.run(app, file.buffer);
        return res;
    }
}
