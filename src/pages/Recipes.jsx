// pages/Recipes.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'

import { Header } from '../components/Header.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
import { RecipeList } from '../components/RecipeList.jsx'
import { useParams } from 'react-router-dom'


export function Recipes() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const recipesQuery = useQuery({
    queryKey: ['recipes', { author, sortBy, sortOrder }],
    queryFn: () => getRecipes({ author, sortBy, sortOrder }),
  })

  const recipes = recipesQuery.data ?? []

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <CreateRecipe />
      <br />
      <hr />
      Filter By:
      <RecipeFilter
        field="author"
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
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
