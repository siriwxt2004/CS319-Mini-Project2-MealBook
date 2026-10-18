import { Link } from "react-router";
import { ArrowRight, CalendarDays, CookingPot, Trash2, X } from "lucide-react";
import { ErrorBox } from "../components/States";
import { useMeals } from "../hooks";
import { useMealStore } from "../store";
import { DAYS, type Day, type MealDetail } from "../types";

export default function Planner() {
  // 1. ดึงรายการ favorites และ plan 
  const favorites = useMealStore((state) => state.favorites);
  const plan = useMealStore((state) => state.plan);
  const setPlan = useMealStore((state) => state.setPlan);
  const clearPlan = useMealStore((state) => state.clearPlan);

  const plannedMealIds = Object.values(plan).filter(
    (mealId): mealId is string => typeof mealId === "string" && mealId.length > 0
  );

  // 2. ดึง Server State Custom Hook useMeals TanStack Quer  ID ที่จำเป็น
  const mealIdsToFetch = Array.from(new Set([...favorites, ...plannedMealIds]));
  const mealQueries = useMeals(mealIdsToFetch);

  // Map ค้นสูตรอาหารจาก ID 
  const mealsMap = new Map<string, MealDetail>();
  for (const queryResult of mealQueries) {
    if (queryResult.data) {
      mealsMap.set(queryResult.data.idMeal, queryResult.data);
    }
  }

  const plannedCount = DAYS.filter((dayName) => Boolean(plan[dayName])).length;

  // 3. ตรวจ Loading Error และฟังก์ชัน Retry
  const hasAnyData = mealQueries.some((queryResult) => Boolean(queryResult.data));
  const isLoading = mealQueries.some((queryResult) => queryResult.isLoading);
  const hasError = mealQueries.some((queryResult) => queryResult.isError);
  const firstError = mealQueries.find((queryResult) => queryResult.isError)?.error;

  const handleRetry = () => {
    mealQueries.forEach((queryResult) => {
      if (queryResult.isError) {
        void queryResult.refetch();
      }
    });
  };

  const handleChangePlan = (day: Day, mealId: string) => {
    setPlan(day, mealId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-6 text-emerald-600" aria-hidden="true" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">แผนมื้ออาหาร</h1>

          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {plannedCount > 0 && (
            <button
              type="button"
              className="btn btn-sm bg-red-600 hover:bg-red-700 text-white rounded-lg gap-1.5 border-none"
              onClick={clearPlan}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              <span>ล้างแผนทั้งหมด</span>
            </button>
          )}
          <Link
            to="/collection"
            className="btn btn-sm btn-ghost rounded-lg gap-1 text-gray-600 hover:bg-gray-100"
          >
            ดูรายการโปรด
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>


      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-14 px-6 text-center space-y-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CookingPot className="size-7" aria-hidden="true" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-gray-800">
              ไม่มีสูตรโปรดสำหรับจัดแผน
            </h3>
            
          </div>
          <Link
            to="/"
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 gap-1.5 border-none mt-2"
          >
            <CookingPot className="size-4" aria-hidden="true" />
            <span>กลับไปหน้าหลัก</span>
          </Link>
        </div>
      )}

      {favorites.length > 0 && !hasAnyData && isLoading && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-sm text-emerald-600" />
              <p className="text-sm font-medium text-gray-800">
                กำลังโหลดรายละเอียดเมนู…
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {DAYS.map((dayName) => (
              <div
                key={dayName}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs"
              >
                <div className="skeleton h-5 w-24 rounded-md" />
                <div className="mt-3 skeleton h-12 w-full rounded-lg" />
                <div className="mt-3 flex gap-3">
                  <div className="skeleton size-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-5/6 rounded-md" />
                    <div className="skeleton h-3 w-1/2 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {favorites.length > 0 && hasError && firstError && (
        <ErrorBox error={firstError} onRetry={handleRetry} />
      )}

      {/* ตารางแผนอาหาร 7 วัน */}
      {favorites.length > 0 && (hasAnyData || !isLoading) && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DAYS.map((dayName) => {
            const selectedMealId = plan[dayName] ?? "";
            const selectedMeal =
              selectedMealId.length > 0 ? mealsMap.get(selectedMealId) : undefined;

            return (
              <div
                key={dayName}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{dayName}</h2>
                    
                  </div>

                  {selectedMealId.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost text-red-600 hover:bg-red-50"
                      onClick={() => handleChangePlan(dayName, "")}
                      aria-label={`ลบเมนูของวัน${dayName}`}
                    >
                      <X className="size-4" aria-hidden="true" />
                      เอาออก
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <select
                    className="select select-bordered w-full"
                    value={selectedMealId}
                    onChange={(event) =>
                      handleChangePlan(dayName, event.target.value)
                    }
                    disabled={isLoading && !hasAnyData}
                  >
                    <option value="">-- เลือกสูตรอาหาร --</option>
                    {favorites.map((favoriteId) => {
                      const favoriteMeal = mealsMap.get(favoriteId);

                      return (
                        <option key={favoriteId} value={favoriteId}>
                          {favoriteMeal ? favoriteMeal.strMeal : favoriteId}
                        </option>
                      );
                    })}
                  </select>
                </div>



                {selectedMealId.length > 0 && selectedMeal && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <img
                      src={selectedMeal.strMealThumb + "/medium"}
                      alt={selectedMeal.strMeal}
                      className="size-16 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/recipe/${selectedMeal.idMeal}`}
                        className="block truncate text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                        title={selectedMeal.strMeal}
                      >
                        {selectedMeal.strMeal}
                      </Link>
                      <Link
                        to={`/recipe/${selectedMeal.idMeal}`}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
                      >
                        ดูรายละเอียด
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* กรณีเลือกแล้วแต่ยังโหลดข้อมูลไม่ทัน / ไม่พบข้อมูล */}
                {selectedMealId.length > 0 && !selectedMeal && (
                  <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-600">
                      {isLoading
                        ? "กำลังโหลดรายละเอียดเมนู…"
                        : "ไม่พบข้อมูลเมนูนี้"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
