import { createUser, loginUser, getUserInfoById } from '../services/users.js'

export function usersRoutes(app) {
  app.get('/api/v1/users/:id', async (req, res) => {
    const userInfo = await getUserInfoById(req.params.id)
    return res.status(200).json(userInfo)
  })

  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      console.log('created user', user)
      return res.status(201).json({ username: user.username })
    } catch (err) {
      console.error('Error creating user:', err)
      return res.status(400).json({
        error: 'Failed to create the user, does the username already exist?',
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      return res.status(200).send({ token })
    } catch (err) {
      console.error('Error logging in user:', err)
      return res.status(400).send({
        error: 'login failed, did you enter the correct username/password?',
      })
    }
  })
}

// const res = await fetch('https://super-duper-telegram-x4gw7j6ppw3p5qx-3000.app.github.dev/api/v1/user/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'harris', password: 'password' }) })
// const res = await fetch('https://super-duper-telegram-x4gw7j6ppw3p5qx-3000.app.github.dev/api/v1/user/login', {method: 'POST', headers: {'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'harris', password: 'somepassword' }) })
