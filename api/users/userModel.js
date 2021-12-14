import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  orderTime: {type: String},
  orderDetail:[{orderFood:{type: String},
                orderAmount:{type: Number}}],
  totalMoney: {type: Number}
});
const UserSchema = new Schema({
  username: { type: String, required: true
    , validate: function(username){
      return username.length>=3 && username.length<=15;}, 
      message: "username length should be between 3 and 15."},
  password: {type: String, required: true},
  phoneNumber:{type: Number, unique: true, required: true},
  address:{type: String},
  order:[OrderSchema]
});

UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};

UserSchema.statics.findByPhoneNumber = function (phoneNumber) {
  return this.findOne({ phoneNumber: phoneNumber });
};

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, (err, isMatch) => {
      if (err) {
          return cb(err);
      }
      cb(null, isMatch);
  });
};

UserSchema.pre('save', function(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, (err, salt)=> {
          if (err) {
              return next(err);
          }
          bcrypt.hash(user.password, salt, null, (err, hash)=> {
              if (err) {
                  return next(err);
              }
              user.password = hash;
              next();
          });
      });
  } else {
      return next();
  }
});

export default mongoose.model('User', UserSchema);