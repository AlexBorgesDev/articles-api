import { faker } from '@faker-js/faker'
import { v4 as uuid } from 'uuid'
import { hashSync, genSaltSync } from 'bcrypt'

export class FakeUser {
  static genMany(amount = 2) {
    const users: FakeUser[] = []

    for (let index = 0; index < amount; index++) {
      users.push(new FakeUser())
    }

    return users
  }

  // ---------------------------------------------------------------------
  // ------------------------------ Data ---------------------------------
  // ---------------------------------------------------------------------

  id = uuid()
  email = faker.internet.email()

  firstName = faker.name.firstName()
  lastName = faker.name.lastName()
  description = faker.lorem.lines(2)

  password = faker.internet.password(10)
  passwordHash = hashSync(this.password, genSaltSync(10))

  createdAt = Date.now()
  updatedAt = Date.now()

  // ---------------------------------------------------------------------
  // ----------------------------- Inputs --------------------------------
  // ---------------------------------------------------------------------

  login = { email: this.email, password: this.password }

  create = {
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    description: this.description,
    password: this.password,
  }

  // ---------------------------------------------------------------------
  // ---------------------------- Database -------------------------------
  // ---------------------------------------------------------------------

  db = {
    id: this.id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    description: this.description,
    password: this.passwordHash,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }

  insertIntoDB = {
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    description: this.description,
    password: this.passwordHash,
  }
}
