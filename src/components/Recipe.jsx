import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({ title, ingredients = [], imageUrl, author: userId }) {
  return (
    <article>
      <h3>{title}</h3>

      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt={`${title} image`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <br />
        </>
      )}

      {ingredients.length ? (
        <ul>
          {ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      ) : (
        <div><em>No ingredients listed.</em></div>
      )}

      {userId && (
        <em>
          <br />
          By <User id={userId} />
        </em>
      )}
    </article>
  )
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
  author: PropTypes.string,
}
