import * as fs from 'fs'

import { Paths } from '../config/paths'

export function deletePictures(filenames: string[]) {
  filenames.forEach(filename => {
    const filePath = Paths.file(filename)
    fs.unlink(filePath, () => null)
  })
}
