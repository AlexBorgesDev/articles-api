import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class SearchPaginationDto {
  @ApiProperty({ required: false, example: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number

  @ApiProperty({ required: false, example: 20, minimum: 5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(5)
  take?: number
}

export class SearchValue extends SearchPaginationDto {
  @ApiProperty({ required: true, minLength: 1 })
  @MinLength(1)
  @IsString()
  value: string
}
