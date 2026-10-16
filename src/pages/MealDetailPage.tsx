import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChefHat,
  CookingPot,
  ExternalLink,
  Globe,
  Heart,
  Play,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { fetchMeal, getIngredients } from "../api";
import { ErrorBox } from "../components/States";
import { useMealStore } from "../store";

// ดึง YouTube Embed URL จากลิงก์ปกติ เพื่อนำมาเล่นวิดีโอบนหน้าเว็บได้
function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) {
    return null;
  }

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }

  return null;
}

export default function MealDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ดึงข้อมูลสูตรอาหารแบบละเอียด
  const mealQuery = useQuery({
    queryKey: ["meal", id],
    queryFn: () => fetchMeal(id),
    staleTime: 1000 * 60 * 30, // 30 นาที
  });

  const isFavorite = useMealStore((state) => state.favorites.includes(id));
  const toggleFavorite = useMealStore((state) => state.toggleFavorite);

  // กำลังโหลดข้อมูล
  if (mealQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-6 w-32 rounded-md" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="skeleton aspect-4/3 w-full rounded-xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded-md" />
            <div className="skeleton h-5 w-1/3 rounded-md" />
            <div className="skeleton h-10 w-full rounded-lg" />
            <div className="skeleton h-40 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // โหลดข้อมูลผิดพลาด
  if (mealQuery.isError) {
    return (
      <ErrorBox
        error={mealQuery.error}
        onRetry={() => mealQuery.refetch()}
      />
    );
  }

  const meal = mealQuery.data;

  // ไม่พบข้อมูลสูตรอาหาร
  if (!meal) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CookingPot className="size-12 mb-3 text-gray-400" aria-hidden="true" />
        <h2 className="text-xl font-bold text-gray-800">ไม่พบข้อมูลสูตรอาหารนี้</h2>
        <p className="mt-1 text-xs text-gray-500">
          อาจถูกลบหรือระบุรหัสสูตรอาหารไม่ถูกต้อง
        </p>
        <Link
          to="/"
          className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white mt-4 rounded-lg border-none"
        >
          กลับสู่หน้าหลัก
        </Link>
      </div>
    );
  }

  const ingredients = getIngredients(meal);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(meal.strYoutube);

  // แยกข้อความวิธีทำออกเป็นย่อหน้าให้อ่านง่าย
  const instructionParagraphs = (meal.strInstructions || "")
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  const favoriteButtonClass = isFavorite
    ? "bg-red-500 text-white hover:bg-red-600 border-red-500"
    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-red-500";

  return (
    <article className="space-y-6">
      {/* เมนูนำทางและ Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-1 text-gray-600 hover:text-gray-900 rounded-lg"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>ย้อนกลับ</span>
        </button>

        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-emerald-600">
            หน้าแรก
          </Link>
          {meal.strCategory && (
            <>
              <span>/</span>
              <span>{meal.strCategory}</span>
            </>
          )}
          <span>/</span>
          <span className="font-semibold text-gray-800 truncate max-w-[160px] sm:max-w-xs">
            {meal.strMeal}
          </span>
        </div>
      </div>

      {/* ส่วนหัวของสูตรอาหาร (รูปภาพ และ กล่องจัดการ) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* คอลัมน์ซ้าย: รูปภาพและปุ่มแอ็กชัน */}
        <div className="space-y-4 lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="aspect-square sm:aspect-4/3 lg:aspect-square w-full object-cover"
            />
          </div>

          <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            {/* ปุ่มบันทึกรายการโปรด */}
            <button
              type="button"
              onClick={() => toggleFavorite(id)}
              className={`btn w-full rounded-lg gap-2 font-medium transition-colors ${favoriteButtonClass}`}
            >
              <Heart
                className="size-4"
                fill={isFavorite ? "currentColor" : "none"}
                aria-hidden="true"
              />
              <span>
                {isFavorite ? "บันทึกในสูตรโปรดแล้ว" : "บันทึกเป็นสูตรโปรด"}
              </span>
            </button>

            {/* ลิงก์ภายนอก: YouTube และ เว็บไซต์ต้นฉบับ */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              {meal.strYoutube && (
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm flex-1 rounded-lg gap-1.5 border-red-300 text-red-600 hover:bg-red-500 hover:text-white"
                >
                  <Play className="size-3.5" fill="currentColor" aria-hidden="true" />
                  <span>YouTube</span>
                </a>
              )}

              {meal.strSource && (
                <a
                  href={meal.strSource}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm flex-1 rounded-lg gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span>เว็บต้นฉบับ</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* คอลัมน์ขวา: ข้อมูลหมวดหมู่ ชื่ออาหาร และ เช็คลิสต์ส่วนผสม */}
        <div className="space-y-5 lg:col-span-7">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {meal.strCategory && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 font-medium">
                  <Tag className="size-3" aria-hidden="true" />
                  <span>{meal.strCategory}</span>
                </span>
              )}
              {meal.strArea && (
                <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 text-gray-700 text-xs px-2.5 py-1 font-medium">
                  <Globe className="size-3" aria-hidden="true" />
                  <span>สไตล์ {meal.strArea}</span>
                </span>
              )}
              {meal.strTags &&
                meal.strTags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-gray-100 text-gray-600 text-xs px-2 py-0.5"
                  >
                    #{tag.trim()}
                  </span>
                ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {meal.strMeal}
            </h1>
          </div>

          {/* รายการส่วนผสมและเครื่องปรุง */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="size-4 text-emerald-600" aria-hidden="true" />
                <span>
                  ส่วนผสมและเครื่องปรุง ({ingredients.length} อย่าง)
                </span>
              </h2>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient.name}
                  className="flex items-center justify-between gap-2 rounded-lg p-2.5 bg-gray-50 border border-gray-200 text-gray-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium truncate">
                      {ingredient.name}
                    </span>
                  </div>

                  {ingredient.measure && (
                    <span className="shrink-0 rounded bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 border border-gray-200">
                      {ingredient.measure}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ขั้นตอนการทำอาหาร */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <ChefHat className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              ขั้นตอนและวิธีทำ
            </h2>
            <p className="text-xs text-gray-500">
              ปฏิบัติตามขั้นตอนเพื่อทำเมนูนี้
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-gray-700 leading-relaxed text-sm">
          {instructionParagraphs.map((paragraph, index) => (
            <div key={index} className="flex gap-3 items-start">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs mt-0.5">
                {index + 1}
              </span>
              <p className="flex-1 whitespace-pre-line">{paragraph}</p>
            </div>
          ))}
        </div>
      </section>

      {/* วิดีโอสอนทำอาหารจาก YouTube */}
      {youtubeEmbedUrl && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-base text-gray-900">
            <Play className="size-4 text-red-600" fill="currentColor" aria-hidden="true" />
            <span>วิดีโอสาธิตวิธีทำจาก YouTube</span>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
            <iframe
              src={youtubeEmbedUrl}
              title={`วิดีโอวิธีทำ ${meal.strMeal}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </section>
      )}
    </article>
  );
}
