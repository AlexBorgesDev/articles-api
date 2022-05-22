import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ObjectID } from 'typeorm'

export const UserID = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user.userID as ObjectID
})
