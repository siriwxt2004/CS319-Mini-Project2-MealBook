import { Link, NavLink, Outlet } from "react-router";
import {
  CalendarDays,
  ChefHat,
  CookingPot,
  Heart,
  Menu,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMealStore } from "../store";

interface NavItem {
  to: string;
  label: string;
  Icon: LucideIcon;
}

// รายการลิงก์สำหรับแถบเมนูหลัก
const NAV_LINKS: NavItem[] = [
  { to: "/", label: "สูตรอาหาร", Icon: CookingPot },
  { to: "/collection", label: "สูตรของฉัน", Icon: Heart },
  { to: "/planner", label: "แผนมื้ออาหาร", Icon: CalendarDays },
  { to: "/about", label: "ผู้พัฒนา", Icon: Users },
];

export default function Layout() {
  const favoriteCount = useMealStore((state) => state.favorites.length);
  const planDaysCount = useMealStore((state) => Object.keys(state.plan).length);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* ส่วนหัวของเว็บ (Navbar) เรียบง่าย สะอาดตา */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* โลโก้เว็บไซต์ */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 transition-colors"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <ChefHat className="size-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
                Meal Book
              </span>
              
            </div>
          </Link>

          {/* เมนูหลักสำหรับหน้าจอคอมพิวเตอร์ (Desktop) */}
          <nav className="hidden items-center gap-1.5 md:flex">
            {NAV_LINKS.map((item) => {
              const isFavoritesPage = item.to === "/collection";
              const isPlannerPage = item.to === "/planner";
              const ItemIcon = item.Icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => {
                    if (isActive) {
                      return "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium bg-emerald-600 text-white shadow-xs";
                    }
                    return "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors";
                  }}
                >
                  <ItemIcon className="size-4" aria-hidden="true" />
                  <span>{item.label}</span>

                  {isFavoritesPage && favoriteCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      {favoriteCount}
                    </span>
                  )}

                  {isPlannerPage && planDaysCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                      {planDaysCount}/7
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* เมนูสำหรับหน้าจอมือถือ (Mobile Dropdown) */}
          <div className="dropdown dropdown-end md:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle btn-sm text-gray-700"
              aria-label="เมนูนำทาง"
            >
              <Menu className="size-5" aria-hidden="true" />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu z-50 mt-2 w-52 rounded-xl bg-white p-2 shadow-lg border border-gray-200"
            >
              {NAV_LINKS.map((item) => {
                const isFavoritesPage = item.to === "/collection";
                const isPlannerPage = item.to === "/planner";
                const ItemIcon = item.Icon;

                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) => {
                        const activeClass = isActive
                          ? "bg-emerald-600 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-100";
                        return `flex items-center justify-between rounded-lg py-2 ${activeClass}`;
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <ItemIcon className="size-4" aria-hidden="true" />
                        <span>{item.label}</span>
                      </span>

                      {isFavoritesPage && favoriteCount > 0 && (
                        <span className="badge badge-sm badge-secondary">
                          {favoriteCount}
                        </span>
                      )}

                      {isPlannerPage && planDaysCount > 0 && (
                        <span className="badge badge-sm badge-accent">
                          {planDaysCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </header>

      {/* พื้นที่แสดงเนื้อหาของแต่ละหน้า */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      {/* ส่วนท้ายของเว็บ (Footer) เรียบง่าย */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6 text-gray-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
              <ChefHat className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Meal Book</p>
              
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
            <Link to="/" className="hover:text-emerald-600 hover:underline">
              สูตรอาหาร
            </Link>
            <span>•</span>
            <Link
              to="/collection"
              className="hover:text-emerald-600 hover:underline"
            >
              สูตรของฉัน
            </Link>
            <span>•</span>
            <Link
              to="/planner"
              className="hover:text-emerald-600 hover:underline"
            >
              แผนมื้ออาหาร
            </Link>
            <span>•</span>
            <Link to="/about" className="hover:text-emerald-600 hover:underline">
              ผู้พัฒนา
            </Link>
          </div>

          <div className="text-center sm:text-right text-gray-500">
            <p>
              ข้อมูลสูตรอาหารจาก{" "}
              <a
                href="https://www.themealdb.com"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 hover:underline font-medium"
              >
                TheMealDB
              </a>
            </p>
            <p className="mt-0.5">
              Mini Project 2 • CS319
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
