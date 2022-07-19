const mongoose = require('mongoose');
const uniquesValidator= require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {type: String, require: true, unique:true},
  password: {type: String, require: true, unique:true}
});

userSchema.plugin(uniquesValidator);

module.exports=mongoose.model('User',userSchema);
