import { clsx, type ClassValue } from "clsx";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { SearchParams } from "next/dist/server/request/search-params";
import { twMerge } from "tailwind-merge";
import { unknown } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Satisfies<Constraint, Target extends Constraint> = Target;

type TryCatchResult<T> = Promise<
  | {
      success: true;
      data: T;
      error: undefined;
    }
  | {
      success: false;
      data: undefined;
      error: string;
    }
>;

// export const tryCatch = async <T>(
//   cb: () => T | Promise<T>,
// ): TryCatchResult<T> => {
//   try {
//     const maybePromise = cb();
//     const data =
//       maybePromise instanceof Promise ? await maybePromise : maybePromise;
//     return { success: true, data };
//   } catch (e) {
//     if (isRedirectError(e)) throw e;
//     const error =
//       e instanceof Error
//         ? e.message
//         : typeof e === "string"
//           ? e
//           : e?.toString
//             ? e.toString()
//             : "Unknown error";
//     return { success: false, error };
//   }
// };

export const tryCatch = async <T>(
  toTry: Promise<T> | (() => Promise<T> | T),
): TryCatchResult<T> => {
  try {
    const data = typeof toTry === "function" ? await toTry() : await toTry;
    return { success: true, data, error: undefined };
  } catch (e) {
    if (isRedirectError(e)) throw e;
    const error =
      e instanceof Error
        ? e.message
        : typeof e === "string"
          ? e
          : e?.toString
            ? e.toString()
            : "Unknown error";
    return { success: false, data: undefined, error };
  }
};

export const toNumberNotNaN = (x: unknown, fallback: number) => {
  const num = Number(x);
  if (Number.isNaN(num)) return fallback;
  return num;
};

export const clamp = (
  num: number,
  { min, max, inclusive }: { min: number; max: number; inclusive: boolean },
) => {
  if (num < min) {
    return inclusive ? min : min + 1;
  }
  if (num > max) {
    return inclusive ? max : max - 1;
  }
  return num;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const stripFalseyish = <T extends Record<string, unknown>>(obj: T) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!value) return acc;
    const num = Number(value);
    if (!Number.isNaN(num) && num === 0) return acc;
    if (typeof value === "string" && value.toLowerCase().trim() === "false")
      return acc;
    return { ...acc, [key]: value };
  }, {} as T);
};

export const parseSearchParams = (sp: SearchParams) => {
  return Object.entries(sp).reduce(
    (obj, [key, value]) => {
      if (!value) return obj;
      if (Array.isArray(value)) {
        return { ...obj, [key]: value };
      }
      const arr = value.split(",");
      if (arr.length > 1) {
        return { ...obj, [key]: arr };
      }
      return { ...obj, [key]: value };
    },
    {} as Record<string, string | string[]>,
  );
};

export const toArray = <T>(x: T | T[] | undefined | null) => {
  if (x === undefined || x === null) return [];
  return Array.isArray(x) ? x : [x];
};
