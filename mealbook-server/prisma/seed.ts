import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";
import { prisma } from "../src/lib/prisma.js";

const summarySchema = z
  .object({
    idMeal: z.string(),
    strMeal: z.string(),
    strMealThumb: z.string().nullable().optional(),
    strArea: z.string().nullable().optional(),
    strCountry: z.string().nullable().optional(),
  })
  .passthrough();

const detailSchema = summarySchema
  .extend({
    strCategory: z.string().nullable().optional(),
    strInstructions: z.string().nullable().optional(),
    strTags: z.string().nullable().optional(),
  })
  .passthrough();

const sampleDataSchema = z.object({
  sample_categories: z.array(z.object({ strCategory: z.string() })),
  sample_meals_seafood: z.array(summarySchema),
  sample_meal_detail: detailSchema,
});

type MealSeed = z.infer<typeof detailSchema>;

function cleanText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getCategoryName(meal: MealSeed, detailMealId: string): string {
  const category = cleanText(meal.strCategory);
  if (category) {
    return category;
  }

  return meal.idMeal === detailMealId ? "Chicken" : "Seafood";
}

function getIngredients(meal: MealSeed) {
  const ingredients: { name: string; measure: string; sortOrder: number }[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const name = cleanText(meal[`strIngredient${index}`]);
    if (name) {
      ingredients.push({
        name,
        measure: cleanText(meal[`strMeasure${index}`]) ?? "",
        sortOrder: index,
      });
    }
  }

  return ingredients;
}

async function main() {
  const sourcePath = resolve(process.cwd(), "../sample-data.json");
  const sourceFile = await readFile(sourcePath, "utf8");
  const source = sampleDataSchema.parse(JSON.parse(sourceFile));
  const detailMealId = source.sample_meal_detail.idMeal;
  const categoryNames = new Set(
    source.sample_categories.map((category) => category.strCategory)
  );

  const meals = new Map<string, MealSeed>();
  for (const summary of source.sample_meals_seafood) {
    meals.set(summary.idMeal, summary);
  }
  meals.set(detailMealId, source.sample_meal_detail);

  for (const meal of meals.values()) {
    categoryNames.add(getCategoryName(meal, detailMealId));
  }

  const categories = new Map<string, number>();
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      create: { name },
      update: {},
    });
    categories.set(name, category.id);
  }

  for (const meal of meals.values()) {
    const categoryName = getCategoryName(meal, detailMealId);
    const categoryId = categories.get(categoryName);
    if (categoryId === undefined) {
      throw new Error(`Seed category "${categoryName}" was not created`);
    }

    const ingredients = getIngredients(meal);
    await prisma.$transaction(async (transaction) => {
      const mealData = {
        name: meal.strMeal,
        image: cleanText(meal.strMealThumb),
        categoryId,
        area: cleanText(meal.strArea) ?? cleanText(meal.strCountry),
        tags: cleanText(meal.strTags),
        instructions: cleanText(meal.strInstructions),
      };

      const savedMeal = await transaction.meal.upsert({
        where: { sourceId: meal.idMeal },
        create: {
          sourceId: meal.idMeal,
          ...mealData,
        },
        update: mealData,
      });

      await transaction.mealIngredient.deleteMany({
        where: { mealId: savedMeal.id },
      });
      if (ingredients.length > 0) {
        await transaction.mealIngredient.createMany({
          data: ingredients.map((ingredient) => ({
            ...ingredient,
            mealId: savedMeal.id,
          })),
        });
      }
    });
  }

  console.log(`Seeded ${categoryNames.size} categories and ${meals.size} meals`);
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
