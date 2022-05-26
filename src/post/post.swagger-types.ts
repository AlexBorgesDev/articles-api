import { ApiProperty } from '@nestjs/swagger'

import { PostItemTag } from './post.dto'

// ----------- generics -----------
class PostUnauthorizedType {
  @ApiProperty({ default: 401 })
  statusCode: number

  @ApiProperty({
    examples: ['Unauthorized', 'Invalid token'],
    default: 'Unauthorized',
  })
  message: string
}

class PostNotFountType {
  @ApiProperty({ default: 404 })
  statusCode: number

  @ApiProperty({ default: 'Post not found' })
  message: string

  @ApiProperty({ default: 'Not Found' })
  error: string
}

class PostInputIdType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({ example: ['id must be a UUID'] })
  message: string[]

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

class PostInputSlugType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({
    example: ['slug must be longer than or equal to 4 characters'],
  })
  message: string[]

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

class PostSlugBadType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({ example: 'There is already a post with the same slug' })
  message: string

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

class PostPaginationType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({ example: ['page must not be less than 1'] })
  message: string[]

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

// ----------- index -----------
class PostIndexOkPostBannerType {
  @ApiProperty({ example: '1653422438841-image.png' })
  filename: string

  @ApiProperty({ nullable: true })
  description: string
}

class PostIndexOkPostOwnerType {
  @ApiProperty({ example: 'Irineu' })
  firstName: string

  @ApiProperty({ example: 'Silva' })
  lastName: string
}

class PostIndexOkPostType {
  @ApiProperty({ example: 'this-is-the-article-slug' })
  slug: string

  @ApiProperty({ example: 'This is the title of the post' })
  title: string

  @ApiProperty()
  banner: PostIndexOkPostBannerType

  @ApiProperty()
  owner: PostIndexOkPostOwnerType
}

class PostIndexOkType {
  @ApiProperty({ example: 1, minimum: 1 })
  page: number

  @ApiProperty({ example: 20, minimum: 5 })
  take: number

  @ApiProperty({ isArray: true, type: PostIndexOkPostType })
  data: PostIndexOkPostType[]

  @ApiProperty({ example: 1, minimum: 0 })
  total: number
}

// ----------- show -----------
class PostShowOkBannerType {
  @ApiProperty({ example: '1653422438841-image.png' })
  filename: string

  @ApiProperty({ nullable: true })
  description: string
}

class PostShowOkOwnerType {
  @ApiProperty({ example: 'Irineu' })
  firstName: string

  @ApiProperty({ example: 'Silva' })
  lastName: string
}

class PostShowOkPictureType {
  @ApiProperty({ example: '1653427610323-image.png' })
  filename: string

  @ApiProperty()
  description: string
}

class PostShowOkDataType {
  @ApiProperty({ enum: PostItemTag, example: 'image' })
  tag: PostItemTag

  @ApiProperty({ example: '' })
  data: string

  @ApiProperty({ example: 0 })
  index: number

  @ApiProperty({ nullable: true })
  picture: PostShowOkPictureType
}

class PostShowOkType {
  @ApiProperty({ example: 'this-is-the-article-slug' })
  slug: string

  @ApiProperty({ example: 'This is the title of the post' })
  title: string

  @ApiProperty()
  banner: PostShowOkBannerType

  @ApiProperty({ isArray: true, type: PostShowOkDataType })
  data: PostShowOkDataType[]

  @ApiProperty()
  owner: PostShowOkOwnerType

  @ApiProperty()
  createdAt: Date
}

// ----------- create -----------
class PostCreateSuccessType {
  @ApiProperty({ default: 'Post created successfully' })
  message: string

  @ApiProperty({ example: 'this-is-the-article-slug' })
  slug: string
}

// ----------- change -----------
class PostChangeOkType {
  @ApiProperty({ default: 'Post updated successfully' })
  message: string

  @ApiProperty({ example: 'this-is-the-article-slug' })
  slug: string
}

// ----------- delete -----------
class PostDeleteOkType {
  @ApiProperty({ default: 'Post deleted successfully' })
  message: string
}

