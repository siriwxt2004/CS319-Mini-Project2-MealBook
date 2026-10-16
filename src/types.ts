// ข้อมูลย่อของสูตรอาหารสำหรับแสดงผลในการ์ด
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

// ข้อมูลแบบละเอียดของสูตรอาหาร
export interface MealDetail extends MealSummary {
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: string]: string | null;
}

// โครงสร้าง Response ที่ตอบกลับมาจาก TheMealDB API
export interface MealsResponse<T> {
  meals: T[] | null;
}

// ข้อมูลส่วนผสมและปริมาณ
export interface Ingredient {
  name: string;
  measure: string;
}

// รายชื่อวันในสัปดาห์สำหรับจัดแผนอาหาร
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
