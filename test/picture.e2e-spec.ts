import * as request from 'supertest'

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { useContainer } from 'class-validator'
import { v4 as uuid } from 'uuid'
import { APP_GUARD } from '@nestjs/core'

import { deletePictures } from '../src/picture/picture.utils'
import { PrismaService } from '../src/prisma/prisma.service'
import { PictureModule } from '../src/picture/picture.module'
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard'
import { AuthService } from '../src/auth/auth.service'
import { AuthModule } from '../src/auth/auth.module'

import { FakeUser } from './utils/FakeUser'
import { FakePicture } from './utils/FakePicture'

describe('PictureController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authService: AuthService

  const users = { exist: new FakeUser(), notExist: new FakeUser() }
  const usersId = { exist: users.exist.id }
  const accessToken = { exist: '', notExist: '' }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        PictureModule,
      ],
      providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = app.get<PrismaService>(PrismaService)
    authService = app.get<AuthService>(AuthService)

    useContainer(app.select(PictureModule), { fallbackOnErrors: true })
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    await app.init()
    const [existUser] = await prisma.$transaction([
      prisma.user.create({ data: users.exist.insertIntoDB }),
      prisma.user.create({ data: users.notExist.insertIntoDB }),
    ])

    usersId.exist = existUser.id

    const authExistUser = await authService.login(users.exist.login)
    accessToken.exist = `Bearer ${authExistUser.accessToken}`

    const authNotExistUser = await authService.login(users.notExist.login)
    accessToken.notExist = `Bearer ${authNotExistUser.accessToken}`

    await prisma.user.delete({ where: { email: users.notExist.email } })
  })

  afterAll(async () => {
    await prisma.user.delete({ where: { email: users.exist.email } })

    const pictures = await prisma.picture.findMany({ where: { ownerId: null } })
    deletePictures(pictures.map(picture => picture.filename))
    await prisma.picture.deleteMany({ where: { ownerId: null } })

    await prisma.$disconnect()
    await app.close()
  })

  describe('/picture (GET)', () => {
    it('should return with pagination, the images uploaded by the user', async () => {
      const newPicture = await prisma.picture.create({
        data: {
          filename: `${Date.now()}-get.png`,
          size: 1024,
          ownerId: usersId.exist,
        },
      })

      const { status, body } = await request(app.getHttpServer())
        .get('/picture')
        .set('authorization', accessToken.exist)
        .query({ page: 1, take: 15 })

      expect(status).toBe(200)
      expect(body).toMatchObject({
        page: 1,
        take: 15,
        data: [
          {
            id: newPicture.id,
            description: null,
            filename: newPicture.filename,
            size: newPicture.size,
          },
        ],
        total: 1,
      })
    })

    describe('should return an HTTP status 400', () => {
      it('when the informed queries are invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get('/picture')
          .set('authorization', accessToken.exist)
          .query({ page: 'asd', take: 'e2e' })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer()).get(
          '/picture',
        )

        expect(status).toBe(401)
        expect(body).toMatchObject({ statusCode: 401, message: 'Unauthorized' })
      })
    })
  })

  describe('/picture (POST)', () => {
    it('should upload the image successfully', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/picture')
        .set('authorization', accessToken.exist)
        .attach('file', FakePicture.path)
        .field('description', 'Test Image')

      expect(status).toBe(201)
      expect(body).toHaveProperty('message')
      expect(body).toHaveProperty('picture')
      expect(body.message).toEqual('Picture uploaded successfully')
      expect(body.picture).toHaveProperty('id')
      expect(body.picture).toHaveProperty('filename')
    })

    describe('should return an HTTP status 400', () => {
      it('when the type of the uploaded file is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/picture')
          .set('authorization', accessToken.exist)
          .attach('file', FakePicture.invalidPath)

        const deletedFile = await FakePicture.checkDeleted(
          FakePicture.invalidFilename,
        )

        expect(deletedFile).toBe(true)
        expect(status).toBe(400)
        expect(body).toMatchObject({
          statusCode: 400,
          message: 'Invalid file type.',
          error: 'Bad Request',
        })
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the user does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/picture')
          .set('authorization', accessToken.notExist)
          .attach('file', FakePicture.path)

        const deletedFile = await FakePicture.checkDeleted(FakePicture.filename)

        expect(deletedFile).toBe(true)
        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Invalid token',
        })
      })

      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/picture')
          .attach('file', FakePicture.path)

        expect(status).toBe(401)
        expect(body).toMatchObject({ statusCode: 401, message: 'Unauthorized' })
      })
    })
  })

  describe('/picture (PATCH)', () => {
    it('should change the image description successfully', async () => {
      const newPicture = await prisma.picture.create({
        data: {
          filename: `${Date.now()}-patch.png`,
          size: 1024,
          ownerId: usersId.exist,
          description: 'Fake image description',
        },
      })

      const { status, body } = await request(app.getHttpServer())
        .patch('/picture')
        .set('authorization', accessToken.exist)
        .send({ id: newPicture.id, description: 'New Description' })

      expect(status).toBe(200)
      expect(body).toHaveProperty('message')
      expect(body).toHaveProperty('picture')
      expect(body.message).toBe('Picture changed successfully')
      expect(body.picture).toHaveProperty('id')
      expect(body.picture).toHaveProperty('filename')
      expect(body.picture).toHaveProperty('description')
      expect(body.picture.description !== newPicture.description).toBe(true)
    })

    describe('should return HTTP status 400', () => {
      it('when the data entered is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/picture')
          .set('authorization', accessToken.exist)
          .send({ id: 'as21asd', description: false })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/picture')
          .send({ id: uuid() })

        expect(status).toBe(401)
        expect(body).toMatchObject({ statusCode: 401, message: 'Unauthorized' })
      })
    })

    describe('should return an HTTP status 404', () => {
      it('when the image does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch(`/picture`)
          .set('authorization', accessToken.exist)
          .send({ id: uuid() })

        expect(status).toBe(404)
        expect(body).toMatchObject({
          statusCode: 404,
          message: 'Picture not found',
          error: 'Not Found',
        })
      })
    })
  })

  describe('/picture/:id (DELETE)', () => {
    it('should successfully delete the image', async () => {
      const newPicture = await prisma.picture.create({
        data: {
          filename: `${Date.now()}-delete.png`,
          size: 1024,
          ownerId: usersId.exist,
        },
      })

      await FakePicture.copyToPublic(newPicture.filename)

      const { status, body } = await request(app.getHttpServer())
        .delete(`/picture/${newPicture.id}`)
        .set('authorization', accessToken.exist)

      const deletedFile = await FakePicture.checkDeleted(newPicture.filename)

      expect(status).toBe(200)
      expect(body).toMatchObject({ message: 'Picture deleted successfully' })
      expect(deletedFile).toBe(true)
    })

    describe('should return an HTTP status 400', () => {
      it('when the given id is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .delete('/picture/1i2d')
          .set('authorization', accessToken.exist)

        expect(status).toBe(400)
        expect(body).toMatchObject({
          statusCode: 400,
          message: ['id must be a UUID'],
          error: 'Bad Request',
        })
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer()).delete(
          `/picture/${uuid()}`,
        )

        expect(status).toBe(401)
        expect(body).toMatchObject({ statusCode: 401, message: 'Unauthorized' })
      })
    })

    describe('should return an HTTP status 404', () => {
      it('when the image does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .delete(`/picture/${uuid()}`)
          .set('authorization', accessToken.exist)

        expect(status).toBe(404)
        expect(body).toMatchObject({
          statusCode: 404,
          message: 'Picture not found',
          error: 'Not Found',
        })
      })
    })
  })
})
