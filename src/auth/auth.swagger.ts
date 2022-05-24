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
}

// --------------------------------------------
// --------------------------------------------

export class AuthSwagger {
  static login = new AuthSwaggerLogin()
}
