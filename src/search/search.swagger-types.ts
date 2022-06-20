import { ApiProperty } from '@nestjs/swagger'

// ----------- generics -----------
class SearchPaginationType {
  @ApiProperty({ default: 400 })
  statusCode: number

  @ApiProperty({ example: ['page must not be less than 1'] })
  message: string[]

  @ApiProperty({ default: 'Bad Request' })
  error: string
}

// ----------- posts -----------
class SearchPostsOkPostBannerType {
  @ApiProperty({ example: '1653422438841-image.png' })
  filename: string

  @ApiProperty({ nullable: true })
  description: string
}

class SearchPostsOkPostOwnerType {
  @ApiProperty({ example: 'Irineu' })
  firstName: string

  @ApiProperty({ example: 'Silva' })
  lastName: string
}

class SearchPostsOkPostType {
  @ApiProperty({ example: 'this-is-the-article-slug' })
  slug: string

  @ApiProperty({ example: 'This is the title of the post' })
  title: string

  @ApiProperty()
  banner: SearchPostsOkPostBannerType

  @ApiProperty()
  owner: SearchPostsOkPostOwnerType
}

class SearchPostOkType {
  @ApiProperty({ example: 1, minimum: 1 })
  page: number

  @ApiProperty({ example: 20, minimum: 5 })
  take: number

  @ApiProperty({ isArray: true, type: SearchPostsOkPostType })
  data: SearchPostsOkPostType[]

  @ApiProperty({ example: 1, minimum: 0 })
  total: number
}

export class SearchSwaggerTypes {
  static posts = { ok: SearchPostOkType, bad: SearchPaginationType }
}
