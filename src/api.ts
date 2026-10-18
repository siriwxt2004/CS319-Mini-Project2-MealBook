import type {
  Ingredient,
  MealDetail,
  MealSummary,
  MealsResponse,
} from "./types";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(BASE_URL + path);

  if (!response.ok) {
    throw new Error(`เซิร์ฟเวอร์ตอบกลับผิดพลาด (HTTP ${response.status})`);
  }

  const result = (await response.json()) as T;
  return result;
}

// ดึงรายชื่อหมวดหมู่อาหารทั้งหมด
export async function fetchCategories(): Promise<string[]> {
  const data = await get<MealsResponse<{ strCategory: string }>>(
    "/list.php?c=list"
  );

  const categories = (data.meals ?? []).map(
    (categoryItem) => categoryItem.strCategory
  );
  return categories;
}

// ดึงสูตรอาหารตามชื่อหมวดหมู่
export async function fetchByCategory(
  categoryName: string
): Promise<MealSummary[]> {
  const encodedCategory = encodeURIComponent(categoryName);
  const data = await get<MealsResponse<MealSummary>>(
    `/filter.php?c=${encodedCategory}`
  );

  return data.meals ?? [];
}

// ค้นหาสูตรอาหารจากคำค้นหา 
export async function searchMeals(searchQuery: string): Promise<MealSummary[]> {
  const encodedQuery = encodeURIComponent(searchQuery);
  const data = await get<MealsResponse<MealDetail>>(
    `/search.php?s=${encodedQuery}`
  );

  return data.meals ?? [];
}

// ดึงสูตรอาหาร ID
export async function fetchMeal(mealId: string): Promise<MealDetail | null> {
  const encodedId = encodeURIComponent(mealId);
  const data = await get<MealsResponse<MealDetail>>(
    `/lookup.php?i=${encodedId}`
  );

  const meal = data.meals?.[0] ?? null;
  return meal;
}

// ดึงส่วนผสม
export function getIngredients(meal: MealDetail): Ingredient[] {
  const ingredientList: Ingredient[] = [];

  for (let index = 1; index <= 20; index++) {
    const ingredientName = meal[`strIngredient${index}`];
    const measure = meal[`strMeasure${index}`] ?? "";

    if (ingredientName && ingredientName.trim()) {
      ingredientList.push({
        name: ingredientName.trim(),
        measure: measure.trim(),
      });
    }
  }

  return ingredientList;
}
