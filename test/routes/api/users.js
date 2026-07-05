import { test } from "node:test";
import * as assert from "node:assert";
import { build } from "../../helper.js";
import { buildUser } from "../../../lib/data.js";

test("get users", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/api/users",
  });

  assert.equal(res.statusCode, 200, res.body);
});

test("get user/:id", async (t) => {
  const app = await build(t);

  const user = await app.db.query.users.findFirst();

  assert.ok(user, "No user found in the database");

  const res = await app.inject({
    url: `/api/users/${user.id}`,
  });

  assert.equal(res.statusCode, 200, res.body);
});

test("post user", async (t) => {
  const app = await build(t);

  const body = buildUser();

  const res = await app.inject({
    url: "/api/users",
    method: "POST",
    body,
  });

  assert.equal(res.statusCode, 201, res.body);
});

test("patch user/:id", async (t) => {
  const app = await build(t);
  const user = await app.db.query.users.findFirst();

  assert.ok(user, "No user found in the database");

  const body = buildUser();

  const res = await app.inject({
    url: `/api/users/${user.id}`,
    method: "PATCH",
    body,
  });

  assert.equal(res.statusCode, 200, res.body);
});

test("delete users/:id", async (t) => {
  const app = await build(t);

  const user = await app.db.query.users.findFirst();
  assert.ok(user);

  const res = await app.inject({
    method: "delete",
    url: `/api/users/${user.id}`,
  });

  assert.equal(res.statusCode, 204, res.body);
});
