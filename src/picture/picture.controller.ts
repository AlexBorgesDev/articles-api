import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { UserID } from '../auth/userID.decorator'
import { MulterOptions } from '../config/multer'
import {
  PictureChangeDto,
  PictureCreateDto,
  PictureDeleteDto,
  PicturePaginationDto,
} from './picture.dto'
import { PictureService } from './picture.service'

@Controller('picture')
export class PictureController {
  constructor(private service: PictureService) {}

  @Get()
  async show(
    @Query() pagination: PicturePaginationDto,
    @UserID() userID: string,
  ) {
    const pictures = await this.service.getAllByOwner(pagination, userID)
    return {
      page: pagination.page || 1,
      take: pagination.take || 20,
      data: pictures.map(picture => ({
        id: picture.id,
        description: picture.description,
        filename: picture.filename,
        size: picture.size,
      })),
      total: pictures.length,
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', MulterOptions.images))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @UserID() userID: string,
    @Body() { description }: PictureCreateDto,
  ) {
    const picture = await this.service.create(
      { filename: file.filename, size: file.size, description },
      userID,
    )

    return {
      message: 'Picture uploaded successfully',
      picture: {
        id: picture.id,
        description: picture.description,
        filename: picture.filename,
        size: picture.size,
      },
    }
  }

  @Patch()
  async change(@Body() data: PictureChangeDto, @UserID() userID: string) {
    const picture = await this.service.change(data, userID)
    return {
      message: 'Picture changed successfully',
      picture: {
        id: picture.id,
        description: picture.description,
        filename: picture.filename,
        size: picture.size,
      },
    }
  }

  @Delete(':id')
  async delete(@Param() { id }: PictureDeleteDto, @UserID() userID: string) {
    await this.service.delete(id, userID)
    return { message: 'Picture deleted successfully' }
  }
}
