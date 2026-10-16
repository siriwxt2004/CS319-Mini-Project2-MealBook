import { AlertTriangle } from "lucide-react";

interface GridSkeletonProps {
  count?: number;
}

// Skeleton จำลองระหว่างรอโหลดข้อมูลการ์ดสูตรอาหาร
export function GridSkeleton({ count = 12 }: GridSkeletonProps) {
  const skeletonItems = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {skeletonItems.map((itemIndex) => (
        <div
          key={itemIndex}
          className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"
        >
          <div className="skeleton aspect-4/3 w-full" />
          <div className="space-y-2 p-3.5">
            <div className="skeleton h-4 w-5/6 rounded-md" />
            <div className="skeleton h-3 w-1/2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ErrorBoxProps {
  error: unknown;
  onRetry: () => void;
}

// กล่องแจ้งเตือนเมื่อเกิดข้อผิดพลาดในการโหลดข้อมูล
export function ErrorBox({ error, onRetry }: ErrorBoxProps) {
  let errorMessage = "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div
      role="alert"
      className="flex flex-col items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-gray-800 sm:flex-row sm:items-center shadow-xs"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
          <AlertTriangle className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h4 className="font-semibold text-sm text-red-800">
            เกิดข้อผิดพลาดในการโหลดข้อมูล
          </h4>
          <p className="text-xs text-red-600">{errorMessage}</p>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-xs bg-red-600 hover:bg-red-700 text-white rounded-md px-3 font-medium border-none"
        onClick={onRetry}
      >
        ลองใหม่อีกครั้ง
      </button>
    </div>
  );
}
