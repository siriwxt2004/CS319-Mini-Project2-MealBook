import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login } from "../api";
import { useAuthStore } from "../store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: () => login(email.trim(), password),
    onSuccess: (user) => {
      setUser(user);
      navigate("/collection");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  return (
    <section className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
      <p className="mt-2 text-sm text-gray-600">
        ใช้อีเมลและรหัสผ่านเพื่อเปิดคอลเลกชันส่วนตัว
        หากเป็นอีเมลใหม่ ระบบจะสร้างบัญชีให้โดยอัตโนมัติ
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">อีเมล</span>
          <input
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="input input-bordered w-full"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-medium">รหัสผ่าน</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
            className="input input-bordered w-full"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {loginMutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            {loginMutation.error.message}
          </p>
        )}

        <button
          type="submit"
          className="btn w-full border-none bg-emerald-600 text-white hover:bg-emerald-700"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        </button>
      </form>

      <p className="mt-4 text-xs leading-relaxed text-gray-500">
        ระบบตัวอย่างสำหรับการศึกษาเท่านั้น รหัสผ่านเก็บแบบไม่เข้ารหัส
        ห้ามใช้รหัสผ่านจริงหรือรหัสผ่านที่ใช้กับบริการอื่น
      </p>
    </section>
  );
}
