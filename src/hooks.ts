import { useQueries } from "@tanstack/react-query";
import { fetchMeal } from "./api";

// Custom hook สำหรับดึงข้อมูลสูตรอาหารหลายรายการพร้อมกันจากรายชื่อ ID
export function useMeals(mealIds: string[]) {
  return useQueries({
    queries: mealIds.map((id) => {
      return {
        queryKey: ["meal", id],
        queryFn: () => fetchMeal(id),
        staleTime: 1000 * 60 * 30, // 30 นาที
      };
    }),
  });
}
