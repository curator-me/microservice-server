// user-service/tests/user-services.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../controllers/users"); 
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean DB before each test
  await User.deleteMany({});
});

// TEST: GET /
test("GET / should return service running message", async () => {
  const res = await request(app).get("/");
  expect(res.statusCode).toBe(200);
  expect(res.text).toBe("User Services is running!");
});

// TEST: GET /users (empty)
test("GET /users should return empty array when no users exist", async () => {
  const res = await request(app).get("/users");
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([]);
});

// TEST: POST /users
test("POST /users should create a new user", async () => {
  const res = await request(app)
    .post("/users")
    .send({ name: "Alice", email: "alice@example.com" });

  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe("Alice");
  expect(res.body.email).toBe("alice@example.com");
});

// TEST: GET /users/:id
test("GET /users/:id should return a user if found", async () => {
  const user = await User.create({ name: "Bob", email: "bob@example.com" });

  const res = await request(app).get(`/users/${user._id}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.name).toBe("Bob");
});

// TEST: GET /users/:id (not found)
test("GET /users/:id should return 404 if user not found", async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await request(app).get(`/users/${fakeId}`);

  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe("User not found");
});

// TEST: GET /users/:id (invalid ID)
test("GET /users/:id should return 400 for invalid ID", async () => {
  const res = await request(app).get("/users/invalid-id-123");

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe("Invalid user ID");
});
