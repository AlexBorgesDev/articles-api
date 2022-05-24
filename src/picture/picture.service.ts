import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import {
  ChangePictureDto,
  CreatePictureServiceDto,
  PicturePaginationDto,
} from './picture.dto'
import { deletePictures } from './picture.utils'

@Injectable()
export class PictureService {
  constructor(private prisma: PrismaService) {}

  async getAllByOwner(pagination: PicturePaginationDto, userID: string) {
    return this.prisma.picture.findMany({
      where: { ownerId: userID },
      skip: pagination.take || 20 * ((pagination.page || 1) - 1),
      take: pagination.take || 20,
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(data: CreatePictureServiceDto, userID: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userID } })

    if (!user) {
      deletePictures([data.filename])
      throw new UnauthorizedException('Invalid token')
    }

    try {
      return await this.prisma.picture.create({
        data: { ...data, ownerId: userID },
      })
    } catch (e) {
      deletePictures([data.filename])
      throw new BadRequestException(
        'Something went wrong while uploading the image',
      )
    }
  }

  async change(data: ChangePictureDto, userID: string) {
    const picture = await this.prisma.picture.findFirst({
      where: { id: data.id, ownerId: userID },
    })

    if (!picture) throw new NotFoundException('Picture not found')

    return this.prisma.picture.update({
      where: { id: data.id },
      data: { description: data.description },
    })
  }

  async delete(id: string, userID: string) {
    const picture = await this.prisma.picture.findFirst({
      where: { id, ownerId: userID },
    })

    if (!picture) throw new NotFoundException('Picture not found')

    const result = await this.prisma.picture.delete({ where: { id } })

    deletePictures([picture.filename])
    return result
  }

  async deletePictures(userID?: string) {
    const pictures = await this.prisma.picture.findMany({
      where: { ownerId: userID || null },
      select: { id: true, filename: true },
    })

    deletePictures(pictures.map(({ filename }) => filename))
    return pictures
  }
}
