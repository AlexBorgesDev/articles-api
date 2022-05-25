import * as request from 'supertest'

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { useContainer } from 'class-validator'
import { APP_GUARD } from '@nestjs/core'

import { PrismaService } from '../src/prisma/prisma.service'
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard'
import { AuthService } from '../src/auth/auth.service'
import { AuthModule } from '../src/auth/auth.module'
import { UserModule } from '../src/user/user.module'

import { FakeUser } from './utils/FakeUser'

describe('UserController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authService: AuthService

  const users = {
    new: new FakeUser(),
    exist: new FakeUser(),
    notExist: new FakeUser(),
    toDelete: new FakeUser(),
  }

  const accessToken = { exist: '', notExist: '', toDelete: '' }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UserModule,
      ],
      providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = app.get<PrismaService>(PrismaService)
    authService = app.get<AuthService>(AuthService)

    useContainer(app.select(UserModule), { fallbackOnErrors: true })
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    await app.init()
    await prisma.$transaction([
      prisma.user.create({ data: users.exist.insertIntoDB }),
      prisma.user.create({ data: users.notExist.insertIntoDB }),
      prisma.user.create({ data: users.toDelete.insertIntoDB }),
    ])

    const authExistUser = await authService.login(users.exist.login)
    accessToken.exist = `Bearer ${authExistUser.accessToken}`

    const authNotExistUser = await authService.login(users.notExist.login)
    accessToken.notExist = `Bearer ${authNotExistUser.accessToken}`

    const authToDeleteUser = await authService.login(users.toDelete.login)
    accessToken.toDelete = `Bearer ${authToDeleteUser.accessToken}`

    await prisma.user.delete({ where: { email: users.notExist.email } })
  })

  afterAll(async () => {
    const dbUsers = await prisma.user.findMany()
    const usersToDelete: string[] = []

    for (const key in users) {
      users[key].email && usersToDelete.push(users[key].email)
    }

    for (const { email } of dbUsers) {
      if (usersToDelete.find(value => value === email)) {
        await prisma.user.delete({ where: { email } })
      }
    }

    await prisma.$disconnect()
    await app.close()
  })

  describe('/user (GET)', () => {
    it('should return some user information', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/user')
        .set('authorization', accessToken.exist)

      expect(status).toBe(200)
      expect(body).toHaveProperty('email')
      expect(body).not.toHaveProperty('password')
    })

    describe('should return an HTTP status 401', () => {
      it('when the user does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get('/user')
          .set('authorization', accessToken.notExist)

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Invalid token',
        })
      })

      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer()).get('/user')

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })
  })

  describe('/user (POST)', () => {
    it('should create a new user', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/user')
        .send(users.new.create)

      const newUser = await prisma.user.findFirst({
        where: { email: users.new.email },
      })

      expect(status).toBe(201)
      expect(body).toMatchObject({ message: 'User created successfully' })
      expect(newUser.password !== users.new.create.password).toBe(true)
    })

    describe('should return HTTP status 400', () => {
      it('when the email is already being used by another user', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/user')
          .send(users.exist.create)

        expect(status).toBe(400)
        expect(body).toMatchObject({
          statusCode: 400,
          message: 'An account with the given email address already exists.',
          error: 'Bad Request',
        })
      })

      it('when the data entered is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/user')
          .send({ email: 1, name: 'a', password: '1234' })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })
  })

  describe('/user (PATCH)', () => {
    it('should change the user information', async () => {
      const user = await prisma.user.findFirst({
        where: { email: users.exist.email },
      })

      const { status, body } = await request(app.getHttpServer())
        .patch('/user')
        .set('authorization', accessToken.exist)
        .send({ description: 'Description - This is a test user.' })

      expect(status).toBe(200)
      expect(body).toHaveProperty('message')
      expect(body).toHaveProperty('user')
      expect(body.user).toHaveProperty('description')
      expect(body.message).toEqual('User updated successfully')
      expect(body.user.description !== user.description).toBe(true)
    })

    describe('should return HTTP status 400', () => {
      it('when the data entered is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/user')
          .set('authorization', accessToken.exist)
          .send({ email: 'invalid' })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the user does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/user')
          .set('authorization', accessToken.notExist)
          .send({ firstName: 'Invalid' })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Invalid token',
        })
      })

      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/user')
          .send({ description: 'Not changed' })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })
  })

  describe('/user (DELETE)', () => {
    it('should successfully delete the user', async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete('/user')
        .set('authorization', accessToken.toDelete)

      expect(status).toBe(200)
      expect(body).toMatchObject({ message: 'User deleted successfully' })
    })

    describe('should return an HTTP status 401', () => {
      it('when the user does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .delete('/user')
          .set('authorization', accessToken.notExist)

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Invalid token',
        })
      })

      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer()).delete(
          '/user',
        )

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })
  })

  describe('/user/password (PATCH)', () => {
    it('should change user password successfully', async () => {
      const beforeUser = await prisma.user.findFirst({
        where: { email: users.exist.email },
      })

      const { status, body } = await request(app.getHttpServer())
        .patch('/user/password')
        .set('authorization', accessToken.exist)
        .send({
          currentPassword: users.exist.password,
          newPassword: '0987654321',
        })

      const afterUser = await prisma.user.findFirst({
        where: { email: users.exist.email },
      })

      expect(status).toBe(200)
      expect(body).toMatchObject({
        message: 'Password has been successfully changed',
      })
      expect(beforeUser.password !== afterUser.password).toBe(true)
    })

    describe('should return HTTP status 400', () => {
      it('when the data entered is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/user/password')
          .set('authorization', accessToken.exist)
          .send({ currentPassword: 'a', newPassword: 'b' })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })

    describe('should return an HTTP status 401', () => {
      it("when passwords don't match", async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/user/password')
          .set('authorization', accessToken.exist)
          .send({
            currentPassword: '12345678',
            newPassword: '0987654321',
          })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Invalid password',
        })
      })

      it('when the user does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/user/password')
          .set('authorization', accessToken.notExist)
          .send({
            currentPassword: users.exist.password,
            newPassword: '0987654321',
          })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Invalid token',
        })
      })

      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/user/password')
          .send({
            currentPassword: users.exist.password,
            newPassword: '0987654321',
          })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })
  })
})
