import { getFilterInfo } from "@/lib/server-only";
import z from "zod";

export type FilterInfo = Awaited<ReturnType<typeof getFilterInfo>>;

export const filtersSchema = z.object({
  rentMin: z.coerce.number({ message: "Invalid number" }).min(0).optional(),
  rentMax: z.coerce.number({ message: "Invalid number" }).min(0).optional(),
  beds: z
    .union([z.coerce.number().optional(), z.coerce.number().array()])
    .optional(),
  baths: z
    .union([z.coerce.number().optional(), z.coerce.number().array()])
    .optional(),
  depMin: z.coerce.number({ message: "Invalid number" }).min(0).optional(),
  depMax: z.coerce.number({ message: "Invalid number" }).min(0).optional(),
  sqMin: z.coerce.number({ message: "Invalid number" }).min(0).optional(),
  sqMax: z.coerce.number({ message: "Invalid number" }).min(0).optional(),
  cities: z.union([z.string().optional(), z.string().array()]).optional(),
  owners: z
    .union([z.coerce.number().optional(), z.coerce.number().array()])
    .optional(),
  cats: z.coerce.boolean().optional(),
  dogs: z.coerce.boolean().optional(),
});

export const defaultFilters: FiltersSchema = {
  rentMin: undefined,
  rentMax: undefined,
  beds: undefined,
  baths: undefined,
  depMin: undefined,
  depMax: undefined,
  sqMin: undefined,
  sqMax: undefined,
  cities: undefined,
  owners: undefined,
  cats: undefined,
  dogs: undefined,
};

export type FiltersSchema = z.infer<typeof filtersSchema>;
