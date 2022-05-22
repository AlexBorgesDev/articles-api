import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ObjectID } from 'typeorm'

import { UserChangeDto, UserCreateDto } from './user.dto'
import { UserService } from './user.service'

import { Public } from '../auth/public.decorator'
import { UserID } from '../auth/userID.decorator'

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  async show(@UserID() userID: ObjectID) {
    const user = await this.service.findById(userID)

    if (!user) throw new UnauthorizedException('Invalid token')

    return {
      email: user.email,
      description: user.description,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  @Post()
  @Public()
  async create(@Body() data: UserCreateDto) {
    await this.service.create(data)
    return { message: 'User created successfully' }
  }

  @Patch()
  async change(@Body() data: UserChangeDto, @UserID() userID: ObjectID) {
    const userUpdated = await this.service.change(data, userID)

    return {
      message: 'User updated successfully',
      user: {
        email: userUpdated.email,
        description: userUpdated.description,
        firstName: userUpdated.firstName,
        lastName: userUpdated.lastName,
        createdAt: userUpdated.createdAt,
        updatedAt: userUpdated.updatedAt,
      },
    }
  }

  @Delete()
  async delete(@UserID() userID: ObjectID) {
    await this.service.delete(userID)
    return { message: 'User deleted successfully' }
  }
}
