import { useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'
import { Header } from '../components/Header.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
import { RecipeList } from '../components/RecipeList.jsx'

export function MyRecipes() {
  const { id: authorId } = useParams()
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  // Author ID comes from the URL params, so useMemo to avoid changing queryKey on every render.
  const queryKey = useMemo(
    () => ['recipes', { author: authorId, sortBy, sortOrder }],
    [authorId, sortBy, sortOrder]
  )

  const recipesQuery = useQuery({
    queryKey,
    queryFn: () => getRecipes({ author: authorId, sortBy, sortOrder }),
    enabled: !!authorId,
  })

  const recipes = recipesQuery.data ?? []

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <h2>My Recipes</h2>
      <hr />

      <RecipeSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(value) => setSortOrder(value)}
      />

      <hr />
      {recipesQuery.isLoading && <div>Loading…</div>}
      {recipesQuery.isError && <div>Failed to load recipes.</div>}
      {!recipesQuery.isLoading && !recipesQuery.isError && (
        <RecipeList recipes={recipes} />
      )}
    </div>
  )
}
