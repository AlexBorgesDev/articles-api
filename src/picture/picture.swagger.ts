import { ApiResponseOptions } from '@nestjs/swagger'

import { PictureSwaggerTypes } from './picture.swagger-types'

// ----------- index -----------
class PictureSwaggerIndex {
  ok: ApiResponseOptions = {
    status: 200,
    type: PictureSwaggerTypes.index.ok,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PictureSwaggerTypes.index.unauthorized,
  }
}

// ----------- create -----------
class PictureSwaggerCreate {
  bad: ApiResponseOptions = {
    status: 400,
    type: PictureSwaggerTypes.create.bad,
  }

  success: ApiResponseOptions = {
    status: 201,
    type: PictureSwaggerTypes.create.success,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PictureSwaggerTypes.create.unauthorized,
  }
}

// ----------- change -----------
class PictureSwaggerChange {
  ok: ApiResponseOptions = {
    status: 200,
    type: PictureSwaggerTypes.change.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PictureSwaggerTypes.change.bad,
  }

  notFound: ApiResponseOptions = {
    status: 404,
    type: PictureSwaggerTypes.change.notFound,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PictureSwaggerTypes.change.unauthorized,
  }
}

// ----------- change -----------
class PictureSwaggerDelete {
  ok: ApiResponseOptions = {
    status: 200,
    type: PictureSwaggerTypes.delete.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: PictureSwaggerTypes.delete.bad,
  }

  notFound: ApiResponseOptions = {
    status: 404,
    type: PictureSwaggerTypes.delete.notFound,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: PictureSwaggerTypes.delete.unauthorized,
  }
}

// --------------------------------------------
// --------------------------------------------

export class PictureSwagger {
  static index = new PictureSwaggerIndex()

  static create = new PictureSwaggerCreate()

  static change = new PictureSwaggerChange()

  static delete = new PictureSwaggerDelete()
}
