// task-service/tests/task-services.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../index");

let mongoServer;

jest.mock("amqplib", () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
    }),
  }),
}));

jest.mock("../rabbitMq/rabbit", () => ({
  getChannel: jest.fn(() => ({
    sendToQueue: jest.fn(),
  })),
  connectRabbitMQWithRetry: jest.fn(),
}));

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
//   await Task.deleteMany({});
});

// TEST: GET /
test("GET / should return Task service running message", async () => {
  const res = await request(app).get("/");

  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe("OK");
  expect(res.body.info).toBe("Task Service is running...");
});

// TEST: GET /tasks (empty)
test("GET /tasks should return empty array when no tasks exist", async () => {
  const res = await request(app).get("/tasks");
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([]);
});

// TEST: POST /tasks/add
test("POST /tasks should create a new task", async () => {
  const res = await request(app)
    .post("/tasks/add")
    .send({ title: "task1", description: "description1", userId: "user1" });

  expect(res.statusCode).toBe(201);
  expect(res.body.title).toBe("task1");
  expect(res.body.description).toBe("description1");
  expect(res.body.userId).toBe("user1");
});

// TEST: GET /tasks (List of length 1)
test("GET /tasks should return an array after 1 tasks exist", async () => {
  const res = await request(app).get("/tasks");
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveLength(1);
});
