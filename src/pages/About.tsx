import {
  Atom,
  CookingPot,
  Database,
  Globe,
  GraduationCap,
  Palette,
  RefreshCw,
  Route,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { members } from "../data/members";

interface TechItem {
  name: string;
  desc: string;
  Icon: LucideIcon;
}

const TECH_STACK: TechItem[] = [
  { name: "React 19", desc: "UI Library", Icon: Atom },
  { name: "Vite 6", desc: "Build Tool", Icon: Zap },
  { name: "Tailwind CSS v4", desc: "Styling Framework", Icon: Palette },
  { name: "daisyUI 5", desc: "Component Library", Icon: Sparkles },
  { name: "TanStack Query 5", desc: "Data Fetching & Cache", Icon: RefreshCw },
  { name: "Zustand 5", desc: "State Management", Icon: Database },
  { name: "React Router 7", desc: "Routing", Icon: Route },
  { name: "TheMealDB API", desc: "Food Database", Icon: CookingPot },
];

export default function About() {
  return (
    <div className="space-y-6">
      {/* ส่วนหัวแนะนำโครงงาน */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
          <GraduationCap className="size-3.5" aria-hidden="true" />
          <span>Mini Project 2</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          ผู้จัดทำ
        </h1>
        {/* รายชื่อสมาชิกกลุ่มผู้พัฒนา */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Users className="size-4 text-emerald-600" aria-hidden="true" />
          <span>สมาชิกในกลุ่มผู้พัฒนา</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div
              key={member.studentId + index}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-xs space-y-3"
            >
              {/* รูปภาพโปรไฟล์หรือตัวอักษรย่อ */}
              <div>
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="size-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-2xl font-bold border-2 border-gray-200">
                    {member.nickname.slice(0, 1)}
                  </div>
                )}
              </div>

              {/* รายละเอียดสมาชิก */}
              <div className="space-y-1 w-full">
                <h3 className="text-base font-bold text-gray-900">
                  {member.name}
                </h3>
                <span className="inline-block rounded-full bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 font-medium">
                  ชื่อเล่น: {member.nickname}
                </span>

                <div className="text-xs font-mono text-gray-500 pt-1">
                  รหัสนักศึกษา:{" "}
                  <span className="font-semibold text-gray-800">
                    {member.studentId}
                  </span>
                </div>

                <div className="mt-2 rounded-lg bg-gray-50 border border-gray-100 p-2 text-xs text-gray-600">
                  {member.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>

      

      {/* ส่วนแสดงเทคโนโลยีที่ใช้พัฒนา (Tech Stack) */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Wrench className="size-4 text-emerald-600" aria-hidden="true" />
          <span>เทคโนโลยีที่ใช้พัฒนา (Tech Stack)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TECH_STACK.map((techItem) => {
            const ItemIcon = techItem.Icon;
            return (
              <div
                key={techItem.name}
                className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 p-2.5"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white text-emerald-700 border border-gray-200">
                  <ItemIcon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {techItem.name}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {techItem.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ส่วนอ้างอิงแหล่งที่มาของข้อมูล (API Attribution) */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-2 text-xs text-gray-600">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Globe className="size-4 text-emerald-600" aria-hidden="true" />
          <span>แหล่งที่มาของข้อมูล</span>
        </h2>
        <p className="leading-relaxed">
          ข้อมูลสูตรอาหารจาก{" "}
          <a
            href="https://www.themealdb.com"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-600 hover:underline font-medium"
          >
            TheMealDB
          </a>{" "}
          
          <a
            href="https://www.themealdb.com/api.php"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-600 hover:underline font-medium"
          >
            TheMealDB API Documentation
          </a>
          )
        </p>
        <p className="text-gray-400">
          ไอคอนจาก{" "}
          <a
            href="https://lucide.dev"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Lucide Icons
          </a>
        </p>
      </section>
    </div>
  );
}
