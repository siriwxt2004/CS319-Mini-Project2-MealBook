import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Day } from "./types";

// 1. กำหนด Type ของ State และ Action เก็บเฉพาะ Client State
interface MealState {
  favorites: string[];                    // เก็บ Array ของ ID สูตรอาหาร
  plan: Partial<Record<Day, string>>;     // เก็บแผนมื้ออาหาร 7 วัน คู่กับ ID สูตรอาหาร
  toggleFavorite: (id: string) => void;   // ฟังก์ชันสลับสถานะ Favorite พิ่ม/ลบ
  setPlan: (day: Day, id: string) => void;// ฟังก์ชันกำหนด ID อาหารในแต่ละวัน
  clearPlan: () => void;                  // ฟังก์ชันล้างแผนอาหาร
}

// 2. สร้าง Store ด้วย create ครอบด้วย persist เก็บลง LocalStorage 
export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      favorites: [],
      plan: {},

      // เพิ่มลบสูตรรายการโปรด
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

      // กำหนดสูตรอาหาร id ว่างจะลบออก)
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

      // ล้างแผนทั้งหมด
      clearPlan: () => {
        set({ plan: {} });
      },
    }),
    {
      name: "meal-book-storage",
    }
  )
);
