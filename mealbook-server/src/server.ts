import "dotenv/config";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { z } from "zod";
import type { Prisma } from "./generated/prisma/client.js";
import { prisma } from "./lib/prisma.js";

const app = express();
const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"] as const;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

const authSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

const favoriteSchema = z.object({
  userId: z.number().int().positive(),
  mealId: z.number().int().positive(),
});

const planSchema = favoriteSchema.extend({
  day: z.enum(days),
});

const mealQuerySchema = z.object({
  category: z.string().trim().max(100).optional(),
  search: z.string().trim().max(100).optional(),
});

function parseId(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function toMealSummary(meal: {
  id: number;
  name: string;
  image: string | null;
  category: { name: string } | null;
  area: string | null;
}) {
  return {
    idMeal: String(meal.id),
    strMeal: meal.name,
    strMealThumb: meal.image,
    strCategory: meal.category?.name ?? null,
    strArea: meal.area,
  };
}

function toMealDetail(meal: {
  id: number;
  name: string;
  image: string | null;
  category: { name: string } | null;
  area: string | null;
  tags: string | null;
  instructions: string | null;
  ingredients: { name: string; measure: string }[];
}) {
  return {
    ...toMealSummary(meal),
    strTags: meal.tags,
    strInstructions: meal.instructions,
    ingredients: meal.ingredients,
  };
}

const mealInclude = {
  category: true,
  ingredients: { orderBy: { sortOrder: "asc" as const } },
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth", async (req, res) => {
  const input = authSchema.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่านให้ถูกต้อง" });
    return;
  }

  const email = input.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser && existingUser.password !== input.data.password) {
    res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    return;
  }

  const user =
    existingUser ??
    (await prisma.user.create({
      data: { email, password: input.data.password },
    }));

  res.json({ id: user.id, email: user.email });
});

app.get("/api/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });
  res.json(categories.map((category) => category.name));
});

app.get("/api/meals", async (req, res) => {
  const query = mealQuerySchema.safeParse(req.query);

  if (!query.success) {
    res.status(400).json({ error: "ตัวกรองรายการอาหารไม่ถูกต้อง" });
    return;
  }

  const where: Prisma.MealWhereInput = {};

  if (query.data.category) {
    where.category = { is: { name: query.data.category } };
  }

  if (query.data.search) {
    where.name = {
      contains: query.data.search,
      mode: "insensitive",
    };
  }

  const meals = await prisma.meal.findMany({
    where,
    include: mealInclude,
    orderBy: { name: "asc" },
  });

  res.json(meals.map(toMealSummary));
});

app.get("/api/meals/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "รหัสเมนูไม่ถูกต้อง" });
    return;
  }

  const meal = await prisma.meal.findUnique({
    where: { id },
    include: mealInclude,
  });

  if (!meal) {
    res.status(404).json({ error: "ไม่พบเมนูนี้" });
    return;
  }

  res.json(toMealDetail(meal));
});

app.get("/api/favorites", async (req, res) => {
  const userId = parseId(req.query.userId);
  if (userId === null) {
    res.status(400).json({ error: "กรุณาระบุผู้ใช้" });
    return;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { meal: { include: mealInclude } },
    orderBy: { createdAt: "desc" },
  });

  res.json(favorites.map(({ meal }) => toMealSummary(meal)));
});

app.post("/api/favorites", async (req, res) => {
  const input = favoriteSchema.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "ข้อมูลรายการโปรดไม่ถูกต้อง" });
    return;
  }

  const { userId, mealId } = input.data;
  const [user, meal] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.meal.findUnique({ where: { id: mealId }, select: { id: true } }),
  ]);
  if (!user || !meal) {
    res.status(404).json({ error: "ไม่พบผู้ใช้หรือเมนูนี้" });
    return;
  }

  await prisma.favorite.upsert({
    where: { userId_mealId: { userId, mealId } },
    create: { userId, mealId },
    update: {},
  });
  res.status(204).end();
});

app.delete("/api/favorites/:mealId", async (req, res) => {
  const userId = parseId(req.query.userId);
  const mealId = parseId(req.params.mealId);
  if (userId === null || mealId === null) {
    res.status(400).json({ error: "ข้อมูลรายการโปรดไม่ถูกต้อง" });
    return;
  }

  await prisma.favorite.deleteMany({ where: { userId, mealId } });
  res.status(204).end();
});

app.get("/api/plans", async (req, res) => {
  const userId = parseId(req.query.userId);
  if (userId === null) {
    res.status(400).json({ error: "กรุณาระบุผู้ใช้" });
    return;
  }

  const plans = await prisma.mealPlan.findMany({
    where: { userId },
    include: { meal: { include: mealInclude } },
  });
  res.json(
    plans.map(({ day, meal }) => ({
      day,
      meal: toMealDetail(meal),
    }))
  );
});

app.put("/api/plans", async (req, res) => {
  const input = planSchema.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "ข้อมูลแผนมื้ออาหารไม่ถูกต้อง" });
    return;
  }

  const { userId, mealId, day } = input.data;
  const [user, meal] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.meal.findUnique({ where: { id: mealId }, select: { id: true } }),
  ]);
  if (!user || !meal) {
    res.status(404).json({ error: "ไม่พบผู้ใช้หรือเมนูนี้" });
    return;
  }

  await prisma.mealPlan.upsert({
    where: { userId_day: { userId, day } },
    create: { userId, mealId, day },
    update: { mealId },
  });
  res.status(204).end();
});

app.delete("/api/plans/:day", async (req, res) => {
  const userId = parseId(req.query.userId);
  const day = z.enum(days).safeParse(req.params.day);
  if (userId === null || !day.success) {
    res.status(400).json({ error: "ข้อมูลแผนมื้ออาหารไม่ถูกต้อง" });
    return;
  }

  await prisma.mealPlan.deleteMany({ where: { userId, day: day.data } });
  res.status(204).end();
});

app.delete("/api/plans", async (req, res) => {
  const userId = parseId(req.query.userId);
  if (userId === null) {
    res.status(400).json({ error: "กรุณาระบุผู้ใช้" });
    return;
  }

  await prisma.mealPlan.deleteMany({ where: { userId } });
  res.status(204).end();
});

app.use((_req, res) => {
  res.status(404).json({ error: "ไม่พบ API ที่ร้องขอ" });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("API request failed:", error);
  res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
};
app.use(errorHandler);

const port = Number(process.env.PORT ?? "3000");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port");
}

app.listen(port, () => {
  console.log(`Meal Book API listening on http://localhost:${port}`);
});
