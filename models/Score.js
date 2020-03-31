module.exports = (model, Schema) => {
  const Score = new Schema({
      formationScore: { type: Number, required:true },
      score: { type: Number, required:true },
      time: {type: Number },
      words: {type: String},
      createdAt: { type: Date, default: Date.now },
      userLink: {
        type: Schema.Types.ObjectId, ref: 'User'
      }
      //IN CASE WE WANT PASSWORD RESET OPTION
      // resetPasswordToken: String,
      // resetPasswordExpires: Date,
      // password: { type: String, require: true},
  })
  return model('Score', Score)
}