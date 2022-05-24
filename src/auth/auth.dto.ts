import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class AuthLoginDto {
  @ApiProperty({ example: 'email@email.com' })
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({ example: '123456789', minLength: 8, maxLength: 16 })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string
}
