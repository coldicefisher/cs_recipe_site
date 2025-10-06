import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Recipe } from './Recipe.jsx'

export function RecipeList({ recipes = [] }) {
  return (
    <div>
      {recipes.map((post) => (
        <Fragment key={post._id}>
          <Recipe {...post} />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}
RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape(Recipe.propTypes)).isRequired,
}


