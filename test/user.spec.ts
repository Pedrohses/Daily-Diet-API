import { execSync } from 'child_process'
import { app } from '../src/app'
import request from 'supertest'
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'

describe('Users routes', () => {
  beforeAll(() => {
    app.ready()
  })

  afterAll(() => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })  

  it('should create an user', async () => {
    const response = await request(app.server)
      .post('/user')
      .send({
          name: 'John Doe',
          email: 'johndoe@email.com'
      }).expect(201)

      const cookies = response.get('Set-Cookie')

      expect(cookies).toEqual(
        expect.arrayContaining([expect.stringContaining('sessionId')]),
      )
  })
})