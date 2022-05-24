import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PictureCreateDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string
}

export class PictureCreateServiceDto {
  @IsNumber()
  size: number

  @IsString()
  filename: string

  @IsString()
  @IsOptional()
  description?: string
}

export class PictureChangeDto {
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
