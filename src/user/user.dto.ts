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

  @ApiProperty({ example: 'Irineu' })
  @IsString()
  @MinLength(2)
  firstName: string

  @ApiProperty({ example: 'Silva' })
  @IsString()
  @MinLength(2)
  lastName: string

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string

  @IsString()
  @IsOptional()
  @MinLength(24)
  description?: string
}

export class UserChangeDto {
  @ApiProperty({ example: 'email@email.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string

  @ApiProperty({ example: 'Irineu' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string

  @ApiProperty({ example: 'Silva' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(16)
  password?: string

  @IsString()
  @IsOptional()
  @MinLength(24)
  description?: string
}
