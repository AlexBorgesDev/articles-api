import { Body, Controller, Post } from '@nestjs/common'

import { AuthLoginDto } from './auth.dto'
import { AuthService } from './auth.service'
import { Public } from './public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post()
  @Public()
  async login(@Body() credential: AuthLoginDto) {
    return await this.service.login(credential)
  }
}
