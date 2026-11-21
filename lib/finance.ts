import type { Filters } from "@/lib/validation";

const vnd = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatVND(amount: number) {
  return vnd.format(amount);
}

export function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// Hàm thuần: trả về { gte, lt } cho where.date
export function getDateRange(
  range: Filters["range"],
  now = new Date(),
) {
  if (range === "all") return undefined;
  const back = range === "last-month" ? 1 : 0;
  const y = now.getFullYear();
  const m = now.getMonth() - back; // 0 - 1 → tháng 12
  return {
    gte: new Date(y, m, 1), // ngày 1 của tháng
    lt: new Date(y, m + 1, 1), // ngày 1 tháng sau
  };
}

// Hàm thuần: không đọc DB, không gọi mạng
export function wishlistProgress(
  balance: number, cost: number,
): number {
  if (cost <= 0) return 100;
  const percent =
    Math.floor((balance / cost) * 100);
  return Math.min(100, Math.max(0, percent));
}

export const MILESTONES = [50, 75, 100] as const;

export function crossedMilestones(
  prev: number, next: number,
): number[] {
  return MILESTONES.filter(
    (m) => prev < m && next >= m);
}

export type BalanceRow = {
  type: "INCOME" | "EXPENSE";
  amount: number;
};

// Hàm thuần tính số dư = tổng INCOME - tổng EXPENSE
export function calculateBalance(rows: readonly BalanceRow[]): number {
  return rows.reduce(
    (sum, r) => (r.type === "INCOME" ? sum + r.amount : sum - r.amount),
    0,
  );
}

export type SpendingRow = {
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
};

// Hàm thuần gom tổng chi tiêu (EXPENSE) theo từng category
export function spendingByCategory(
  rows: readonly SpendingRow[],
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const r of rows) {
    if (r.type !== "EXPENSE" || r.amount <= 0) continue;
    totals[r.category] = (totals[r.category] ?? 0) + r.amount;
  }
  return totals;
}
