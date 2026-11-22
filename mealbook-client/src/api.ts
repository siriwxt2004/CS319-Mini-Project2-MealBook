import type { AuthUser, Day, Ingredient, MealDetail, MealSummary } from "./types";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `เซิร์ฟเวอร์ตอบกลับผิดพลาด (HTTP ${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

export function login(email: string, password: string): Promise<AuthUser> {
  return request<AuthUser>("/auth", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchCategories(): Promise<string[]> {
  return request<string[]>("/categories");
}

export function fetchMeals(
  category: string,
  searchTerm: string
): Promise<MealSummary[]> {
  const params = new URLSearchParams();
  if (category && !searchTerm) params.set("category", category);
  if (searchTerm) params.set("search", searchTerm);
  return request<MealSummary[]>(`/meals?${params.toString()}`);
}

export function fetchMeal(id: string): Promise<MealDetail> {
  return request<MealDetail>(`/meals/${encodeURIComponent(id)}`);
}

export function fetchFavorites(userId: number): Promise<MealSummary[]> {
  return request<MealSummary[]>(`/favorites?userId=${userId}`);
}

export function addFavorite(userId: number, mealId: string): Promise<void> {
  return request<void>("/favorites", {
    method: "POST",
    body: JSON.stringify({ userId, mealId: Number(mealId) }),
  });
}

export function removeFavorite(userId: number, mealId: string): Promise<void> {
  return request<void>(
    `/favorites/${encodeURIComponent(mealId)}?userId=${userId}`,
    { method: "DELETE" }
  );
}

export interface MealPlanEntry {
  day: Day;
  meal: MealDetail;
}

export function fetchMealPlans(userId: number): Promise<MealPlanEntry[]> {
  return request<MealPlanEntry[]>(`/plans?userId=${userId}`);
}

export function saveMealPlan(
  userId: number,
  day: Day,
  mealId: string
): Promise<void> {
  return request<void>("/plans", {
    method: "PUT",
    body: JSON.stringify({ userId, day, mealId: Number(mealId) }),
  });
}

export function removeMealPlan(userId: number, day: Day): Promise<void> {
  return request<void>(`/plans/${encodeURIComponent(day)}?userId=${userId}`, {
    method: "DELETE",
  });
}

export function clearMealPlans(userId: number): Promise<void> {
  return request<void>(`/plans?userId=${userId}`, { method: "DELETE" });
}

export function getIngredients(meal: MealDetail): Ingredient[] {
  return meal.ingredients;
}
