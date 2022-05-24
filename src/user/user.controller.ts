import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserChangeDto, UserChangePasswordDto, UserCreateDto } from './user.dto'
import { UserService } from './user.service'

import { Public } from '../auth/public.decorator'
import { UserID } from '../auth/userID.decorator'
import { UserSwagger } from './user.swagger'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiResponse(UserSwagger.show.ok)
  @ApiResponse(UserSwagger.show.unauthorized)
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
  @ApiResponse(UserSwagger.create.bad)
  @ApiResponse(UserSwagger.create.success)
  async create(@Body() data: UserCreateDto) {
    await this.service.create(data)
    return { message: 'User created successfully' }
  }

  @Patch()
  @ApiBearerAuth()
  @ApiResponse(UserSwagger.change.ok)
  @ApiResponse(UserSwagger.change.bad)
  @ApiResponse(UserSwagger.change.unauthorized)
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
  @ApiBearerAuth()
  @ApiResponse(UserSwagger.changePassword.ok)
  @ApiResponse(UserSwagger.changePassword.bad)
  @ApiResponse(UserSwagger.changePassword.unauthorized)
  async changePassword(
    @Body() data: UserChangePasswordDto,
    @UserID() userID: string,
  ) {
    await this.service.changePassword(data, userID)
    return { message: 'Password has been successfully changed' }
  }

  @Delete()
  @ApiBearerAuth()
  @ApiResponse(UserSwagger.delete.ok)
  @ApiResponse(UserSwagger.delete.unauthorized)
  async delete(@UserID() userID: string) {
    await this.service.delete(userID)
    return { message: 'User deleted successfully' }
  }
}
