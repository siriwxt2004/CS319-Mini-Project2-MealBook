// ข้อมูลในการ์ด
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

// ข้อมูลสูตรอาหาร
export interface MealDetail extends MealSummary {
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: string]: string | null;
}


export interface MealsResponse<T> {
  meals: T[] | null;
}

// ข้อมูลส่วนผสม
export interface Ingredient {
  name: string;
  measure: string;
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
