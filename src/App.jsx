import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Recipes } from './pages/Recipes.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'

// NEW imports you need:
import { RequireAuth } from './components/RequireAuth.jsx'
import { RecipeDetail } from './pages/RecipeDetail.jsx'
import { MyRecipes } from './pages/MyRecipes.jsx'

// If your RecipeDetail currently expects an `id` prop,
// you can wrap it like this (delete if RecipeDetail uses useParams internally):
import { useParams } from 'react-router-dom'
function RecipeDetailRoute() {
  const { id } = useParams()
  return <RecipeDetail id={id} />
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
  { path: '/', element: <Recipes /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },

  // Use RecipeDetailRoute if RecipeDetail expects `id` prop.
  // If RecipeDetail uses useParams itself, replace RecipeDetailRoute with RecipeDetail directly.
  {
    path: '/recipes/:id/edit',
    element: (
      <RequireAuth>
        <RecipeDetailRoute />
      </RequireAuth>
    ),
  },
  {
    path: '/users/:id/recipes',
    element: (
      <RequireAuth>
        <MyRecipes />
      </RequireAuth>
    ),
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
