const { DB_PROTOCOL, DB_HOST, DB_PORT, DB_NAME } = require('../src/app/config');
const test = require('tape');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app/app');

const request = supertest(app);
const databasePrefixName = 'test';
const databaseUrl = `${DB_PROTOCOL}://${DB_HOST}:${DB_PORT}/${databasePrefixName}_${DB_NAME}`;
let databaseConnected = false;
let user = null;

process.env.DB_NAME = 'restapi';

// const isDBConnected = () => databaseConnected;

test('Connect to database', t => {
  mongoose
    .connect(databaseUrl)
    .then(() => {
      databaseConnected = true;
      t.pass('connected');
      t.comment('Drop database');
      return mongoose.connection.db.dropDatabase();
    })
    .then(() => {
      t.pass('dropped');
      t.end();
    })
    .catch(err => {
      t.error(err, 'Error');
      t.end();
    });
});

test('Insert user - POST /users', t => {
  if (databaseConnected === false) {
    t.fail('Database not connected');
    t.end();
  } else {
    const expected = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@gmail.com',
    };

    request
      .post('/users')
      .send(expected)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(res => {
        t.pass('inserted');
        user = res.body.data;
        const actual = {
          firstName: res.body.data.firstName,
          lastName: res.body.data.lastName,
          email: res.body.data.email,
        };
        t.deepEqual(actual, expected, 'they are equal');
        t.end();
      })
      .catch(err => {
        t.error(err, 'error');
        t.end();
      });
  }
});

test('Retrieve user by id - GET /users/:id', t => {
  if (databaseConnected === false) {
    t.fail('Database not connected');
    t.end();
  } else {
    request
      .get(`/users/${user._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        t.equal(res.body.data._id, user._id, 'retrieved');
        t.end();
      })
      .catch(err => {
        t.error(err, 'error');
        t.end();
      });
  }
});

/* test('Update user´s name - PUT /users/[id]', (t) => {
  
});

test('GET /users', (t) => {
  request(app)
    .get('/users')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.error(err, 'No error');
      // console.log()
      t.end();
    });
}); */

test.onFinish(() => {
  try {
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }

  process.exit(0);
});
