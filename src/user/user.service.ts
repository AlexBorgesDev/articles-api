import * as bcrypt from 'bcrypt'

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'

import { UserChangeDto, UserCreateDto } from './user.dto'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: ObjectID) {
    return this.userRepository.findOneBy({ id })
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email })
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

    const user = this.userRepository.create({ ...data, password: passwordHash })
    return this.userRepository.save(user)
  }

  async change(data: UserChangeDto, userID: ObjectID) {
    const alreadyExist = await this.findById(userID)

    if (!alreadyExist) {
      throw new UnauthorizedException('Invalid token')
    }

    return this.userRepository.update({ id: userID }, data)
  }

  async delete(userID: ObjectID) {
    const alreadyExist = await this.findById(userID)

    if (!alreadyExist) {
      throw new UnauthorizedException('Invalid token')
    }

    return this.userRepository.delete({ id: userID })
  }
}
