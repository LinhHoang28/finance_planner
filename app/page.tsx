import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Finance Planner</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Ứng dụng quản lý thu chi cá nhân (Tuần 08 &amp; Tuần 09)
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard"
          className="rounded-lg border p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          <h2 className="text-lg font-semibold">Dashboard →</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tổng thu, tổng chi, số dư và chi tiêu theo danh mục (Tuần 08)
          </p>
        </Link>

        <Link
          href="/transactions"
          className="rounded-lg border p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          <h2 className="text-lg font-semibold">Giao dịch →</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Thêm / sửa / xoá giao dịch và lọc theo URL (Tuần 09)
          </p>
        </Link>
      </div>
    </main>
  );
}
