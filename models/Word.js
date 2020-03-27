module.exports = (model, Schema) => {
  const Word = new Schema({
    word: { type: String }
  })
  return model('Word', Word)
}