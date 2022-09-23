process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("./API");
const db = require("./fakeDb");

let testItem = { name: "pasta", price: 3.94, qty: 1 };
db.saveFile([]);
db.items = [];

beforeEach(() => {
  db.items.push(testItem);
  db.saveFile(db.items);
});

afterEach(() => {
  db.saveFile([]);
  db.items = [];
});

describe("GET/items", () => {
  test("get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ name: "pasta", price: 3.94, qty: 1 }]);
  });
});

describe("GET/items/:name", () => {
  test("get an item", async () => {
    const res = await request(app).get(`/items/${testItem.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ name: "pasta", price: 3.94, qty: 1 });
  });

  test("404 if item dose not exist", async () => {
    const res = await request(app).get("/items/cheese");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST/items", () => {
  test("make an item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "milk", price: 1.99, qty: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "milk", price: 1.99, qty: 1 } });
  });

  test("400 if invalid item info", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: null, price: null, qty: null });
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual("There must be a name and price for the item!");
  });

  test("400 if more than one item with the same userName", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "pasta", price: 1.99, qty: null });
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(
      'Name must be Unique, an Item with the name of "pasta" already exists!'
    );
  });
});

describe("PATCH/items/:name", () => {
  test("edit an item", async () => {
    const res = await request(app)
      .patch(`/items/${testItem.name}`)
      .send({ price: 2.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "pasta", price: 2.99, qty: 1 },
    });
  });

  test("404 if item dose not exist", async () => {
    const res = await request(app).patch("/items/cheese").send({ price: 2.99 });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE/items/:name", () => {
  test("delete an item", async () => {
    const res = await request(app).delete("/items/pasta");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: "deleted item" });
  });

  test("404 if item dose not exist", async () => {
    const res = await request(app).delete("/items/cheese");
    expect(res.statusCode).toBe(404);
  });
});
