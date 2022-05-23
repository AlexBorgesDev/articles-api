import { diskStorage } from 'multer'

const storages = {
  local: diskStorage({}),
}

export class MulterOptions {
  images = {}
}
