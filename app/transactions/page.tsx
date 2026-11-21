import { prisma } from "@/lib/prisma";
import { getDateRange } from "@/lib/finance";
import { transactionFilterSchema } from "@/lib/validation";
import { TransactionForm } from "./transaction-form";
import { TransactionFilters } from "./transaction-filters";
import { TransactionItems } from "./transaction-items";

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/transactions">) {
  const filter = transactionFilterSchema
    .catch({ range: "this-month" })
    .parse(await searchParams);
  const rows = await prisma.transaction.findMany({
    where: {
      date: getDateRange(filter.range),
      type: filter.type,
      category: filter.category,
    },
    orderBy: { date: "desc" },
  });
  const items = rows.map((t) => ({
    id: t.id,
    type: t.type,
    amount: t.amount,
    description: t.description,
    category: t.category,
    dateISO: t.date.toISOString().slice(0, 10),
  }));
  return (
    <main className="grid max-w-md gap-4 p-8">
      <TransactionForm />
      <TransactionFilters {...filter} />
      <p>{rows.length} giao dịch</p>
      <TransactionItems rows={items} />
    </main>
  );
}
