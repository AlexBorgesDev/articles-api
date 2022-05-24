import { ApiResponseOptions } from '@nestjs/swagger'

import { PostSwaggerTypes } from './post.swagger-types'

// ----------- index -----------
class PostSwaggerIndex {
  ok: ApiResponseOptions = {
    status: 200,
    type: PostSwaggerTypes.index.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PostSwaggerTypes.index.bad,
  }
}

// ----------- create -----------
class PostSwaggerCreate {
  bad: ApiResponseOptions = {
    status: 400,
    type: PostSwaggerTypes.create.bad,
  }

  success: ApiResponseOptions = {
    status: 201,
    type: PostSwaggerTypes.create.success,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PostSwaggerTypes.create.unauthorized,
  }
}

// ----------- show -----------
class PostSwaggerShow {
  ok: ApiResponseOptions = {
    status: 200,
    type: PostSwaggerTypes.show.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PostSwaggerTypes.show.bad,
  }
}

// ----------- change -----------
class PostSwaggerChange {
  ok: ApiResponseOptions = {
    status: 200,
    type: PostSwaggerTypes.change.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PostSwaggerTypes.change.bad,
  }

  notFound: ApiResponseOptions = {
    status: 404,
    type: PostSwaggerTypes.change.notFound,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PostSwaggerTypes.change.unauthorized,
  }
}

// ----------- delete -----------
class PostSwaggerDelete {
  ok: ApiResponseOptions = {
    status: 200,
    type: PostSwaggerTypes.delete.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PostSwaggerTypes.delete.bad,
  }

  notFound: ApiResponseOptions = {
    status: 404,
    type: PostSwaggerTypes.delete.notFound,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PostSwaggerTypes.delete.unauthorized,
  }
}

// ----------- checkSlug -----------
class PostSwaggerCheckSlug {
  ok: ApiResponseOptions = {
    status: 200,
    type: PostSwaggerTypes.checkSlug.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PostSwaggerTypes.checkSlug.bad,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PostSwaggerTypes.checkSlug.unauthorized,
  }
}

// ----------- indexByUser -----------
class PostSwaggerIndexByUser {
  ok: ApiResponseOptions = {
    status: 200,
    type: PostSwaggerTypes.indexByUser.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PostSwaggerTypes.indexByUser.bad,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PostSwaggerTypes.indexByUser.unauthorized,
  }
}

// ----------- showById -----------
class PostSwaggerShowById {
  ok: ApiResponseOptions = {
    status: 200,
    type: PostSwaggerTypes.showById.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PostSwaggerTypes.showById.bad,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PostSwaggerTypes.showById.unauthorized,
  }
}

// --------------------------------------------
// --------------------------------------------

export class PostSwagger {
  static index = new PostSwaggerIndex()

  static show = new PostSwaggerShow()

  static create = new PostSwaggerCreate()

  static change = new PostSwaggerChange()

  static delete = new PostSwaggerDelete()

  static checkSlug = new PostSwaggerCheckSlug()

  static indexByUser = new PostSwaggerIndexByUser()

  static showById = new PostSwaggerShowById()
}
