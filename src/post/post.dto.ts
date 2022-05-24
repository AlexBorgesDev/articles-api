import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsLowercase,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator'

export enum PostItemTag {
  text = 'text',
  code = 'code',
  image = 'image',
  subtitle = 'subtitle',
}

export class PostItemDto {
  @ApiProperty({ enum: PostItemTag })
  @IsString()
  @IsEnum(PostItemTag, { each: true })
  tag: PostItemTag

  @ApiProperty()
  @IsString()
  data: string

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @Min(0)
  index: number

  @ApiProperty({
    required: false,
    example: 'a5f5b305-ae3d-493e-a940-b7a5f27a8373',
  })
  @IsOptional()
  @IsUUID()
  pictureId?: string
}

export class CreatePostDto {
  @ApiProperty({ example: 'this-is-the-article-slug' })
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  @IsLowercase()
  slug: string

  @ApiProperty({ example: 'This is the title of the post' })
  @IsString()
  @MinLength(4)
  @MaxLength(124)
  title: string

  @ApiProperty({ example: '5629df5e-75c1-4710-a53b-b0f02a4a47b4' })
  @IsUUID()
  bannerId: string

  @ApiProperty()
  @Type(() => PostItemDto)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  data: PostItemDto[]
}

export class ChangePostItemDto {
  @ApiProperty({ example: 'be6c862e-ad7f-4d17-aaea-84d2b646bc83' })
  @IsUUID()
  id: string

  @ApiProperty({ required: false, enum: PostItemTag })
  @IsOptional()
  @IsString()
  @IsEnum(PostItemTag, { each: true })
  tag?: PostItemTag

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  data?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  index?: number

  @ApiProperty({
    required: false,
    example: 'a5f5b305-ae3d-493e-a940-b7a5f27a8373',
  })
  @IsOptional()
  @IsUUID()
  pictureId?: string
}

export class ChangePostDto {
  @ApiProperty({ example: '1d7624c1-a0c8-44a6-b2f3-332d7e63924e' })
  @IsUUID()
  id: string

  @ApiProperty({ required: false, example: 'this-is-the-article-slug' })
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(200)
  @IsLowercase()
  slug?: string

  @ApiProperty({ required: false, example: 'This is the title of the post' })
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(124)
  title?: string

  @ApiProperty({
    required: false,
    example: '5629df5e-75c1-4710-a53b-b0f02a4a47b4',
  })
  @IsOptional()
  @IsUUID()
  bannerId?: string

  @ApiProperty({ required: false })
  @Type(() => ChangePostItemDto)
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  data?: ChangePostItemDto[]
}

export class DeletePostDto {
  @ApiProperty({ example: '1d7624c1-a0c8-44a6-b2f3-332d7e63924e' })
  @IsUUID()
  id: string
}

export class PostPaginationDto {
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

export class PostParamSlugDto {
  @ApiProperty({ example: 'this-is-the-article-slug' })
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  @IsLowercase()
  slug: string
}

export class PostParamIdDto {
  @ApiProperty({ example: '1d7624c1-a0c8-44a6-b2f3-332d7e63924e' })
  @IsUUID()
  id: string
}