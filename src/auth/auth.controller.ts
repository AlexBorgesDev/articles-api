import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthLoginDto } from './auth.dto'
import { AuthService } from './auth.service'
import { AuthSwagger } from './auth.swagger'
import { Public } from './public.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post()
  @Public()
  @HttpCode(200)
  @ApiResponse(AuthSwagger.login.ok)
  @ApiResponse(AuthSwagger.login.bad)
  async login(@Body() credential: AuthLoginDto) {
    return await this.service.login(credential)
  }
}
