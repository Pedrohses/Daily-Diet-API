import { execSync } from "child_process"
import { app } from "../src/app"
import { describe, it, beforeAll, afterAll, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'

describe('Meals routes', () => {
  beforeAll(() => {
    app.ready()
  })

  afterAll(() => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:latest')
  })  
  
  afterEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
  })

  it('should create a meal', async () => {
    const user = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com'
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test meal',
        description: 'This meal is a test',
        isDietMeal: true
      }).expect(201)
  })

  it('should edit a meal', async () => {
    const user = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com'
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test meal',
        description: 'This meal is a test',
        isDietMeal: true
      }).expect(201)

    const response = await request(app.server)
      .get('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))

    const { id } = response.body[0]
    
    await request(app.server)
      .put(`/meal/${id}`)
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test2 meal',
        description: 'This meal is a test2',
        isDietMeal: false
      }).expect(204)
  })

  it('should list all meals', async () => {
    const user = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com'
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test meal',
        description: 'This meal is a test',
        isDietMeal: true
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test2 meal',
        description: 'This meal is a test2',
        isDietMeal: true
      }).expect(201)

    const response = await request(app.server)
      .get('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))

    expect(response.body).toHaveLength(2)

    expect(response.body[0].name).toBe('Test meal')
    expect(response.body[1].name).toBe('Test2 meal')
  })

  it('should list a unic meal', async () => {
    const user = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com'
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test meal',
        description: 'This meal is a test',
        isDietMeal: true
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test2 meal',
        description: 'This meal is a test2',
        isDietMeal: true
      }).expect(201)

    const responseId = await request(app.server)
      .get(`/meal`)
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
    
    const { id } = responseId.body[0]

    const response = await request(app.server)
      .get(`/meal/${id}`)
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))

    expect(response.body.name).toBe('Test meal')
    expect(response.body).toEqual(expect.any(Object))
  })

  it('should delete a meal', async () => {
    const user = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com'
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test meal',
        description: 'This meal is a test',
        isDietMeal: true
      }).expect(201)

    const responseId = await request(app.server)
      .get(`/meal`)
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
    
    const { id } = responseId.body[0]

    await request(app.server)
      .delete(`/meal/${id}`)
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .expect(204)
  })

  it('should get a user metrics', async () => {
     const user = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com'
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test meal',
        description: 'This meal is a test',
        isDietMeal: true
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test2 meal',
        description: 'This meal is a test2',
        isDietMeal: false
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test3 meal',
        description: 'This meal is a test3',
        isDietMeal: true
      }).expect(201)

    await request(app.server)
      .post('/meal')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .send({
        name: 'Test4 meal',
        description: 'This meal is a test4',
        isDietMeal: true
      }).expect(201)
    
    const metricsResponse = await request(app.server)
      .get('/meal/metrics')
      .set('Cookie', (user.get('Set-Cookie')!).join('; '))
      .expect(200)

    expect(metricsResponse.body).toEqual({
      totalMeals: 4,
      totalMealsOnDiet: 3,
      totalMealsOffDiet: 1,
      bestDietSequence: 2,
    })
  })
})