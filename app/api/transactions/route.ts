import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDateRange } from "@/lib/finance";
import { transactionFilterSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const rawParams = Object.fromEntries(request.nextUrl.searchParams);
  const { format, ...filterParams } = rawParams;

  const parsed = transactionFilterSchema.safeParse(filterParams);
  if (!parsed.success) {
    return Response.json(
      { error: "Tham số lọc không hợp lệ" },
      { status: 400 },
    );
  }

  const { range, ...rest } = parsed.data;
  const rows = await prisma.transaction.findMany({
    where: { date: getDateRange(range), ...rest },
    orderBy: { date: "desc" },
  });

  if (format === "csv") {
    const header = "id,date,type,category,amount,description";
    const lines = rows.map((r) => {
      const dateStr = r.date.toISOString().slice(0, 10);
      const escapedDesc = `"${r.description.replace(/"/g, '""')}"`;
      return `${r.id},${dateStr},${r.type},${r.category},${r.amount},${escapedDesc}`;
    });
    const csv = [header, ...lines].join("\n");
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="transactions.csv"',
      },
    });
  }

  return Response.json(rows);
}
