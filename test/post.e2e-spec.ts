import * as request from 'supertest'

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { useContainer } from 'class-validator'
import { v4 as uuid } from 'uuid'
import { APP_GUARD } from '@nestjs/core'
import { Picture } from '@prisma/client'

import { PrismaService } from '../src/prisma/prisma.service'
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard'
import { AuthService } from '../src/auth/auth.service'
import { AuthModule } from '../src/auth/auth.module'
import { PostModule } from '../src/post/post.module'

import { FakeUser } from './utils/FakeUser'

describe('PostController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authService: AuthService

  const users = { exist: new FakeUser(), notExist: new FakeUser() }
  const usersId = { exist: users.exist.id }
  const accessToken = { exist: '', notExist: '' }

  let picture: Picture

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        PostModule,
      ],
      providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = app.get<PrismaService>(PrismaService)
    authService = app.get<AuthService>(AuthService)

    useContainer(app.select(PostModule), { fallbackOnErrors: true })
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    await app.init()
    const [existUser] = await prisma.$transaction([
      prisma.user.create({ data: users.exist.insertIntoDB }),
      prisma.user.create({ data: users.notExist.insertIntoDB }),
    ])

    usersId.exist = existUser.id

    picture = await prisma.picture.create({
      data: {
        filename: `${Date.now()}-post.png`,
        size: 1024,
        ownerId: existUser.id,
      },
    })

    const authExistUser = await authService.login(users.exist.login)
    accessToken.exist = `Bearer ${authExistUser.accessToken}`

    const authNotExistUser = await authService.login(users.notExist.login)
    accessToken.notExist = `Bearer ${authNotExistUser.accessToken}`

    await prisma.user.delete({ where: { email: users.notExist.email } })
  })

  afterAll(async () => {
    await prisma.user.delete({ where: { email: users.exist.email } })
    await prisma.picture.deleteMany({ where: { ownerId: null } })

    await prisma.$disconnect()
    await app.close()
  })

  describe('/post (GET)', () => {
    it('should return with pagination, the posts', async () => {
      const newPost = await prisma.post.create({
        data: {
          slug: `${Date.now()}-get-slug`,
          title: '/post (GET) - Test',
          bannerId: picture.id,
          data: { create: { tag: 'text', data: '', index: 0 } },
          ownerId: usersId.exist,
        },
      })

      const { status, body } = await request(app.getHttpServer())
        .get('/post')
        .query({ page: 1, take: 18 })

      expect(status).toBe(200)
      expect(body).toMatchObject({
        page: 1,
        take: 18,
        data: [
          {
            slug: newPost.slug,
            title: newPost.title,
            banner: { filename: picture.filename, description: null },
            owner: {
              firstName: users.exist.firstName,
              lastName: users.exist.lastName,
            },
          },
        ],
        total: 1,
      })
    })

    describe('should return an HTTP status 400', () => {
      it('when the informed queries are invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get('/post')
          .query({ page: 0, take: false })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })
  })

  describe('/post/:slug (GET)', () => {
    it('should return the post', async () => {
      const newPost = await prisma.post.create({
        data: {
          slug: `${Date.now()}-get-post-by-slug`,
          title: '/post/:slug (GET) - Test',
          bannerId: picture.id,
          data: { create: { tag: 'text', data: '', index: 0 } },
          ownerId: usersId.exist,
        },
      })

      const { status, body } = await request(app.getHttpServer()).get(
        `/post/${newPost.slug}`,
      )

      expect(status).toBe(200)
      expect(body).toHaveProperty('slug')
      expect(body).toHaveProperty('title')
      expect(body).toHaveProperty('banner')
      expect(body).toHaveProperty('data')
      expect(body).toHaveProperty('owner')
      expect(body).toHaveProperty('createdAt')
      expect(body.banner).toHaveProperty('filename')
      expect(Array.isArray(body.data)).toBe(true)
    })

    describe('should return an HTTP status 400', () => {
      it('when the informed slug is invalid', async () => {
        const { status, body } = await request(app.getHttpServer()).get(
          '/post/in',
        )

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })
  })

  describe('/post (POST)', () => {
    it('should create a post successfully', async () => {
      const slug = `${Date.now()}-create-post-e2e-test`

      const { status, body } = await request(app.getHttpServer())
        .post('/post')
        .set('authorization', accessToken.exist)
        .send({
          slug,
          title: 'Create post e2e test',
          bannerId: picture.id,
          data: [{ tag: 'text', data: 'Create post - e2e - test', index: 0 }],
        })

      expect(status).toBe(201)
      expect(body).toMatchObject({ message: 'Post created successfully', slug })
    })

    describe('should return an HTTP status 400', () => {
      it('when the data entered is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/post')
          .set('authorization', accessToken.exist)
          .send({ slug: 'slug' })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })

      it('when a post with the same slug already exists', async () => {
        const newPost = await prisma.post.create({
          data: {
            slug: `${Date.now()}-create-post-e2e-fail-400`,
            title: 'Post - POST - 400',
            bannerId: picture.id,
            ownerId: usersId.exist,
          },
        })

        const { status, body } = await request(app.getHttpServer())
          .post('/post')
          .set('authorization', accessToken.exist)
          .send({
            slug: newPost.slug,
            title: 'Post - POST - 400',
            bannerId: picture.id,
            data: [{ tag: 'text', data: 'Post slug already exist', index: 0 }],
          })

        expect(status).toBe(400)
        expect(body).toMatchObject({
          statusCode: 400,
          message: 'There is already a post with the same slug',
          error: 'Bad Request',
        })
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the user does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/post')
          .set('authorization', accessToken.notExist)
          .send({
            slug: `${Date.now()}-create-post-e2e-fail-401`,
            title: 'Post - POST - 401',
            bannerId: picture.id,
            data: [{ tag: 'text', data: '', index: 0 }],
          })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Invalid token',
        })
      })

      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/post')
          .send({
            slug: `${Date.now()}-create-post-e2e-fail-401`,
            title: 'Post - POST - 401',
            bannerId: picture.id,
            data: [{ tag: 'text', data: '', index: 0 }],
          })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })
  })

  describe('/post (PATCH)', () => {
    it('this should change a post successfully', async () => {
      const newPost = await prisma.post.create({
        data: {
          slug: `${Date.now()}-patch-slug`,
          title: '/post (PATCH) - Test',
          bannerId: picture.id,
          data: { create: { tag: 'text', data: '', index: 0 } },
          ownerId: usersId.exist,
        },
      })

      const newSlug = `${Date.now()}-patch`
      const { status, body } = await request(app.getHttpServer())
        .patch('/post')
        .set('authorization', accessToken.exist)
        .send({ id: newPost.id, slug: newSlug })

      expect(status).toBe(200)
      expect(body).toMatchObject({
        message: 'Post updated successfully',
        slug: newSlug,
      })
      expect(body.slug !== newPost.slug).toBe(true)
    })

    describe('should return an HTTP status 400', () => {
      it('when the data entered is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/post')
          .set('authorization', accessToken.exist)
          .send({ id: false })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })

      it('when a post with the same slug already exists', async () => {
        const existPost = await prisma.post.create({
          data: {
            slug: `${Date.now()}-patch-already-exist`,
            title: 'Post - POST - 400',
            bannerId: picture.id,
            ownerId: usersId.exist,
          },
        })

        const changePost = await prisma.post.create({
          data: {
            slug: `${Date.now()}-patch-already-exist`,
            title: 'Post - POST - 400',
            bannerId: picture.id,
            ownerId: usersId.exist,
          },
        })

        const { status, body } = await request(app.getHttpServer())
          .patch('/post')
          .set('authorization', accessToken.exist)
          .send({
            id: changePost.id,
            slug: existPost.slug,
          })

        expect(status).toBe(400)
        expect(body).toMatchObject({
          statusCode: 400,
          message: 'There is already a post with the same slug',
          error: 'Bad Request',
        })
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/post')
          .send({ id: uuid() })

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })

    describe('should return an HTTP status 404', () => {
      it('when the post does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/post')
          .set('authorization', accessToken.exist)
          .send({ id: uuid() })

        expect(status).toBe(404)
        expect(body).toMatchObject({
          statusCode: 404,
          message: 'Post not found',
          error: 'Not Found',
        })
      })
    })
  })

  describe('/post (DELETE)', () => {
    it('should successfully delete the post', async () => {
      const newPost = await prisma.post.create({
        data: {
          slug: `${Date.now()}-delete-success`,
          title: '/post (DELETE) - Test',
          bannerId: picture.id,
          ownerId: usersId.exist,
        },
      })

      const { status, body } = await request(app.getHttpServer())
        .delete(`/post/${newPost.id}`)
        .set('authorization', accessToken.exist)

      expect(status).toBe(200)
      expect(body).toMatchObject({ message: 'Post deleted successfully' })
    })

    describe('should return an HTTP status 400', () => {
      it('when the data entered is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .delete('/post/postID')
          .set('authorization', accessToken.exist)

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer()).delete(
          `/post/${uuid()}`,
        )

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })

    describe('should return an HTTP status 404', () => {
      it('when the post does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .delete(`/post/${uuid()}`)
          .set('authorization', accessToken.exist)

        expect(status).toBe(404)
        expect(body).toMatchObject({
          statusCode: 404,
          message: 'Post not found',
          error: 'Not Found',
        })
      })
    })
  })

  describe('/post/user (GET)', () => {
    it('should return with pagination, the posts', async () => {
      await prisma.post.create({
        data: {
          slug: `${Date.now()}-get-user-slug`,
          title: '/post/user (GET) - Test',
          bannerId: picture.id,
          data: { create: { tag: 'text', data: '', index: 0 } },
          ownerId: usersId.exist,
        },
      })

      const { status, body } = await request(app.getHttpServer())
        .get('/post/user')
        .set('authorization', accessToken.exist)
        .query({ page: 1, take: 18 })

      expect(status).toBe(200)
      expect(body).toHaveProperty('page')
      expect(body).toHaveProperty('take')
      expect(body).toHaveProperty('data')
      expect(body).toHaveProperty('total')
      expect(Array.isArray(body.data)).toBe(true)
    })

    describe('should return an HTTP status 400', () => {
      it('when the informed queries are invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get('/post/user')
          .set('authorization', accessToken.exist)
          .query({ page: 0, take: false })

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer()).get(
          '/post/user',
        )

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })
  })

  describe('/post/user/:id (GET)', () => {
    it('should return the post', async () => {
      const newPost = await prisma.post.create({
        data: {
          slug: `${Date.now()}-get-post-by-id`,
          title: '/post/:slug (GET) - Test',
          bannerId: picture.id,
          data: { create: { tag: 'text', data: '', index: 0 } },
          ownerId: usersId.exist,
        },
      })

      const { status, body } = await request(app.getHttpServer())
        .get(`/post/user/${newPost.id}`)
        .set('authorization', accessToken.exist)

      expect(status).toBe(200)
      expect(body).toHaveProperty('id')
      expect(body).toHaveProperty('slug')
      expect(body).toHaveProperty('title')
      expect(body).toHaveProperty('banner')
      expect(body).toHaveProperty('data')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')
      expect(body.banner).toHaveProperty('id')
      expect(body.banner).toHaveProperty('filename')
      expect(Array.isArray(body.data)).toBe(true)
    })

    describe('should return an HTTP status 400', () => {
      it('when the given id is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get('/post/user/1i2d')
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
        const { status, body } = await request(app.getHttpServer()).get(
          `/post/user/${uuid()}`,
        )

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })

    describe('should return an HTTP status 404', () => {
      it('when the post does not exist', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`/post/user/${uuid()}`)
          .set('authorization', accessToken.exist)

        expect(status).toBe(404)
        expect(body).toMatchObject({
          statusCode: 404,
          message: 'Post not found',
          error: 'Not Found',
        })
      })
    })
  })

  describe('/post/check/:slug (GET)', () => {
    it('should return a JSON saying if the slug is already being used or not', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`/post/check/${Date.now()}-check-slug`)
        .set('authorization', accessToken.exist)

      expect(status).toBe(200)
      expect(body).toMatchObject({ slugAlreadyExist: false })
    })

    describe('should return an HTTP status 400', () => {
      it('when the informed slug is invalid', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get('/post/check/in')
          .set('authorization', accessToken.exist)

        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(Array.isArray(body.message)).toBe(true)
      })
    })

    describe('should return an HTTP status 401', () => {
      it('when the token is invalid', async () => {
        const { status, body } = await request(app.getHttpServer()).get(
          `/post/check/${Date.now()}-check-slug`,
        )

        expect(status).toBe(401)
        expect(body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
    })
  })
})
