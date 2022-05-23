import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreatePictureDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string
}

export class CreatePictureServiceDto {
  @IsNumber()
  size: number

  @IsString()
  filename: string

  @IsString()
  @IsOptional()
  description?: string
}

export class ChangePictureDto {
  @ApiProperty({ example: '5e12faa1-a598-4bcb-bcf9-45e31a46d63a' })
  @IsUUID()
  id: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string
}

export class PictureDeleteDto {
  @ApiProperty({ example: '5e12faa1-a598-4bcb-bcf9-45e31a46d63a' })
  @IsUUID()
  id: string
}

export class PicturePaginationDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(5)
  take?: number
}
