import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { PictureController } from './picture.controller'
import { PictureService } from './picture.service'

@Module({
  controllers: [PictureController],
  providers: [PrismaService, PictureService],
  exports: [PictureService],
})
export class PictureModule {}
