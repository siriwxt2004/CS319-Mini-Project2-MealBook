import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Day } from "./types";

// State ของ Zustand: เก็บเฉพาะ Client State (รหัส ID) เท่านั้น ไม่เก็บ Server Data
interface MealState {
  favorites: string[];
  plan: Partial<Record<Day, string>>;
  toggleFavorite: (id: string) => void;
  setPlan: (day: Day, id: string) => void;
  clearPlan: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      favorites: [],
      plan: {},

      // เพิ่มหรือลบสูตรอาหารออกจากรายการโปรด
      toggleFavorite: (id: string) => {
        set((state) => {
          const isAlreadyFavorite = state.favorites.includes(id);

          if (isAlreadyFavorite) {
            return {
              favorites: state.favorites.filter((favId) => favId !== id),
            };
          } else {
            return {
              favorites: [...state.favorites, id],
            };
          }
        });
      },

      // กำหนดสูตรอาหารสำหรับวันในสัปดาห์ (ถ้า id ว่างจะลบออก)
      setPlan: (day: Day, id: string) => {
        set((state) => {
          const updatedPlan = { ...state.plan };

          if (id) {
            updatedPlan[day] = id;
          } else {
            delete updatedPlan[day];
          }

          return { plan: updatedPlan };
        });
      },

      // ล้างแผนมื้ออาหารทั้งหมด
      clearPlan: () => {
        set({ plan: {} });
      },
    }),
    {
      name: "meal-book-storage",
    }
  )
);
