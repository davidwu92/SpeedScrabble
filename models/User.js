module.exports = (model, Schema) => {
  const User = new Schema({
      username: { type: String, required:true },
      email: {type: String, required:true, unique:true},
      scores: [{ type: Schema.Types.ObjectId, ref: 'Score'}],
      //IN CASE WE WANT PASSWORD RESET OPTION
      resetPasswordToken: String,
      resetPasswordExpires: Date,
      password: { type: String, require: true}
  })
  User.plugin(require('passport-local-mongoose'))
  
  return model('User', User)
}