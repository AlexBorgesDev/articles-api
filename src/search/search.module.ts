import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'

@Module({
  controllers: [SearchController],
  providers: [PrismaService, SearchService],
})
export class SearchModule {}
