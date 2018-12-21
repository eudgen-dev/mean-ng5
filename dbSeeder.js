// Module dependencies
const mongoose = require('mongoose'),
  config = require('./config/database'),
  BPromise = require('bluebird'),
  User = require('./models/User'),
  Task = require('./models/Task');

class DBSeeder {

  init() {
    mongoose.Promise = BPromise;
    mongoose.connect(config.database, {promiseLibrary: BPromise})
      .then(() => {
        this.seed();
      })
      .catch((err) => {
        console.error(err)
      });
  }

  seed() {
    console.log('Seeding data....');

    let usersData = [{
      name: "Test User",
      email: "test@test.com",
      password: "password"
    }];

    let tasksData = [
      {
        title: 'first task',
        dueOn: '2019-01-01T00:00:00.000Z'
      },
      {
        title: 'second task',
        dueOn: '2019-01-03T00:00:00.000Z'
      }
    ];



    User.remove({}).then(() => {
      let users = [];
      usersData.forEach((user) => {
        let newUser = new User(user);
        users.push(newUser.save().then((user) => {
          let tasks = [];
          tasksData.forEach((task) => {
            task.userId = user.id;
            let taskObj = new Task(task);
            tasks.push(taskObj.save())
          });
          return BPromise.all(tasks);
        }));
      });

      BPromise.all(users).then((result) => {
        console.log(`USERS added: ${result.length}`);
        process.exit(1);
      })
    });
  }
}

let seeder = new DBSeeder();
seeder.init();
module.exports = seeder;
