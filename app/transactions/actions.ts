"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  readValues, transactionSchema, type FormState,
} from "@/lib/validation";

const idSchema = z.string().trim().min(1, { error: "Thiếu mã giao dịch" });

export async function createTransaction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = readValues(formData);
  const parsed = transactionSchema.safeParse(values);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return { errors: flat.fieldErrors, values };
  }

  const demo = await prisma.user.findFirstOrThrow({
    where: { email: "demo@phy10615.vn" },
  });
  await prisma.transaction.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date), 
      userId: demo.id,
    },
  });
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { ok: true, message: "Đã thêm giao dịch" };
}

export async function updateTransaction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const idParsed = idSchema.safeParse(formData.get("id"));
  const values = readValues(formData);
  if (!idParsed.success) {
    return { ok: false, message: "Mã giao dịch không hợp lệ", values };
  }
  const parsed = transactionSchema.safeParse(values);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return { errors: flat.fieldErrors, values };
  }

  const demo = await prisma.user.findFirstOrThrow({
    where: { email: "demo@phy10615.vn" },
  });
  const res = await prisma.transaction.updateMany({
    where: { id: idParsed.data, userId: demo.id },
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });
  if (res.count === 0) {
    return { ok: false, message: "Không tìm thấy giao dịch", values };
  }
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { ok: true, message: "Đã cập nhật giao dịch" };
}

export async function deleteTransaction(
  formData: FormData,
): Promise<FormState> {
  const idParsed = idSchema.safeParse(formData.get("id"));
  if (!idParsed.success) {
    return { ok: false, message: "Mã giao dịch không hợp lệ" };
  }

  const demo = await prisma.user.findFirstOrThrow({
    where: { email: "demo@phy10615.vn" },
  });
  const res = await prisma.transaction.deleteMany({
    where: { id: idParsed.data, userId: demo.id },
  });
  if (res.count === 0) {
    return { ok: false, message: "Không tìm thấy giao dịch" };
  }
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { ok: true, message: "Đã xoá giao dịch" };
}
