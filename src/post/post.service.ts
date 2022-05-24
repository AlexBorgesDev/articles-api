import slugify from 'slugify'

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { PostChangeDto, PostCreateDto, PostPaginationDto } from './post.dto'

@Injectable()
export class PostService {
  constructor(private service: PrismaService) {}

  async slugAlreadyExists(slug: string) {
    const post = await this.service.post.findFirst({ where: { slug } })
    return !!post
  }

  async getById(id: string, userID: string) {
    const post = this.service.post.findFirst({
      where: { id, ownerId: userID },
      select: {
        id: true,
        slug: true,
        title: true,
        banner: { select: { id: true, filename: true, description: true } },
        data: {
          select: {
            id: true,
            tag: true,
            data: true,
            index: true,
            picture: {
              select: { id: true, filename: true, description: true },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!post) throw new NotFoundException('Post not found')

    return post
  }

  async getBySlug(slug: string) {
    return this.service.post.findFirst({
      where: { slug },
      select: {
        slug: true,
        title: true,
        banner: { select: { filename: true, description: true } },
        data: {
          select: {
            tag: true,
            data: true,
            index: true,
            picture: { select: { filename: true, description: true } },
          },
        },
        owner: {
          select: { firstName: true, lastName: true, description: true },
        },
        createdAt: true,
      },
    })
  }

  async getAll(pagination: PostPaginationDto) {
    return this.service.post.findMany({
      skip: pagination.take || 20 * ((pagination.page || 1) - 1),
      take: pagination.take || 20,
      select: {
        slug: true,
        title: true,
        banner: { select: { filename: true, description: true } },
        owner: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAllByUser(pagination: PostPaginationDto, userID: string) {
    return this.service.post.findMany({
      where: { ownerId: userID },
      skip: pagination.take || 20 * ((pagination.page || 1) - 1),
      take: pagination.take || 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        banner: { select: { filename: true, description: true } },
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async create(data: PostCreateDto, userID: string) {
    const user = await this.service.user.findFirst({ where: { id: userID } })

    if (!user) throw new UnauthorizedException('Invalid token')

    const slugAlreadyExists = await this.slugAlreadyExists(data.slug)

    if (slugAlreadyExists) {
      throw new BadRequestException(
        'There is already a post with the same slug',
      )
    }

    return this.service.post.create({
      data: {
        slug: slugify(data.slug, { lower: true, strict: true }),
        title: data.title,
        bannerId: data.bannerId,
        ownerId: userID,
        data: {
          createMany: {
            data: data.data.map(item => ({
              tag: item.tag,
              data: item.data,
              index: item.index,
              pictureId: item.pictureId,
            })),
          },
        },
      },
    })
  }

  async change({ id, ...data }: PostChangeDto, userID: string) {
    const post = await this.service.post.findFirst({
      where: { id, ownerId: userID },
    })

    if (!post) throw new NotFoundException('Post not found')

    const itemsToUpdate = data.data?.filter(({ id }) => id) || []
    const itemsToCreate = (data.data || []).filter(item => {
      return !item.id && item.tag && typeof item.index === 'number'
    })

    return this.service.post.update({
      where: { id },
      data: {
        slug: slugify(data.slug, { lower: true, strict: true }),
        title: data.title,
        bannerId: data.bannerId,
        data: {
          createMany: {
            data: itemsToCreate.map(item => ({
              tag: item.tag,
              data: item.data || '',
              index: item.index,
              pictureId: item.pictureId,
            })),
          },
          updateMany: itemsToUpdate.map(item => ({
            where: { id: item.id, postId: id },
            data: {
              tag: item.tag,
              data: item.data,
              index: item.index,
              pictureId: item.pictureId,
            },
          })),
        },
      },
    })
  }

  async delete(id: string, userID: string) {
    const post = await this.service.post.findFirst({
      where: { id, ownerId: userID },
    })

    if (!post) throw new NotFoundException('Post not found')

    return this.service.post.delete({ where: { id } })
  }
}
