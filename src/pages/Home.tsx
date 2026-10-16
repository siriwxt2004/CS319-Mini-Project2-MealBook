import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Beef,
  CakeSlice,
  Drumstick,
  Egg,
  Fish,
  Salad,
  Search,
  SearchX,
  Tag,
  Utensils,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fetchByCategory, fetchCategories, searchMeals } from "../api";
import MealCard from "../components/MealCard";
import { ErrorBox, GridSkeleton } from "../components/States";

const STALE_TIME = 1000 * 60 * 10; // 10 นาที

// ไอคอนประจำหมวดหมู่อาหาร
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Beef: Beef,
  Chicken: Drumstick,
  Dessert: CakeSlice,
  Lamb: Beef,
  Miscellaneous: UtensilsCrossed,
  Pasta: Utensils,
  Pork: Beef,
  Seafood: Fish,
  Side: Salad,
  Starter: Utensils,
  Vegan: Salad,
  Vegetarian: Salad,
  Breakfast: Egg,
  Goat: Beef,
};




export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Seafood");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ดึงรายชื่อหมวดหมู่ทั้งหมด
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: STALE_TIME * 6,
  });

  // ดึงข้อมูลสูตรอาหาร: ถ้ามีคำค้นหาให้ค้นหาด้วย keyword ถ้าไม่มีให้ค้นหาตามหมวดหมู่
  const mealsQuery = useQuery({
    queryKey: searchTerm
      ? ["search", searchTerm]
      : ["category", selectedCategory],
    queryFn: () => {
      if (searchTerm) {
        return searchMeals(searchTerm);
      }
      return fetchByCategory(selectedCategory);
    },
    staleTime: STALE_TIME,
  });

  // เมื่อผู้ใช้กดค้นหา
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanKeyword = searchInput.trim();
    if (cleanKeyword) {
      setSearchTerm(cleanKeyword);
    }
  };

  // ล้างการค้นหาเพื่อกลับมาดูตามหมวดหมู่
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchInput("");
  };

  // คลิกที่แท็กแนะนำ
  const handleQuickTagClick = (tagLabel: string) => {
    setSearchInput(tagLabel);
    setSearchTerm(tagLabel);
  };

  // เลือกลงหมวดหมู่ใหม่
  const handleSelectCategory = (categoryName: string) => {
    setSearchTerm("");
    setSearchInput("");
    setSelectedCategory(categoryName);
  };

  const mealsData = mealsQuery.data;

  return (
    <div className="space-y-6">
      {/* ส่วน Banner ค้นหาเรียบง่าย */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs text-center space-y-4">
      

        {/* ฟอร์มค้นหาอาหาร */}
        <form
          onSubmit={handleSearchSubmit}
          className="mx-auto flex w-full max-w-xl items-center rounded-lg border border-gray-300 bg-white p-1 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-colors"
        >
          <span className="pl-3 pr-2 text-gray-400">
            <Search className="size-4" aria-hidden="true" />
          </span>
          <input
            type="text"
            className="w-full bg-transparent px-2 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            placeholder="ค้นหาอาหาร"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn btn-ghost btn-circle btn-xs text-gray-400 hover:text-gray-700 mr-1"
              title="ล้างคำค้นหา"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}

          <button
            type="submit"
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-4 font-medium border-none"
          >
            ค้นหา
          </button>
        </form>

        
      </section>

      {/* ส่วนเลือกหมวดหมู่อาหาร */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Tag className="size-4 text-emerald-600" aria-hidden="true" />
            <span>หมวดหมู่อาหาร</span>
          </h2>

          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn btn-ghost btn-xs text-emerald-600 gap-1 hover:bg-emerald-50"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              <span>กลับไปดูตามหมวดหมู่</span>
            </button>
          )}
        </div>

        {categoriesQuery.isLoading && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="skeleton h-8 w-24 rounded-lg" />
            ))}
          </div>
        )}

        {categoriesQuery.isError && (
          <div className="alert alert-error alert-soft p-3 rounded-lg flex items-center justify-between">
            <span className="text-sm">ไม่สามารถโหลดหมวดหมู่อาหารได้</span>
            <button
              type="button"
              className="btn btn-sm btn-error"
              onClick={() => categoriesQuery.refetch()}
            >
              ลองใหม่
            </button>
          </div>
        )}

        {categoriesQuery.data && (
          <div className="flex flex-wrap gap-2">
            {categoriesQuery.data.map((categoryName) => {
              const isSelected = !searchTerm && categoryName === selectedCategory;
              const CategoryIcon = CATEGORY_ICONS[categoryName] ?? Utensils;

              const buttonClass = isSelected
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200";

              return (
                <button
                  key={categoryName}
                  type="button"
                  onClick={() => handleSelectCategory(categoryName)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${buttonClass}`}
                >
                  <CategoryIcon className="size-3.5" aria-hidden="true" />
                  <span>{categoryName}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ส่วนแสดงผลลัพธ์รายการสูตรอาหาร */}
      <section className="space-y-4">
        {mealsData && mealsData.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">
                {searchTerm
                  ? `ผลการค้นหาสำหรับ “${searchTerm}”`
                  : `เมนูในหมวดหมู่ ${selectedCategory}`}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                {mealsData.length} รายการ
              </span>
            </div>

            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="btn btn-sm btn-ghost gap-1 text-xs text-gray-500 hover:text-gray-800"
              >
                <span>ล้างคำค้นหา</span>
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* สถานะกำลังโหลด */}
        {mealsQuery.isLoading && <GridSkeleton count={8} />}

        {/* สถานะโหลดข้อมูลล้มเหลว */}
        {mealsQuery.isError && (
          <ErrorBox
            error={mealsQuery.error}
            onRetry={() => mealsQuery.refetch()}
          />
        )}

        {/* สถานะค้นหาแล้วไม่พบข้อมูล */}
        {mealsData && mealsData.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-14 px-4 text-center">
            <SearchX className="size-10 mb-2 text-gray-400" aria-hidden="true" />
            <h3 className="text-base font-bold text-gray-800">
              ไม่พบสูตรอาหารที่ตรงกับ “{searchTerm}”
            </h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm">
              ระบบรองรับคำค้นหาภาษาอังกฤษ เช่น chicken, beef, soup, pasta
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline border-gray-300 rounded-lg text-xs"
                onClick={() => handleQuickTagClick("chicken")}
              >
                ลองค้นหา Chicken
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline border-gray-300 rounded-lg text-xs"
                onClick={() => handleQuickTagClick("pasta")}
              >
                ลองค้นหา Pasta
              </button>
              <button
                type="button"
                className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs border-none"
                onClick={handleClearSearch}
              >
                กลับไปดูตามหมวดหมู่
              </button>
            </div>
          </div>
        )}

        {/* การ์ดรายการอาหาร */}
        {mealsData && mealsData.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {mealsData.map((meal) => (
              <MealCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
