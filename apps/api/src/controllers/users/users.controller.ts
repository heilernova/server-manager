import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { IsUUIDPipe } from '@api/common/pipes';
import { DbUsersService, IUser, UserCreateDto, UserUpdateDto, uuid } from '@api/common/database';

@Controller('users')
export class UsersController {
    constructor(private readonly _dbUsers: DbUsersService){}

    @Post()
    async create(@Body() body: UserCreateDto){
        return this._dbUsers.create({ ...body, lock: false, password: body.username });
    }

    @Get()
    async getAll(){
        return this._dbUsers.getAll();
    }

    @Get(':id')
    async get(@Param('id', IsUUIDPipe) id: uuid): Promise<IUser> {
        let user: IUser | undefined = await this._dbUsers.get(id);
        if (!user) throw new HttpException('ID del usuario no encontrado', 404);
        return user;
    }

    @Patch(':id')
    async update(@Param('id', IsUUIDPipe) id: uuid, @Body() data: UserUpdateDto): Promise<IUser> {
        let user: IUser | undefined = await this._dbUsers.get(id);
        if (!user) throw new HttpException('ID del usuario no encontrado', 404);
        return await this._dbUsers.update(id, data);
    }

    @Patch(':id/lock')
    async lock(@Param('id', IsUUIDPipe) id: uuid){
        let user: IUser | undefined = await this._dbUsers.get(id);
        if (!user) throw new HttpException('ID del usuario no encontrado', 404);
        this._dbUsers.update(id, { lock: true });
    }

    @Patch(':id/unlock')
    async unlock(@Param('id', IsUUIDPipe) id: uuid){
        let user: IUser | undefined = await this._dbUsers.get(id);
        if (!user) throw new HttpException('ID del usuario no encontrado', 404);
        this._dbUsers.update(id, { lock: false });
    }

    @Delete(':id')
    async delete(@Param('id', IsUUIDPipe) id: uuid): Promise<void> {
        this._dbUsers.delete(id);
    }
}
