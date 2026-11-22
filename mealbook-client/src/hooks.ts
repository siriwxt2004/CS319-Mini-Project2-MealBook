import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addFavorite,
  clearMealPlans,
  fetchCategories,
  fetchFavorites,
  fetchMeal,
  fetchMealPlans,
  fetchMeals,
  removeFavorite,
  removeMealPlan,
  saveMealPlan,
} from "./api";
import { useAuthStore } from "./store";
import type { Day } from "./types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
  });
}

export function useMealsList(category: string, searchTerm: string) {
  const cleanKeyword = searchTerm.trim();
  return useQuery({
    queryKey: ["meals", category, cleanKeyword],
    queryFn: () => fetchMeals(category, cleanKeyword),
    staleTime: 1000 * 60 * 10,
  });
}

export function useMealDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["meal", id],
    queryFn: () => {
      if (!id) throw new Error("ไม่พบรหัสเมนู");
      return fetchMeal(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 30,
  });
}

export function useFavorites() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => {
      if (!userId) throw new Error("กรุณาเข้าสู่ระบบ");
      return fetchFavorites(userId);
    },
    enabled: Boolean(userId),
  });
}

export function useToggleFavorite() {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mealId: string) => {
      if (!userId) throw new Error("กรุณาเข้าสู่ระบบก่อนบันทึกรายการโปรด");
      const currentFavorites =
        queryClient.getQueryData<Awaited<ReturnType<typeof fetchFavorites>>>([
          "favorites",
          userId,
        ]) ?? [];
      const isFavorite = currentFavorites.some(
        (meal) => meal.idMeal === mealId
      );
      if (isFavorite) {
        await removeFavorite(userId, mealId);
      } else {
        await addFavorite(userId, mealId);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] }),
  });
}

export function useMealPlans() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ["plans", userId],
    queryFn: () => {
      if (!userId) throw new Error("กรุณาเข้าสู่ระบบ");
      return fetchMealPlans(userId);
    },
    enabled: Boolean(userId),
  });
}

export function useSaveMealPlan() {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ day, mealId }: { day: Day; mealId: string }) => {
      if (!userId) throw new Error("กรุณาเข้าสู่ระบบก่อนบันทึกแผน");
      return saveMealPlan(userId, day, mealId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["plans", userId] }),
  });
}

export function useRemoveMealPlan() {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (day: Day) => {
      if (!userId) throw new Error("กรุณาเข้าสู่ระบบก่อนแก้ไขแผน");
      return removeMealPlan(userId, day);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["plans", userId] }),
  });
}

export function useClearMealPlans() {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("กรุณาเข้าสู่ระบบก่อนแก้ไขแผน");
      return clearMealPlans(userId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["plans", userId] }),
  });
}
