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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

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
import { PostSwagger } from './post.swagger'

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private service: PostService) {}

  @Get('user')
  @ApiBearerAuth()
  @ApiResponse(PostSwagger.indexByUser.ok)
  @ApiResponse(PostSwagger.indexByUser.bad)
  @ApiResponse(PostSwagger.indexByUser.unauthorized)
  async indexByUser(
    @Query() pagination: PostPaginationDto,
    @UserID() userID: string,
  ) {
    const posts = await this.service.getAllByUser(pagination, userID)
    return {
      page: pagination.page || 1,
      take: pagination.take || 20,
      data: posts,
      total: posts.length,
    }
  }

  @Get('check/:slug')
  @ApiBearerAuth()
  @ApiResponse(PostSwagger.checkSlug.ok)
  @ApiResponse(PostSwagger.checkSlug.bad)
  @ApiResponse(PostSwagger.checkSlug.unauthorized)
  async checkSlug(@Param() { slug }: PostParamSlugDto) {
    const slugAlreadyExist = await this.service.slugAlreadyExists(slug)
    return { slugAlreadyExist }
  }

  @Get('user/:id')
  @ApiBearerAuth()
  @ApiResponse(PostSwagger.showById.ok)
  @ApiResponse(PostSwagger.showById.bad)
  @ApiResponse(PostSwagger.showById.notFound)
  @ApiResponse(PostSwagger.showById.unauthorized)
  async showById(@Param() { id }: PostParamIdDto, @UserID() userID: string) {
    return await this.service.getById(id, userID)
  }

  @Get()
  @Public()
  @ApiResponse(PostSwagger.index.ok)
  @ApiResponse(PostSwagger.index.bad)
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
  @ApiResponse(PostSwagger.show.ok)
  @ApiResponse(PostSwagger.show.bad)
  async show(@Param() { slug }: PostParamSlugDto) {
    return await this.service.getBySlug(slug)
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse(PostSwagger.create.bad)
  @ApiResponse(PostSwagger.create.success)
  @ApiResponse(PostSwagger.create.unauthorized)
  async create(@Body() data: PostCreateDto, @UserID() userID: string) {
    const post = await this.service.create(data, userID)
    return { message: 'Post created successfully', slug: post.slug }
  }

  @Patch()
  @ApiBearerAuth()
  @ApiResponse(PostSwagger.change.ok)
  @ApiResponse(PostSwagger.change.bad)
  @ApiResponse(PostSwagger.change.notFound)
  @ApiResponse(PostSwagger.change.unauthorized)
  async change(@Body() data: PostChangeDto, @UserID() userID: string) {
    const post = await this.service.change(data, userID)
    return { message: 'Post updated successfully', slug: post.slug }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse(PostSwagger.delete.ok)
  @ApiResponse(PostSwagger.delete.bad)
  @ApiResponse(PostSwagger.delete.notFound)
  @ApiResponse(PostSwagger.delete.unauthorized)
  async delete(@Param() { id }: PostDeleteDto, @UserID() userID: string) {
    await this.service.delete(id, userID)
    return { message: 'Post deleted successfully' }
  }
}
