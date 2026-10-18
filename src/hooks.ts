import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchByCategory, fetchCategories, searchMeals, fetchMeal } from "./api";
import type { MealDetail, MealSummary } from "./types";

// 1. Hook ดึงรายชื่อหมวดหมู่อาหาร
export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ["categories"], // คี Cacheหมวดหมู่
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, 
  });
};

// 2.Hookดึงรายการสูตรอาหาร หน้ารายการ ค้นหาด้วยคำค้น กรองตามหมวดหมู่
export const useMealsList = (category: string, searchTerm: string) => {
  const cleanKeyword = searchTerm.trim();

  return useQuery<MealSummary[]>({
    queryKey: cleanKeyword ? ["search", cleanKeyword] : ["category", category],
    queryFn: async () => {
      if (cleanKeyword) {
        return await searchMeals(cleanKeyword);
      }
      return await fetchByCategory(category);
    },
    staleTime: 1000 * 60 * 10, 
  });
};

// 3. Custom Hook ดึงรายละเอียดสูตรอาหาร หน้ารายละเอียด
export const useMealDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery<MealDetail | null>({
    queryKey: ["meal", id], // คีตาม ID ของสูตรอาหารแต่ละเมนู
    queryFn: async () => {
      if (!id) return null;

      // ดึงจาก API ภายนอกโดยตรง TheMealDB lookup
      try {
        const meal = await fetchMeal(id);
        if (meal) return meal;
      } catch (err) {
        console.warn("API error, reading from cache...", err);
      }

      // Fallback  API ภายนอกมีปัญหา ดึงข้อมูลจาก Cache ที่โหลดไว้
      const cached = queryClient.getQueryData<MealDetail | null>(["meal", id]);
      if (cached) return cached;

      throw new Error("ไม่สามารถดึงข้อมูลสูตรอาหารนี้ได้");
    },
    initialData: () => {
      // ดึงข้อมูลจาก Cache มาแสดงระหว่างรอ
      if (!id) return undefined;
      return queryClient.getQueryData<MealDetail | null>(["meal", id]);
    },
    enabled: !!id,             // ทำงานเมื่อมี id 
    staleTime: 1000 * 60 * 30, 
  });
};

// 4. Hook ดึงสูตรอาหารหลายรายการพร้อมกันจาก ID หน้าคอลเลกชัน planner
export const useMeals = (mealIds: string[]) => {
  return useQueries({
    queries: mealIds.map((id) => ({
      queryKey: ["meal", id],
      queryFn: () => fetchMeal(id),
      staleTime: 1000 * 60 * 30, // 30 นาที
    })),
  });
};
