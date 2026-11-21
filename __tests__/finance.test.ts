import { describe, expect, test } from "vitest";
import {
  calculateBalance,
  crossedMilestones,
  spendingByCategory,
  wishlistProgress,
} from "@/lib/finance";

describe("wishlistProgress", () => {
  test("tính % và làm tròn xuống", () => {
    expect(
      wishlistProgress(2_999_999, 4_000_000),
    ).toBe(74);
  });

  test("luôn nằm trong 0..100", () => {
    expect(wishlistProgress(-500_000, 1_000_000))
      .toBe(0);
    expect(wishlistProgress(9_000_000, 1_000_000))
      .toBe(100);
  });

  test("cost <= 0 trả về 100", () => {
    expect(wishlistProgress(500_000, 0)).toBe(100);
    expect(wishlistProgress(0, -100)).toBe(100);
  });
});

describe("crossedMilestones", () => {
  test("vượt qua nhiều mốc cùng lúc", () => {
    expect(crossedMilestones(40, 80)).toEqual([50, 75]);
  });

  test("không vượt mốc nào hoặc giảm tiến độ", () => {
    expect(crossedMilestones(50, 74)).toEqual([]);
    expect(crossedMilestones(80, 60)).toEqual([]);
  });
});

describe("calculateBalance", () => {
  test("tổng thu trừ tổng chi", () => {
    expect(
      calculateBalance([
        { type: "INCOME", amount: 15_000_000 },
        { type: "EXPENSE", amount: 3_500_000 },
        { type: "EXPENSE", amount: 500_000 },
      ]),
    ).toBe(11_000_000);
  });

  test("ca biên: danh sách rỗng trả về 0, chi lớn hơn thu trả về số âm", () => {
    expect(calculateBalance([])).toBe(0);
    expect(
      calculateBalance([
        { type: "INCOME", amount: 1_000_000 },
        { type: "EXPENSE", amount: 2_500_000 },
      ]),
    ).toBe(-1_500_000);
  });
});

describe("spendingByCategory", () => {
  test("gom nhóm tổng chi theo danh mục và bỏ qua khoản thu", () => {
    expect(
      spendingByCategory([
        { type: "INCOME", category: "SALARY", amount: 15_000_000 },
        { type: "EXPENSE", category: "FOOD", amount: 65_000 },
        { type: "EXPENSE", category: "FOOD", amount: 45_000 },
        { type: "EXPENSE", category: "TRANSPORT", amount: 80_000 },
      ]),
    ).toEqual({
      FOOD: 110_000,
      TRANSPORT: 80_000,
    });
  });

  test("ca biên: danh sách rỗng hoặc chỉ có khoản thu trả về object rỗng", () => {
    expect(spendingByCategory([])).toEqual({});
    expect(
      spendingByCategory([
        { type: "INCOME", category: "SALARY", amount: 10_000_000 },
      ]),
    ).toEqual({});
  });
});
