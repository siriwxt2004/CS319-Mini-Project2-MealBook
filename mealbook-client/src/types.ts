// ข้อมูลในการ์ด
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string | null;
  strCategory: string | null;
  strArea: string | null;
}

// ข้อมูลสูตรอาหาร
export interface MealDetail extends MealSummary {
  strInstructions: string | null;
  strTags: string | null;
  ingredients: Ingredient[];
}

// ข้อมูลส่วนผสม
export interface Ingredient {
  name: string;
  measure: string;
}

export interface AuthUser {
  id: number;
  email: string;
}


export const DAYS = [
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
  "อาทิตย์",
] as const;

export type Day = (typeof DAYS)[number];
