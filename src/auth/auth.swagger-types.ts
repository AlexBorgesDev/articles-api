import { ApiProperty } from '@nestjs/swagger'

// ----------- generics -----------
class AuthUnauthorizedType {
  @ApiProperty({ default: 401 })
  statusCode: number

  @ApiProperty({ default: 'Email or password is invalid' })
  message: string

  @ApiProperty({ default: 'Unauthorized' })
  error: string
}

class AuthInputType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({
    example: ['password must be longer than or equal to 8 characters'],
  })
  message: string[]

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

// ----------- login -----------
class AuthLoginOkUserType {
  @ApiProperty({ example: 'email@email.com' })
  email: string

  @ApiProperty({ nullable: true })
  description?: string

  @ApiProperty({ example: 'Irineu', minLength: 2 })
  firstName: string

  @ApiProperty({ example: 'Silva', minLength: 2 })
  lastName: string
}

class AuthLoginOkType {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMTk1NzY1MS03ZjJiLTRhNjAtYjU4ZC1jZWI4MTU3MGIzZWQiLCJpYXQiOjE2NTMzNTE4ODAsImV4cCI6MTY1MzQzODI4MH0.RC7aNh8RGppbtpJzmVU998ZfE_JPLx-9L3YiFs6t3Pc',
  })
  accessToken: string

  @ApiProperty()
  user: AuthLoginOkUserType
}

// --------------------------------------------
// --------------------------------------------

export class AuthSwaggerTypes {
  static login = {
    ok: AuthLoginOkType,
    bad: AuthInputType,
    unauthorized: AuthUnauthorizedType,
  }
}
