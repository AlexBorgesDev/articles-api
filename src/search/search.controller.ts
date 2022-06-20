import { Controller, Get, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { Public } from '../auth/public.decorator'

import { SearchValue } from './search.dto'
import { SearchService } from './search.service'
import { SearchSwagger } from './search.swagger'

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private service: SearchService) {}

  @Get('/posts')
  @Public()
  @ApiResponse(SearchSwagger.posts.ok)
  @ApiResponse(SearchSwagger.posts.bad)
  async posts(@Query() { value, page, take }: SearchValue) {
    return this.service.posts(value, { page, take })
  }
}
