import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { Public } from '../auth/public.decorator'
import { UserID } from '../auth/userID.decorator'

import {
  PostChangeDto,
  PostCreateDto,
  PostDeleteDto,
  PostPaginationDto,
  PostParamIdDto,
  PostParamSlugDto,
} from './post.dto'
import { PostService } from './post.service'

@Controller('posts')
export class PostController {
  constructor(private service: PostService) {}

  @Get()
  @Public()
  async index(@Query() pagination: PostPaginationDto) {
    const posts = await this.service.getAll(pagination)
    return {
      page: pagination.page || 1,
      take: pagination.take || 20,
      data: posts,
      total: posts.length,
    }
  }

  @Get(':slug')
  @Public()
  async show(@Param() { slug }: PostParamSlugDto) {
    const post = await this.service.getBySlug(slug)
    return post
  }

  @Post()
  async create(@Body() data: PostCreateDto, @UserID() userID: string) {
    const post = await this.service.create(data, userID)
    return { message: 'Post created successfully', slug: post.slug }
  }

  @Patch()
  async change(@Body() data: PostChangeDto, @UserID() userID: string) {
    const post = await this.service.change(data, userID)
    return { message: 'Post updated successfully', slug: post.slug }
  }

  @Delete(':id')
  async delete(@Param() { id }: PostDeleteDto, @UserID() userID: string) {
    await this.service.delete(id, userID)
    return { message: 'Post deleted successfully' }
  }

  @Get('/check/:slug')
  async checkSlug(@Param() { slug }: PostParamSlugDto) {
    const slugAlreadyExist = await this.service.slugAlreadyExists(slug)
    return { slugAlreadyExist }
  }

  @Get('/user')
  async indexByUser(
    @Query() pagination: PostPaginationDto,
    @UserID() userID: string,
  ) {
    return await this.service.getAllByUser(pagination, userID)
  }

  @Get('/user/:id')
  async showById(@Param() { id }: PostParamIdDto, @UserID() userID: string) {
    return await this.service.getById(id, userID)
  }
}
