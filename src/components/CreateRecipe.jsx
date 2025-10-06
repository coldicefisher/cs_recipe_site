import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  // Ingredients is an array of strings
  const [ingredients, setIngredients] = useState([''])
  const [token] = useAuth()

  const queryClient = useQueryClient()

  const createRecipeMutation = useMutation({
    mutationFn: () =>
      createRecipe(token, {
        title,
        imageUrl,
        // Ingredients should be an array of non-empty trimmed strings
        ingredients: ingredients.map(s => s.trim()).filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes'])
      // Reset the form
      setTitle('')
      setImageUrl('')
      setIngredients([''])
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }
  // Handle ingredient updates
  const handleIngredientChange = (idx, value) => {
    setIngredients(prev => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  // Add a new empty ingredient
  const addIngredient = () => setIngredients(prev => [...prev, ''])

  if (!token) return <div>Please log in to create new recipes.</div>

  const isCreateDisabled =
    !title.trim() || ingredients.every(s => !s.trim())

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="create-title">Title</label>
        <input
          type="text"
          id="create-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label htmlFor="image-url">Image URL (optional)</label>
        <input
          type="url"
          id="image-url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/pic.jpg"
        />
      </div>

      <br />

      <div>
        <strong>Ingredients</strong>
        {ingredients.map((ing, i) => (
          <div key={i} style={{ marginTop: 8 }}>
            <input
              type="text"
              value={ing}
              onChange={(e) => handleIngredientChange(i, e.target.value)}
              placeholder={`Ingredient ${i + 1}`}
            />
          </div>
        ))}
        <button type="button" onClick={addIngredient} style={{ marginTop: 8 }}>
          + Add ingredient
        </button>
      </div>

      <br />

      <input
        type="submit"
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create'}
        disabled={isCreateDisabled || createRecipeMutation.isPending}
      />

      {createRecipeMutation.isSuccess && (
        <>
          <br />
          Recipe created successfully!
        </>
      )}
      {createRecipeMutation.isError && (
        <>
          <br />
          Failed to create recipe.
        </>
      )}
    </form>
  )
}
