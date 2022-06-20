import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { SearchPaginationDto } from './search.dto'

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async posts(value: string, pagination: SearchPaginationDto) {
    return this.prisma.post.findMany({
      skip: (pagination.take || 20) * ((pagination.page || 1) - 1),
      take: pagination.take || 20,
      where: { title: { search: value } },
      select: {
        slug: true,
        title: true,
        banner: { select: { filename: true, description: true } },
        owner: { select: { firstName: true, lastName: true } },
      },
    })
  }
}
