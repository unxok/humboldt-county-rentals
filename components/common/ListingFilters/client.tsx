"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { LinkPath } from "@/lib/routing";
import { PAGE_SEARCH_PARAM } from "@/lib/constants";
import { toast } from "sonner";
import { FilterInfo, filtersSchema, FiltersSchema } from "./shared";
import { MultiSelectPills } from "@/components/common/MultiSelectPills";
import { stripFalseyish } from "@/lib/utils";
import { FiltersPresentational } from ".";

export const Filters = ({
  appliedFilters,
  filterInfo,
  pageNumber,
}: {
  appliedFilters: FiltersSchema;
  filterInfo: FilterInfo;
  pageNumber: number;
}) => {
  const router = useRouter();
  const form = useForm<FiltersSchema>({
    resolver: zodResolver(filtersSchema),
    defaultValues: { ...appliedFilters },
    mode: "all",
  });

  return (
    <FiltersPresentational
      filtersCount={(() => {
        const count = Object.values(appliedFilters).filter(
          (v) => v !== undefined,
        ).length;
        if (!count) return null;
        return (
          <span className="text-secondary-foreground bg-secondary rounded-xl border px-3 py-1 text-xs">
            {count}
          </span>
        );
      })()}
      collapsibleContent={
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                console.log(data);
                const usp = new URLSearchParams({
                  [PAGE_SEARCH_PARAM]: pageNumber.toString(),
                });
                const stripped = stripFalseyish(data);
                Object.entries(stripped).forEach(([key, value]) => {
                  if (value === undefined) return;
                  if (Array.isArray(value)) {
                    return value.forEach((v) => usp.append(key, v.toString()));
                  }
                  usp.append(key, value.toString());
                });

                router.push(`/rentals?${usp.toString()}` satisfies LinkPath);
              },
              (errors) => {
                toast.error("Form error!");
                console.error(errors);
              },
            )}
            className="w-full space-y-4 px-1 pt-4"
          >
            <fieldset className="flex max-w-[60ch] items-start gap-4">
              <legend className="sr-only">Rent</legend>
              <FormField
                control={form.control}
                name="rentMin"
                render={({ field: { value, ...field } }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Rent Min</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        value={value ?? ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rentMax"
                render={({ field: { value, ...field } }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Rent Max</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        value={value ?? ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <fieldset className="flex max-w-[60ch] items-start gap-4">
              <legend className="sr-only">Deposit</legend>
              <FormField
                control={form.control}
                name="depMin"
                render={({ field: { value, ...field } }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Deposit Min</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        value={value ?? ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depMax"
                render={({ field: { value, ...field } }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Deposit Max</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        value={value ?? ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <fieldset className="flex max-w-[60ch] items-start gap-4">
              <legend className="sr-only">Square feet</legend>
              <FormField
                control={form.control}
                name="sqMin"
                render={({ field: { value, ...field } }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Sq Ft Min</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        value={value ?? ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sqMax"
                render={({ field: { value, ...field } }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Sq Ft Max</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        value={value ?? ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <fieldset className="flex max-w-[60ch] items-start gap-4">
              <FormLabel asChild>
                <legend className="pb-3">Pets</legend>
              </FormLabel>
              <FormField
                control={form.control}
                name="cats"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={!!value}
                        onCheckedChange={onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormLabel>Cats</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dogs"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={!!value}
                        onCheckedChange={onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormLabel>Dogs</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <FormField
              control={form.control}
              name="beds"
              render={({ field: { value } }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <MultiSelectPills
                      value={value ?? []}
                      setValue={(cb) => {
                        form.setValue("beds", cb(value ?? []));
                      }}
                      options={
                        filterInfo.bedrooms.map((n) => ({
                          label: n.toString(),
                          value: n,
                        })) ?? []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baths"
              render={({ field: { value } }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <MultiSelectPills
                      value={value ?? []}
                      setValue={(cb) => {
                        form.setValue("baths", cb(value ?? []));
                      }}
                      options={
                        filterInfo.bathrooms.map((n) => ({
                          label: n.toString(),
                          value: n,
                        })) ?? []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cities"
              render={({ field: { value } }) => (
                <FormItem>
                  <FormLabel>Cities</FormLabel>
                  <FormControl>
                    <MultiSelectPills
                      value={value ?? []}
                      setValue={(cb) => {
                        form.setValue("cities", cb(value ?? []));
                      }}
                      options={
                        filterInfo.cities.map((n) => ({
                          label: n,
                          value: n,
                        })) ?? []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owners"
              render={({ field: { value } }) => (
                <FormItem>
                  <FormLabel>Property Owners</FormLabel>
                  <FormControl>
                    <MultiSelectPills
                      value={value ?? []}
                      setValue={(cb) => {
                        form.setValue("owners", cb(value ?? []));
                      }}
                      options={
                        filterInfo.owner_ids.map((n, i) => ({
                          label: filterInfo.owner_names[i],
                          value: n,
                        })) ?? []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-auto flex w-fit gap-1">
              <Button
                variant={"ghost"}
                type="button"
                onClick={() => {
                  // why doesn't this work?
                  // form.reset();

                  router.push(`?${PAGE_SEARCH_PARAM}=${pageNumber}`);
                }}
              >
                clear all
              </Button>
              <Button type="submit">apply</Button>
            </div>
          </form>
        </Form>
      }
      isDisabled={false}
    />
  );
};
