import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'

export function Header() {
  const [token, setToken] = useAuth()
  const sub = token ? jwtDecode(token).sub : null

  return (
    <div>
      <h1>Welcome to Recipes</h1>

      {sub ? (
        <>
          Logged in as <User id={sub} /> ·{' '}
          <Link to="/recipes/new">Create</Link> ·{' '}
          <Link to={`/users/${sub}/recipes`}>My Recipes</Link> ·{' '}
          <button onClick={() => setToken(null)}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Log In</Link> | <Link to="/signup">Sign Up</Link>
        </>
      )}
    </div>
  )
}
