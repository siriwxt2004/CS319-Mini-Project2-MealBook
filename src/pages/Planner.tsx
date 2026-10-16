import { Link } from "react-router";
import {
  ArrowRight,
  CalendarDays,
  Trash2,
  X,
} from "lucide-react";
import { useMeals } from "../hooks";
import { useMealStore } from "../store";
import { DAYS, type MealDetail } from "../types";

export default function Planner() {
  const favorites = useMealStore((state) => state.favorites);
  const plan = useMealStore((state) => state.plan);
  const setPlan = useMealStore((state) => state.setPlan);
  const clearPlan = useMealStore((state) => state.clearPlan);

  const favoriteQueries = useMeals(favorites);

  // สร้าง Map เพื่อค้นหาข้อมูลสูตรอาหารจาก ID ได้สะดวก
  const mealsMap = new Map<string, MealDetail>();
  for (const queryResult of favoriteQueries) {
    if (queryResult.data) {
      mealsMap.set(queryResult.data.idMeal, queryResult.data);
    }
  }

  const plannedCount = DAYS.filter((dayName) => Boolean(plan[dayName])).length;

  return (
    <div>
      <h1>Planner</h1>
    </div>
  )
}
