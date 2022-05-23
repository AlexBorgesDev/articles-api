import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, AuthModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
