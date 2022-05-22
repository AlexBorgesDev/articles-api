import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class AuthLoginDto {
  @ApiProperty({ example: 'email@email.com' })
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string
}
