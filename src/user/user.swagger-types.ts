import { ApiProperty } from '@nestjs/swagger'

// ----------- generics -----------
class UserUnauthorizedType {
  @ApiProperty({ default: 401 })
  statusCode: number

  @ApiProperty({
    examples: ['Unauthorized', 'Invalid token', 'Invalid password'],
    default: 'Unauthorized',
  })
  message: string
}

class UserInputType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({
    example: ['password must be longer than or equal to 8 characters'],
  })
  message: string[]

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

// ----------- show -----------
class UserShowOkType {
  @ApiProperty({ example: 'email@email.com' })
  email: string

  @ApiProperty({ nullable: true })
  description?: string

  @ApiProperty({ example: 'Irineu', minLength: 2 })
  firstName: string

  @ApiProperty({ example: 'Silva', minLength: 2 })
  lastName: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

// ----------- create -----------
class UserCreateSuccessType {
  @ApiProperty({ default: 'User created successfully' })
  message: string
}

class UserCreateBadType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({
    default: 'An account with the given email address already exists.',
  })
  message: string
}

// ----------- change -----------
class UserChangeOkUserType {
  @ApiProperty({ example: 'email@email.com' })
  email: string

  @ApiProperty({ nullable: true })
  description?: string

  @ApiProperty({ example: 'Irineu', minLength: 2 })
  firstName: string

  @ApiProperty({ example: 'Silva', minLength: 2 })
  lastName: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

class UserChangeOkType {
  @ApiProperty({ default: 'User changed successfully' })
  message: string

  @ApiProperty()
  user: UserChangeOkUserType
}

// ----------- delete -----------
class UserDeleteOkType {
  @ApiProperty({ default: 'User deleted successfully' })
  message: string
}

// ----------- changePassword -----------
class UserChangePasswordOkType {
  @ApiProperty({ default: 'Password has been successfully changed' })
  message: string
}

class UserChangePasswordBadType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({
    example: ['newPassword must be longer than or equal to 8 characters'],
  })
  message: string[]

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

// --------------------------------------------
// --------------------------------------------

export class UserSwaggerTypes {
  static show = {
    ok: UserShowOkType,
    unauthorized: UserUnauthorizedType,
  }

  static create = {
    bad: UserCreateBadType,
    success: UserCreateSuccessType,
  }

  static change = {
    ok: UserChangeOkType,
    bad: UserInputType,
    unauthorized: UserUnauthorizedType,
  }

  static changePassword = {
    ok: UserChangePasswordOkType,
    bad: UserChangePasswordBadType,
    unauthorized: UserUnauthorizedType,
  }

  static delete = {
    ok: UserDeleteOkType,
  }
}