// ----------- checkSlug -----------
class PostCheckSlugOkType {
  @ApiProperty()
  slugAlreadyExist: boolean
}

// ----------- indexByUser -----------
class PostIndexByUserOkDataBannerType {
  @ApiProperty({ example: '1653422438841-image.png' })
  filename: string

  @ApiProperty()
  description: string
}

class PostIndexByUserOkDataType {
  @ApiProperty({ example: '1d7624c1-a0c8-44a6-b2f3-332d7e63924e' })
  id: string

  @ApiProperty({ example: 'this-is-the-article-slug' })
  slug: string

  @ApiProperty({ example: 'This is the title of the post' })
  title: string

  @ApiProperty()
  banner: PostIndexByUserOkDataBannerType

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

class PostIndexByUserOkType {
  @ApiProperty({ example: 1, minimum: 1 })
  page: number

  @ApiProperty({ example: 20, minimum: 5 })
  take: number

  @ApiProperty({ isArray: true, type: PostIndexByUserOkDataType })
  data: PostIndexByUserOkDataType[]

  @ApiProperty({ example: 1, minimum: 0 })
  total: number
}

// ----------- showById -----------
class PostShowByIdOkBannerType {
  @ApiProperty({ example: '4a60b0ec-a026-429f-b091-aa97d19e6bd4' })
  id: string

  @ApiProperty({ example: '1653422438841-image.png' })
  filename: string

  @ApiProperty({ nullable: true })
  description: string
}

class PostShowByIdOkPictureType {
  @ApiProperty({ example: 'a5f5b305-ae3d-493e-a940-b7a5f27a8373' })
  id: string

  @ApiProperty({ example: '1653427610323-image.png' })
  filename: string

  @ApiProperty()
  description: string
}

class PostShowByIdOkDataType {
  @ApiProperty({ example: '626530ad-58da-4209-af88-ea24ff467cc8' })
  id: string

  @ApiProperty({ enum: PostItemTag, example: 'image' })
  tag: PostItemTag

  @ApiProperty({ example: '' })
  data: string

  @ApiProperty({ example: 0, minimum: 0 })
  index: number

  @ApiProperty()
  picture: PostShowByIdOkPictureType

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

class PostShowByIdOkType {
  @ApiProperty({ example: '1d7624c1-a0c8-44a6-b2f3-332d7e63924e' })
  id: string

  @ApiProperty({ example: 'this-is-the-article-slug' })
  slug: string

  @ApiProperty({ example: 'This is the title of the post' })
  title: string

  @ApiProperty()
  banner: PostShowByIdOkBannerType

  @ApiProperty({ isArray: true, type: PostShowByIdOkDataType })
  data: PostShowByIdOkDataType[]

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

// --------------------------------------------
// --------------------------------------------

export class PostSwaggerTypes {
  static index = { ok: PostIndexOkType, bad: PostPaginationType }

  static show = { ok: PostShowOkType, bad: PostInputSlugType }

  static create = {
    bad: PostSlugBadType,
    success: PostCreateSuccessType,
    unauthorized: PostUnauthorizedType,
  }

  static change = {
    ok: PostChangeOkType,
    bad: PostSlugBadType,
    notFound: PostNotFountType,
    unauthorized: PostUnauthorizedType,
  }

  static delete = {
    ok: PostDeleteOkType,
    bad: PostInputIdType,
    notFound: PostNotFountType,
    unauthorized: PostUnauthorizedType,
  }

  static checkSlug = {
    ok: PostCheckSlugOkType,
    bad: PostInputSlugType,
    unauthorized: PostUnauthorizedType,
  }

  static indexByUser = {
    ok: PostIndexByUserOkType,
    bad: PostPaginationType,
    unauthorized: PostUnauthorizedType,
  }

  static showById = {
    ok: PostShowByIdOkType,
    bad: PostInputIdType,
    notFound: PostNotFountType,
    unauthorized: PostUnauthorizedType,
  }
}
