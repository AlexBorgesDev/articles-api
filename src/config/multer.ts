import { BadRequestException } from '@nestjs/common'
import { diskStorage, Options } from 'multer'

import { Paths } from './paths'

const storages = {
  local: diskStorage({
    destination: (_, file, cb) => cb(null, Paths.localUploads),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
}

export class MulterOptions {
  static images: Options = {
    dest: Paths.localUploads,
    storage: storages[process.env.STORAGE_TYPE || 'local'],
    limits: { fileSize: 4 * 1024 * 1024 /* 4 MB */ },
    fileFilter: (_, file, cb) => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ]

      if (allowedMimes.includes(file.mimetype)) cb(null, true)
      else cb(new BadRequestException('Invalid file type.'))
    },
  }
}
