import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UserCreateDto {
  @ApiProperty({ example: 'email@email.com' })
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Irineu', minLength: 2 })
  @IsString()
  @MinLength(2)
  firstName: string

  @ApiProperty({ example: 'Silva', minLength: 2 })
  @IsString()
  @MinLength(2)
  lastName: string

  @ApiProperty({ example: '123456789', minLength: 8, maxLength: 16 })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string

  @ApiProperty({ required: false, minLength: 24 })
  @IsString()
  @IsOptional()
  @MinLength(24)
  description?: string
}

export class UserChangeDto {
  @ApiProperty({ example: 'email@email.com', required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string

  @ApiProperty({ example: 'Irineu', required: false, minLength: 2 })
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string

  @ApiProperty({ example: 'Silva', required: false, minLength: 2 })
  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string

  @ApiProperty({ required: false, minLength: 24 })
  @IsString()
  @IsOptional()
  @MinLength(24)
  description?: string
}

export class UserChangePasswordDto {
  @ApiProperty({ example: '123456789', minLength: 8, maxLength: 16 })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  currentPassword: string

  @ApiProperty({ example: '987654321', minLength: 8, maxLength: 16 })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  newPassword: string
}
