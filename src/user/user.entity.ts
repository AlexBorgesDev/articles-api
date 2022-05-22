import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Picture } from '../picture/picture.entity'

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID

  @Column({ unique: true })
  email: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  password: string

  @Column({ nullable: true })
  description?: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column(() => Picture)
  pictures: Picture[]
}
