const mongoose = require('mongoose')

const { productCategories } = require('./constants.json')
const { customRequireValidator } = require('../db/utils')

const userTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String
  }
)

const productSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: [{ type: String, enum: productCategories }],
    imageUrl: String,
    cost: Number,
    en: userTranslatedFieldsSchema,
    ar: userTranslatedFieldsSchema
  },
  {
    timestamps: true
  }
)

productSchema.pre('validate', customRequireValidator)

module.exports = mongoose.model('Product', productSchema)
