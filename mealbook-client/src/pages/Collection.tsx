import { Link } from "react-router";
import { CalendarDays, CookingPot, Heart, Plus } from "lucide-react";
import { useFavorites } from "../hooks";
import { useAuthStore } from "../store";
import MealCard from "../components/MealCard";
import LoginPrompt from "../components/LoginPrompt";
import { ErrorBox, GridSkeleton } from "../components/States";

export default function Collection() {
  const user = useAuthStore((state) => state.user);
  const favoritesQuery = useFavorites();

  if (!user) {
    return <LoginPrompt />;
  }

  const favorites = favoritesQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-2">
          <Heart
            className="size-6 text-red-500"
            fill="currentColor"
            aria-hidden="true"
          />
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            สูตรอาหารที่บันทึก
          </h1>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            {favorites.length} เมนู
          </span>
        </div>

        {favorites.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/planner"
              className="btn btn-sm gap-1.5 border-none bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              <span>นำไปจัดแผนมื้ออาหาร</span>
            </Link>
            <Link to="/" className="btn btn-ghost btn-sm gap-1 text-gray-600">
              <Plus className="size-4" aria-hidden="true" />
              <span>เพิ่มสูตรอื่น</span>
            </Link>
          </div>
        )}
      </div>

      {favoritesQuery.isLoading && <GridSkeleton count={4} />}

      {favoritesQuery.isError && (
        <ErrorBox
          error={favoritesQuery.error}
          onRetry={() => void favoritesQuery.refetch()}
        />
      )}

      {!favoritesQuery.isLoading && !favoritesQuery.isError && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <CookingPot className="size-12 text-emerald-600" aria-hidden="true" />
          <h2 className="text-base font-bold text-gray-800">
            ยังไม่มีสูตรอาหารที่บันทึก
          </h2>
          <Link
            to="/"
            className="btn btn-sm mt-2 gap-1.5 border-none bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <CookingPot className="size-4" aria-hidden="true" />
            <span>ค้นหาและเลือกสูตรอาหาร</span>
          </Link>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}
