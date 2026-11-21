"use client";

import { useActionState, useEffect, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { Category, type TransactionType } from "@/generated/prisma/enums";
import { formatVND } from "@/lib/finance";
import { deleteTransaction, updateTransaction } from "./actions";

export type TransactionItemData = {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
  dateISO: string;
};

export function TransactionItems({ rows }: { rows: TransactionItemData[] }) {
  const [optimisticRows, removeOptimistic] = useOptimistic(
    rows,
    (current, deletedId: string) => current.filter((r) => r.id !== deletedId),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleDelete(id: string, description: string) {
    if (!window.confirm(`Bạn có chắc muốn xoá "${description}"?`)) return;
    startTransition(async () => {
      removeOptimistic(id);
      const fd = new FormData();
      fd.set("id", id);
      const res = await deleteTransaction(fd);
      if (res.ok) {
        toast.success(res.message ?? "Đã xoá giao dịch");
      } else {
        toast.error(res.message ?? "Không thể xoá giao dịch");
      }
    });
  }

  return (
    <ul className="grid gap-2">
      {optimisticRows.map((t) => (
        <li key={t.id} className="rounded border p-3">
          {editingId === t.id ? (
            <EditTransactionRow
              item={t}
              onClose={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-medium">{t.description}</span>:{" "}
                <span className={t.type === "INCOME" ? "text-green-600" : "text-red-600"}>
                  {t.type === "INCOME" ? "+" : "-"}
                  {formatVND(t.amount)}
                </span>{" "}
                <span className="text-xs text-zinc-500">
                  ({t.category} · {t.dateISO})
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(t.id)}
                  className="text-xs"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id, t.description)}
                  className="text-xs text-red-600"
                >
                  Xoá
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function EditTransactionRow({
  item,
  onClose,
}: {
  item: TransactionItemData;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateTransaction, {});
  const { values: v = {}, errors: err = {} } = state;

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? "Đã cập nhật giao dịch");
      onClose();
    } else if (state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="id" value={item.id} />
      <select
        name="type"
        aria-label="Loại"
        defaultValue={v.type ?? item.type}
      >
        <option value="EXPENSE">Chi</option>
        <option value="INCOME">Thu</option>
      </select>
      <input
        name="amount"
        placeholder="Số tiền (VND)"
        defaultValue={v.amount ?? String(item.amount)}
      />
      <Err msg={err.amount} />
      <input
        name="description"
        placeholder="Mô tả"
        defaultValue={v.description ?? item.description}
      />
      <Err msg={err.description} />
      <select
        name="category"
        aria-label="Danh mục"
        defaultValue={v.category ?? item.category}
      >
        {Object.values(Category).map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        name="date"
        type="date"
        aria-label="Ngày"
        defaultValue={v.date ?? item.dateISO}
      />
      <Err msg={err.date} />
      <div className="flex gap-2">
        <button type="submit" disabled={pending}>
          Lưu
        </button>
        <button type="button" onClick={onClose}>
          Huỷ
        </button>
      </div>
    </form>
  );
}

const Err = ({ msg }: { msg?: string[] }) =>
  msg && <p role="alert" className="text-red-600">{msg[0]}</p>;
