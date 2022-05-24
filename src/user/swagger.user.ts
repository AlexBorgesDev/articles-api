import { ApiResponseOptions } from '@nestjs/swagger'

import { UserSwaggerTypes } from './swagger-types.user'

// ----------- show -----------
class UserSwaggerShow {
  ok: ApiResponseOptions = {
    status: 200,
    type: UserSwaggerTypes.show.ok,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: UserSwaggerTypes.show.unauthorized,
  }
}

// ----------- create -----------
class UserSwaggerCreate {
  bad: ApiResponseOptions = {
    status: 400,
    type: UserSwaggerTypes.create.bad,
  }

  success: ApiResponseOptions = {
    status: 201,
    type: UserSwaggerTypes.create.success,
  }
}

// ----------- change -----------
class UserSwaggerChange {
  ok: ApiResponseOptions = {
    status: 200,
    type: UserSwaggerTypes.change.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: UserSwaggerTypes.change.bad,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: UserSwaggerTypes.change.unauthorized,
  }
}

// ----------- changePassword -----------
class UserSwaggerChangePassword {
  ok: ApiResponseOptions = {
    status: 200,
    type: UserSwaggerTypes.changePassword.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: UserSwaggerTypes.changePassword.bad,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: UserSwaggerTypes.changePassword.unauthorized,
  }
}

// ----------- delete -----------
class UserSwaggerDelete {
  ok: ApiResponseOptions = {
    status: 200,
    type: UserSwaggerTypes.delete.ok,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: UserSwaggerTypes.change.unauthorized,
  }
}

// --------------------------------------------
// --------------------------------------------

export class UserSwagger {
  static show = new UserSwaggerShow()

  static create = new UserSwaggerCreate()

  static change = new UserSwaggerChange()

  static changePassword = new UserSwaggerChangePassword()

  static delete = new UserSwaggerDelete()
}
