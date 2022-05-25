import * as fs from 'node:fs/promises'
import * as path from 'path'

export class FakePicture {
  static filename = 'image-test.webp'
  static path = path.resolve(__dirname, this.filename)

  static invalidFilename = 'invalid-file.txt'
  static invalidPath = path.resolve(__dirname, this.invalidFilename)

  private static publicPath = path.resolve(__dirname, '..', '..', 'public')

  static async copyToPublic(filename: string) {
    await fs.copyFile(this.path, path.resolve(this.publicPath, filename))
  }

  static async checkDeleted(filename: string) {
    try {
      await fs.access(path.resolve(this.publicPath, filename))
      return false
    } catch (e) {
      return true
    }
  }
}
