import usersModel from '../api/users/userModel';
import foodModel from '../api/food/foodModel';
import foodKindModel from '../api/foodKind/foodKindModel';
import {foods} from "../seedData/food"
import {foodKinds} from "../seedData/foodKind"

const users = [
  {
    'username': 'user1',
    'password': 'test1',
    'phoneNumber':'12345678',
    'address': 'Happy Road'
  },
  {
    'username': 'user2',
    'password': 'test2',
    'phoneNumber':'45345678',
    'address': 'Happy Road'
  },
];


// deletes all user documents in collection and inserts test data
export async function loadUsers() {
  console.log('load user Data');
    try {
      await usersModel.deleteMany();
      await users.forEach(user => usersModel.create(user));
      console.info(`${users.length} users were successfully stored.`);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  }

export async function loadFoods() {
    console.log('load food Data');
      try {
        await foodModel.deleteMany();
        await foods.forEach(food => foodModel.create(food));
        console.info(`${foods.length} foods were successfully stored.`);
      } catch (err) {
        console.error(`failed to Load food Data: ${err}`);
      }
    }

export async function loadFoodKinds() {
      console.log('load foodKind Data');
        try {
          await foodKindModel.deleteMany();
          await foodKinds.forEach(foodKind => foodKindModel.create(foodKind));
          console.info(`${foodKinds.length} foodKinds were successfully stored.`);
        } catch (err) {
          console.error(`failed to Load foodKind Data: ${err}`);
        }
      }