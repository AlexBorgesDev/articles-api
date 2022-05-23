import * as path from 'path'

export class Paths {
  static localUploads = path.resolve(__dirname, '..', '..', 'tmp', 'uploads')

  static file(filename: string) {
    return path.resolve(this.localUploads, filename)
  }
}
