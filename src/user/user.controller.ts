import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common'

import { UserChangeDto, UserChangePasswordDto, UserCreateDto } from './user.dto'
import { UserService } from './user.service'

import { Public } from '../auth/public.decorator'
import { UserID } from '../auth/userID.decorator'

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  async show(@UserID() userID: string) {
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
  async change(@Body() data: UserChangeDto, @UserID() userID: string) {
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

  @Patch('/password')
  async changePassword(
    @Body() data: UserChangePasswordDto,
    @UserID() userID: string,
  ) {
    await this.service.changePassword(data, userID)
    return { message: 'Password has been successfully changed' }
  }

  @Delete()
  async delete(@UserID() userID: string) {
    await this.service.delete(userID)
    return { message: 'User deleted successfully' }
  }
}
