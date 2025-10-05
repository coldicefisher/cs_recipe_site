import mongoose from 'mongoose'
import { beforeEach, describe, expect, test, beforeAll } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByTag,
  listPostsByAuthor,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { createUser } from '../services/users.js'

let samplePosts = []
let testUser = null

beforeAll(async () => {
  testUser = await createUser({ username: 'sample', password: 'user' })
  samplePosts = [
    { title: 'Learning Redux', author: testUser._id, tags: ['redux'] },
    { title: 'Learn React Notes', author: testUser._id, tags: ['react'] },
    {
      title: 'Full-Stack React Projects',
      author: testUser._id,
      tags: ['react', 'nodejs'],
    },
    { title: 'Guide to Typescript', author: testUser._id },
  ]
})

let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('getting post by id', () => {
  test('should return a full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'some content change',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.contents).toEqual('some content change')
  })
  test('should not update other properties', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'some content change',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })
  test('should update the updatedAt timestamp', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'some content change',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const post = await updatePost(testUser._id, '000000000000000000000000', {
      contents: 'some content change',
    })
    expect(post).toEqual(null)
  })
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })
  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toEqual(1)
  })
  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor(testUser.username)
    expect(posts.length).toEqual(4)
  })
  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
        posts[i].createdAt.getTime(),
      )
    }
  })
  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'title',
      sortOrder: 'ascending',
    })
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].title <= posts[i].title).toBeTruthy()
    }
  })
})

describe('deleting posts', () => {
  test('should remove post from the database', async () => {
    const result = await deletePost(testUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      contents: 'This post is stored in a MongoDB database using Mongoose',
      tags: ['mongoose', 'mongodb'],
    }
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  test('without title should fail', async () => {
    const post = {
      contents: 'Posts with no title',
      tags: ['empty'],
    }
    try {
      await createPost(testUser._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
