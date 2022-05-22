import * as bcrypt from 'bcrypt'

import { JwtService } from '@nestjs/jwt'
import { BadRequestException, Injectable } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { AuthLoginDto } from './auth.dto'
import { Payload } from '../@types/auth'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: AuthLoginDto) {
    const user = await this.userService.findByEmail(email)

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email or password is invalid')
    }

    const payload: Payload = { sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        email: user.email,
        description: user.description,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }
  }
}
