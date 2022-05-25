import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'

import { Paths } from './config/paths'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { PictureModule } from './picture/picture.module'
import { PostModule } from './post/post.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PictureModule,
    PostModule,
    ServeStaticModule.forRoot({
      serveRoot: '/files',
      rootPath: Paths.localUploads,
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
