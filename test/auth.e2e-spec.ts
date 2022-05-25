import * as request from 'supertest'

import { useContainer } from 'class-validator'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'

import { PrismaService } from '../src/prisma/prisma.service'
import { AuthModule } from '../src/auth/auth.module'

import { FakeUser } from './utils/FakeUser'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  const users = { exist: new FakeUser(), notExist: new FakeUser() }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = app.get<PrismaService>(PrismaService)

    useContainer(app.select(AuthModule), { fallbackOnErrors: true })
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    await app.init()
    await prisma.user.create({ data: users.exist.insertIntoDB })
  })

  afterAll(async () => {
    await prisma.user.delete({ where: { email: users.exist.email } })

    await prisma.$disconnect()
    await app.close()
  })

  describe('/auth (POST)', () => {
    it('return the access token and some user information', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/auth')
        .send(users.exist.login)

      expect(status).toBe(200)
      expect(body).toHaveProperty('accessToken')
      expect(body).toHaveProperty('user')
      expect(body.user).toMatchObject({
        email: users.exist.email,
        description: users.exist.description,
        firstName: users.exist.firstName,
        lastName: users.exist.lastName,
      })
    })

    describe('return HTTP status 400', () => {
      it('when the data entered is invalid', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/auth')
          .send({ email: 1, password: '1234' })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })

    describe('should return HTTP status 401', () => {
      it('when the user does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth')
          .send(users.notExist.login)

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Email or password is invalid',
          error: 'Unauthorized',
        })
      })

      it('when passwords do not match', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth')
          .send({ email: users.exist.email, password: '12345678' })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Email or password is invalid',
          error: 'Unauthorized',
        })
      })
    })
  })
})
