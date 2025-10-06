import mongoose, { Schema } from 'mongoose'

const recipeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ingredients: { type: [String], default: [] },
    imageUrl: String,
    // Likes will store user IDs who liked the recipe. This way, one like per user at O(1) complexity on access.
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)
// virtual is a calculated property NOT stored in the database.
recipeSchema.virtual('likesCount').get(function () {
  return this.likes?.length || 0
})
// statics are like class methods. We want to be able to do Recipe.like() and Recipe.unlike() and that logic is better encapsulated here and not in a service file.
recipeSchema.statics.like = function (recipeId, userId) {
  return this.findByIdAndUpdate(
    recipeId,
    { $addToSet: { likes: userId } }, 
    { new: true }
  )
}

recipeSchema.statics.unlike = function (recipeId, userId) {
  return this.findByIdAndUpdate(
    recipeId,
    { $pull: { likes: userId } },
    { new: true }
  )
}
// isLikedBy is an instance method, so we can do recipe.isLikedBy(userId) to check if a user has liked this recipe.
recipeSchema.methods.isLikedBy = function (userId) {
  return this.likes?.some(id => id.equals(userId)) || false
}

export const Recipe = mongoose.model('Recipe', recipeSchema)
