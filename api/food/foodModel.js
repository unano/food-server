import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    foodName:{type:String},
    foodNameEn:{type:String},
    foodKindId:{type:String},
    foodKind:{type:String},
    foodKindEn:{type:String},
    size:{type:Boolean},
    price:{
        small:{type:Number},
        medium:{type:Number},
        large:{type:Number}
    },
    popular:{type:Boolean}
});

FoodSchema.statics.findByFoodName = function (username) {
  return this.findOne({ username: username });
};

FoodSchema.statics.findByFoodKindId = function (foodKindId) {
  return this.find({ foodKindId: foodKindId});
};


export default mongoose.model('Food', FoodSchema);