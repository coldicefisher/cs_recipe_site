import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getRecipe, updateRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import PropTypes from 'prop-types'

export function RecipeDetail({ onSaved }) {
  const { id } = useParams()

  const [token] = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recipes', id],
    queryFn: () => getRecipe(token, id),
    enabled: !!token && !!id,
  })

  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [ingredients, setIngredients] = useState([''])

  useEffect(() => {
    if (!data) return
    setTitle(data.title || '')
    setImageUrl(data.imageUrl || '')
    setIngredients(
      Array.isArray(data.ingredients) && data.ingredients.length
        ? data.ingredients
        : ['']
    )
  }, [data])

  const updateRecipeMutation = useMutation({
    mutationFn: () =>
      updateRecipe(token, id, {
        title,
        imageUrl,
        ingredients: ingredients.map(s => s.trim()).filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes'])
      queryClient.invalidateQueries(['recipes', id])
      onSaved?.()
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateRecipeMutation.mutate()
  }

  const handleIngredientChange = (idx, value) => {
    setIngredients(prev => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  const addIngredient = () => setIngredients(prev => [...prev, ''])
  const removeIngredient = (idx) =>
    setIngredients(prev => prev.filter((_, i) => i !== idx))

  const resetChanges = () => {
    if (!data) return
    setTitle(data.title || '')
    setImageUrl(data.imageUrl || '')
    setIngredients(
      Array.isArray(data.ingredients) && data.ingredients.length
        ? data.ingredients
        : ['']
    )
  }

  if (!token) return <div>Please log in to edit recipes.</div>
  if (isLoading) return <div>Loading…</div>
  if (isError) return <div>Failed to load recipe.</div>

  const isSaveDisabled =
    !title.trim() || ingredients.every(s => !s.trim()) || updateRecipeMutation.isPending

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="edit-title">Title</label>
        <input
          type="text"
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label htmlFor="edit-image-url">Image URL (optional)</label>
        <input
          type="url"
          id="edit-image-url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/pic.jpg"
        />
      </div>

      <br />

      <div>
        <strong>Ingredients</strong>
        {ingredients.map((ing, i) => (
          <div key={i} style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={ing}
              onChange={(e) => handleIngredientChange(i, e.target.value)}
              placeholder={`Ingredient ${i + 1}`}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => removeIngredient(i)}
              aria-label={`Remove ingredient ${i + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredient} style={{ marginTop: 8 }}>
          + Add ingredient
        </button>
      </div>

      <br />

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="submit"
          value={updateRecipeMutation.isPending ? 'Saving…' : 'Save changes'}
          disabled={isSaveDisabled}
        />
        <button type="button" onClick={resetChanges}>
          Reset
        </button>
      </div>

      {updateRecipeMutation.isSuccess && (
        <>
          <br />
          Saved!
        </>
      )}
      {updateRecipeMutation.isError && (
        <>
          <br />
          Failed to save changes.
        </>
      )}
    </form>
  )
}

RecipeDetail.propTypes = {
  id: PropTypes.string.isRequired,
  onSaved: PropTypes.func,
}
