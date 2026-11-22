import { Link } from "react-router";
import { LockKeyhole } from "lucide-react";

export default function LoginPrompt() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <LockKeyhole className="mb-3 size-10 text-emerald-600" aria-hidden="true" />
      <h1 className="text-xl font-bold text-gray-900">เข้าสู่ระบบก่อนใช้งาน</h1>
      <p className="mt-2 text-sm text-gray-600">
        เข้าสู่ระบบด้วยอีเมลเพื่อดูคอลเลกชันและแผนมื้ออาหารส่วนตัว
      </p>
      <Link
        to="/login"
        className="btn mt-5 bg-emerald-600 text-white hover:bg-emerald-700"
      >
        ไปหน้าเข้าสู่ระบบ
      </Link>
    </div>
  );
}
