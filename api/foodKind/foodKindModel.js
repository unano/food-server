import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const FoodKindSchema = new Schema({
    foodKindId:{type:String},
    foodKind:{type:String},
    foodKindEn:{type:String}
});

export default mongoose.model('FoodKinds', FoodKindSchema);