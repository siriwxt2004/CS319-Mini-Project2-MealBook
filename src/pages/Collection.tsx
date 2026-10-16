import { Link } from "react-router";
import { CalendarDays, CookingPot, Heart, Plus } from "lucide-react";
import { useMeals } from "../hooks";
import { useMealStore } from "../store";
import MealCard from "../components/MealCard";
import { GridSkeleton } from "../components/States";

export default function Collection() {
  const favoriteIds = useMealStore((state) => state.favorites);
  const mealQueries = useMeals(favoriteIds);

  const isLoading = mealQueries.some((queryResult) => queryResult.isLoading);
  const hasError = mealQueries.some((queryResult) => queryResult.isError);

  // สั่งให้ query ที่เกิด error ลองดึงข้อมูลใหม่อีกครั้ง
  const handleRetryFailedQueries = () => {
    mealQueries.forEach((queryResult) => {
      if (queryResult.isError) {
        void queryResult.refetch();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ส่วนหัวของหน้าสูตรของฉัน */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Heart className="size-6 text-red-500" fill="currentColor" aria-hidden="true" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              สูตรอาหารที่บันทึก
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              {favoriteIds.length} เมนู
            </span>
          </div>
          
        </div>

        {favoriteIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/planner"
              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5 border-none font-medium"
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              <span>นำไปจัดแผนมื้ออาหาร</span>
            </Link>
            <Link
              to="/"
              className="btn btn-sm btn-ghost rounded-lg gap-1 text-gray-600 hover:bg-gray-100"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span>เพิ่มสูตรอื่น</span>
            </Link>
          </div>
        )}
      </div>

      {/* หน้าจอเมื่อยังไม่มีสูตรอาหารในรายการโปรด */}
      {favoriteIds.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-14 px-6 text-center space-y-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Heart className="size-7" aria-hidden="true" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-gray-800">
              ยังไม่มีสูตรอาหารที่บันทึกไว้
            </h3>
            <p className="text-xs text-gray-500">
              กดปุ่มหัวใจที่มุมของการ์ดสูตรอาหาร เพื่อบันทึกไว้ในหน้านี้
              และนำไปจัดตารางมื้ออาหารได้ง่ายๆ
            </p>
          </div>
          <Link
            to="/"
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 gap-1.5 border-none mt-2"
          >
            <CookingPot className="size-4" aria-hidden="true" />
            <span>เริ่มค้นหาและเลือกสูตรอาหาร</span>
          </Link>
        </div>
      )}

      {/* ระหว่างรอโหลดข้อมูล */}
      {isLoading && (
        <GridSkeleton count={Math.min(favoriteIds.length || 4, 8)} />
      )}

      {/* แจ้งเตือนเมื่อโหลดสูตรอาหารบางรายการไม่สำเร็จ */}
      {hasError && (
        <div
          role="alert"
          className="alert alert-error alert-soft rounded-xl flex items-center justify-between p-3 text-xs"
        >
          <span>เกิดข้อผิดพลาดในการโหลดข้อมูลบางสูตรอาหาร</span>
          <button
            type="button"
            className="btn btn-xs btn-error rounded-md"
            onClick={handleRetryFailedQueries}
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}

      {/* รายการการ์ดสูตรอาหารโปรด */}
      {favoriteIds.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {mealQueries.map((queryResult) => {
            if (!queryResult.data) {
              return null;
            }
            return (
              <MealCard
                key={queryResult.data.idMeal}
                meal={queryResult.data}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
