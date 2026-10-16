import { Link } from "react-router";
import { ArrowRight, Heart } from "lucide-react";
import { useMealStore } from "../store";
import type { MealSummary } from "../types";

interface MealCardProps {
  meal: MealSummary;
}

// การ์ดแสดงผลสูตรอาหารแต่ละรายการ
export default function MealCard({ meal }: MealCardProps) {
  const isFavorite = useMealStore((state) =>
    state.favorites.includes(meal.idMeal)
  );
  const toggleFavorite = useMealStore((state) => state.toggleFavorite);

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(meal.idMeal);
  };

  const favoriteButtonClass = isFavorite
    ? "bg-red-500 text-white hover:bg-red-600"
    : "bg-white/90 text-gray-600 hover:text-red-500 border border-gray-200 hover:bg-white";

  const buttonAriaLabel = isFavorite
    ? "เอาออกจากสูตรโปรด"
    : "บันทึกเป็นสูตรโปรด";

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        <Link to={`/recipe/${meal.idMeal}`} className="block h-full w-full">
          <img
            src={meal.strMealThumb + "/medium"}
            alt={meal.strMeal}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </Link>

        <button
          type="button"
          className={`absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full shadow-xs transition-colors ${favoriteButtonClass}`}
          aria-pressed={isFavorite}
          aria-label={buttonAriaLabel}
          onClick={handleFavoriteClick}
        >
          <Heart
            className="size-4"
            fill={isFavorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ส่วนรายละเอียดชื่ออาหารและลิงก์ */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <Link
          to={`/recipe/${meal.idMeal}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 hover:text-emerald-600 transition-colors"
          title={meal.strMeal}
        >
          {meal.strMeal}
        </Link>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-500">
          <Link
            to={`/recipe/${meal.idMeal}`}
            className="flex items-center gap-1 font-medium text-emerald-600 hover:underline"
          >
            <span>ดูวิธีทำ</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
