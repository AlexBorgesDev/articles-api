import { ApiResponseOptions } from '@nestjs/swagger'

import { AuthSwaggerTypes } from './auth.swagger-types'

// ----------- login -----------
class AuthSwaggerLogin {
  ok: ApiResponseOptions = {
    status: 200,
    type: AuthSwaggerTypes.login.ok,
  }

  bad: ApiResponseOptions = {
    status: 400,
    type: AuthSwaggerTypes.login.bad,
  }

  unauthorized: ApiResponseOptions = {
    status: 401,
    type: AuthSwaggerTypes.login.unauthorized,
  }
}

// --------------------------------------------
// --------------------------------------------

export class AuthSwagger {
  static login = new AuthSwaggerLogin()
}
