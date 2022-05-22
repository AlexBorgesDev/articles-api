import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity()
export class Picture {
  @ObjectIdColumn()
  id: ObjectID

  @Column({ unique: true })
  filename: string

  @Column()
  description: string

  @Column()
  size: number

  constructor(filename: string, description: string, size: number) {
    this.filename = filename
    this.description = description
    this.size = size
  }
}
