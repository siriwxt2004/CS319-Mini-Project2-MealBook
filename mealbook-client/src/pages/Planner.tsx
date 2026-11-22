import { Link } from "react-router";
import { ArrowRight, CalendarDays, CookingPot, Trash2, X } from "lucide-react";
import { ErrorBox } from "../components/States";
import LoginPrompt from "../components/LoginPrompt";
import {
  useClearMealPlans,
  useFavorites,
  useMealPlans,
  useRemoveMealPlan,
  useSaveMealPlan,
} from "../hooks";
import { useAuthStore } from "../store";
import { DAYS, type Day } from "../types";

export default function Planner() {
  const user = useAuthStore((state) => state.user);
  const favoritesQuery = useFavorites();
  const plansQuery = useMealPlans();
  const savePlan = useSaveMealPlan();
  const removePlan = useRemoveMealPlan();
  const clearPlans = useClearMealPlans();

  if (!user) {
    return <LoginPrompt />;
  }

  const favorites = favoritesQuery.data ?? [];
  const plans = plansQuery.data ?? [];
  const planByDay = new Map(plans.map((plan) => [plan.day, plan]));
  const plannedCount = plans.length;
  const queryError = favoritesQuery.error ?? plansQuery.error;
  const mutationError =
    savePlan.error ?? removePlan.error ?? clearPlans.error;

  const handleChangePlan = (day: Day, mealId: string) => {
    if (mealId) {
      savePlan.mutate({ day, mealId });
    } else {
      removePlan.mutate(day);
    }
  };

  if (favoritesQuery.isLoading || plansQuery.isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5">
        <span className="loading loading-spinner loading-sm text-emerald-600" />
        <p className="text-sm text-gray-700">กำลังโหลดแผนมื้ออาหาร…</p>
      </div>
    );
  }

  if (queryError) {
    return (
      <ErrorBox
        error={queryError}
        onRetry={() => {
          void favoritesQuery.refetch();
          void plansQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-6 text-emerald-600" aria-hidden="true" />
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            แผนมื้ออาหาร
          </h1>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
            {plannedCount}/7 วัน
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {plannedCount > 0 && (
            <button
              type="button"
              className="btn btn-sm gap-1.5 border-none bg-red-600 text-white hover:bg-red-700"
              onClick={() => clearPlans.mutate()}
              disabled={clearPlans.isPending}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              <span>ล้างแผนทั้งหมด</span>
            </button>
          )}
          <Link
            to="/collection"
            className="btn btn-ghost btn-sm gap-1 text-gray-600"
          >
            ดูรายการโปรด
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {mutationError && (
        <p role="alert" className="alert alert-error rounded-xl text-sm">
          {mutationError.message}
        </p>
      )}

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <CookingPot className="size-12 text-emerald-600" aria-hidden="true" />
          <h2 className="text-base font-bold text-gray-800">
            เพิ่มสูตรอาหารโปรดก่อนจัดแผน
          </h2>
          <Link to="/" className="btn btn-sm mt-2 bg-emerald-600 text-white">
            ไปเลือกสูตรอาหาร
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DAYS.map((day) => {
            const plan = planByDay.get(day);
            return (
              <section
                key={day}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold text-gray-900">{day}</h2>
                  {plan && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs gap-1 text-red-600 hover:bg-red-50"
                      onClick={() => removePlan.mutate(day)}
                      disabled={removePlan.isPending}
                      aria-label={`ลบเมนูของวัน${day}`}
                    >
                      <X className="size-4" aria-hidden="true" />
                      เอาออก
                    </button>
                  )}
                </div>

                <select
                  className="select select-bordered mt-3 w-full"
                  value={plan?.meal.idMeal ?? ""}
                  onChange={(event) => handleChangePlan(day, event.target.value)}
                  disabled={savePlan.isPending || removePlan.isPending}
                  aria-label={`เลือกเมนูสำหรับวัน${day}`}
                >
                  <option value="">-- เลือกสูตรอาหาร --</option>
                  {favorites.map((meal) => (
                    <option key={meal.idMeal} value={meal.idMeal}>
                      {meal.strMeal}
                    </option>
                  ))}
                </select>

                {plan && (
                  <Link
                    to={`/recipe/${plan.meal.idMeal}`}
                    className="mt-3 flex items-center gap-3 rounded-lg border border-gray-100 p-2 hover:bg-gray-50"
                  >
                    <img
                      src={plan.meal.strMealThumb ?? ""}
                      alt=""
                      className="size-16 rounded-lg object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                      {plan.meal.strMeal}
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
