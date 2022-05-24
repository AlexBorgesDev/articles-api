import { ApiProperty } from '@nestjs/swagger'

// ----------- generics -----------
class PictureUnauthorizedType {
  @ApiProperty({ default: 401 })
  statusCode: number

  @ApiProperty({
    examples: ['Unauthorized', 'Invalid token'],
    default: 'Unauthorized',
  })
  message: string
}

class PictureInputType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({ example: ['id must be a UUID'] })
  message: string[]

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

class PictureNotFoundType {
  @ApiProperty({ default: 404 })
  statusCode: number

  @ApiProperty({ default: 'Picture not found' })
  message: string

  @ApiProperty({ default: 'Not Found' })
  error: string
}

class PicturePictureType {
  @ApiProperty({ example: '034f91f8-1dae-409c-ac83-ac80019014a2' })
  id: string

  @ApiProperty({ nullable: true, required: false })
  description?: string

  @ApiProperty({ example: '1653416536280-image.png' })
  filename: string

  @ApiProperty({ example: 1048576, minimum: 0 })
  size: number
}

// ----------- show -----------
class PictureShowOkType {
  @ApiProperty({ minimum: 1, example: 1 })
  page: number

  @ApiProperty({ minimum: 5, example: 20 })
  take: number

  @ApiProperty({ type: PicturePictureType })
  data: PicturePictureType[]

  @ApiProperty({ minimum: 0, example: 1 })
  total: number
}

// ----------- create -----------
class PictureCreateSuccessType {
  @ApiProperty({ default: 'Picture uploaded successfully' })
  message: string

  @ApiProperty()
  picture: PicturePictureType
}

class PictureCreateBadType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({ default: 'Invalid file type.' })
  message: string

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

// ----------- change -----------
class PictureChangeOkType {
  @ApiProperty({ default: 'Picture changed successfully' })
  message: string

  @ApiProperty()
  picture: PicturePictureType
}

// ----------- delete -----------
class PictureDeleteOkType {
  @ApiProperty({ default: 'Picture deleted successfully' })
  message: string
}

// --------------------------------------------
// --------------------------------------------

export class PictureSwaggerTypes {
  static show = {
    ok: PictureShowOkType,
    unauthorized: PictureUnauthorizedType,
  }

  static create = {
    bad: PictureCreateBadType,
    success: PictureCreateSuccessType,
    unauthorized: PictureUnauthorizedType,
  }

  static change = {
    ok: PictureChangeOkType,
    bad: PictureInputType,
    notFound: PictureNotFoundType,
    unauthorized: PictureUnauthorizedType,
  }

  static delete = {
    ok: PictureDeleteOkType,
    bad: PictureInputType,
    notFound: PictureNotFoundType,
    unauthorized: PictureUnauthorizedType,
  }
}
