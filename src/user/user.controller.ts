import { Body, Controller, Post } from '@nestjs/common'

import { UserCreateDto } from './user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  async create(@Body() data: UserCreateDto) {
    await this.service.create(data)
    return { message: 'User created successfully' }
  }
}
