import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT) || 4000;
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const databasePath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(serverDirectory, "data", "users.json");
const dataDirectory = path.dirname(databasePath);

let databaseQueue = Promise.resolve();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

async function ensureDatabase() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(databasePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    await writeFile(databasePath, "[]\n", "utf8");
  }
}

async function readUsers() {
  await ensureDatabase();
  const content = await readFile(databasePath, "utf8");
  const users = JSON.parse(content);

  if (!Array.isArray(users)) {
    throw new Error("users.json faylining formati noto‘g‘ri.");
  }

  return users;
}

async function saveUsers(users) {
  await writeFile(databasePath, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

function useDatabase(task) {
  const operation = databaseQueue.then(task);
  databaseQueue = operation.catch(() => undefined);
  return operation;
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}

function validateCredentials(username, password) {
  if (typeof username !== "string" || typeof password !== "string") {
    return "Username va password kiritilishi shart.";
  }

  const cleanUsername = username.trim();

  if (cleanUsername.length < 3) {
    return "Username kamida 3 ta belgidan iborat bo‘lishi kerak.";
  }

  if (password.length < 6) {
    return "Password kamida 6 ta belgidan iborat bo‘lishi kerak.";
  }

  return null;
}

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/register", async (request, response, next) => {
  try {
    const { username, password } = request.body;
    const validationError = validateCredentials(username, password);

    if (validationError) {
      response.status(400).json({ message: validationError });
      return;
    }

    const cleanUsername = username.trim();
    const user = await useDatabase(async () => {
      const users = await readUsers();
      const alreadyExists = users.some(
        (item) => item.username.toLowerCase() === cleanUsername.toLowerCase(),
      );

      if (alreadyExists) {
        const error = new Error("Bu username allaqachon ro‘yxatdan o‘tgan.");
        error.status = 409;
        throw error;
      }

      const newUser = {
        id: randomUUID(),
        username: cleanUsername,
        passwordHash: await bcrypt.hash(password, 12),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await saveUsers(users);
      return newUser;
    });

    response.status(201).json({
      message: "Ro‘yxatdan muvaffaqiyatli o‘tdingiz.",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/login", async (request, response, next) => {
  try {
    const { username, password } = request.body;

    if (typeof username !== "string" || typeof password !== "string") {
      response
        .status(400)
        .json({ message: "Username va password kiritilishi shart." });
      return;
    }

    const users = await useDatabase(readUsers);
    const user = users.find(
      (item) => item.username.toLowerCase() === username.trim().toLowerCase(),
    );
    const passwordIsCorrect = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordIsCorrect) {
      response
        .status(401)
        .json({ message: "Username yoki password noto‘g‘ri." });
      return;
    }

    response.json({
      message: "Hisobingizga muvaffaqiyatli kirdingiz.",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
});

app.use((_request, response) => {
  response.status(404).json({ message: "API manzili topilmadi." });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response
    .status(error.status ?? 500)
    .json({ message: error.message ?? "Serverda xatolik yuz berdi." });
});

await ensureDatabase();

app.listen(port, () => {
  console.log(`Barg API http://localhost:${port} manzilida ishlamoqda.`);
});