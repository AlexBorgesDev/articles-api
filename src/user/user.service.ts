import * as bcrypt from 'bcrypt'

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { UserChangeDto, UserChangePasswordDto, UserCreateDto } from './user.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private service: PrismaService) {}

  async findById(id: string) {
    return this.service.user.findFirst({ where: { id } })
  }

  async findByEmail(email: string) {
    return this.service.user.findFirst({ where: { email } })
  }

  async create(data: UserCreateDto) {
    const alreadyExist = await this.findByEmail(data.email)

    if (alreadyExist) {
      throw new BadRequestException(
        'An account with the given email address already exists.',
      )
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.password, salt)

    return this.service.user.create({
      data: {
        email: data.email,
        description: data.description,
        firstName: data.firstName,
        lastName: data.lastName,
        password: passwordHash,
      },
    })
  }

  async change(data: UserChangeDto, userID: string) {
    const alreadyExist = await this.findById(userID)

    if (!alreadyExist) throw new UnauthorizedException('Invalid token')

    return this.service.user.update({
      where: { id: userID },
      data: {
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        description: data.description,
      },
    })
  }

  async changePassword(data: UserChangePasswordDto, userID: string) {
    const user = await this.findById(userID)

    if (!user) throw new UnauthorizedException('Invalid token')
    else if (!bcrypt.compareSync(data.currentPassword, user.password)) {
      throw new UnauthorizedException('Invalid password')
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.newPassword, salt)

    return this.service.user.update({
      where: { id: userID },
      data: { password: passwordHash },
    })
  }

  async delete(userID: string) {
    const alreadyExist = await this.findById(userID)

    if (!alreadyExist) throw new UnauthorizedException('Invalid token')

    return this.service.user.delete({ where: { id: userID } })
  }
}
