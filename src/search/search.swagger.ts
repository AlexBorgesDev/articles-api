import { ApiResponseOptions } from '@nestjs/swagger'
import { SearchSwaggerTypes } from './search.swagger-types'

class SearchSwaggerPosts {
  ok: ApiResponseOptions = {
    status: 200,
    type: SearchSwaggerTypes.posts.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: SearchSwaggerTypes.posts.bad,
  }
}

export class SearchSwagger {
  static posts = new SearchSwaggerPosts()
}
