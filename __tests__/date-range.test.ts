import { describe, expect, test } from "vitest";
import { getDateRange } from "@/lib/finance";

describe("getDateRange", () => {
  test("range = all trả về undefined", () => {
    expect(getDateRange("all", new Date(2026, 10, 17))).toBeUndefined();
  });

  test("this-month trả về 0h ngày 1 tháng này tới 0h ngày 1 tháng sau", () => {
    const res = getDateRange("this-month", new Date(2026, 7, 15, 14, 30));
    expect(res).toEqual({
      gte: new Date(2026, 7, 1),
      lt: new Date(2026, 8, 1),
    });
  });

  test("last-month trả về tháng trước trong cùng năm", () => {
    const res = getDateRange("last-month", new Date(2026, 7, 15));
    expect(res).toEqual({
      gte: new Date(2026, 6, 1),
      lt: new Date(2026, 7, 1),
    });
  });

  test("last-month khi now là tháng 1 tự lùi về tháng 12 năm trước", () => {
    const res = getDateRange("last-month", new Date(2027, 0, 10));
    expect(res).toEqual({
      gte: new Date(2026, 11, 1),
      lt: new Date(2027, 0, 1),
    });
  });
});
