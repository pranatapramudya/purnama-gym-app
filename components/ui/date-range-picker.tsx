"use client";

import * as React from "react";
import { format, subDays, startOfMonth, startOfToday, startOfYear } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fromParam ? new Date(fromParam) : undefined,
    to: toParam ? new Date(toParam) : undefined,
  });
  
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setDate({
      from: fromParam ? new Date(fromParam) : undefined,
      to: toParam ? new Date(toParam) : undefined,
    });
  }, [fromParam, toParam]);

  const applyFilter = (from: Date, to: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", format(from, "yyyy-MM-dd"));
    params.set("to", format(to, "yyyy-MM-dd"));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      applyFilter(newDate.from, newDate.to);
      setIsOpen(false);
    }
  };
  
  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    router.push(`${pathname}?${params.toString()}`);
  };

  const presets = [
    {
      label: "Hari Ini",
      onClick: () => {
        const today = startOfToday();
        setDate({ from: today, to: today });
        applyFilter(today, today);
        setIsOpen(false);
      },
    },
    {
      label: "7 Hari Terakhir",
      onClick: () => {
        const to = startOfToday();
        const from = subDays(to, 6);
        setDate({ from, to });
        applyFilter(from, to);
        setIsOpen(false);
      },
    },
    {
      label: "Bulan Ini",
      onClick: () => {
        const to = startOfToday();
        const from = startOfMonth(to);
        setDate({ from, to });
        applyFilter(from, to);
        setIsOpen(false);
      },
    },
    {
      label: "Semua Waktu",
      onClick: () => {
        setDate(undefined);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("from");
        params.delete("to");
        router.push(`${pathname}?${params.toString()}`);
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[320px] justify-start text-left font-normal bg-white border-slate-200 shadow-sm transition-all",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
            <div className="flex-1 truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd MMM yyyy", { locale: id })} -{" "}
                    {format(date.to, "dd MMM yyyy", { locale: id })}
                  </>
                ) : (
                  format(date.from, "dd MMM yyyy", { locale: id })
                )
              ) : (
                <span>Pilih Rentang Tanggal</span>
              )}
            </div>
            {(date?.from || date?.to) && (
               <div 
                 onClick={clearFilter}
                 className="ml-2 flex h-5 w-5 items-center justify-center rounded-full hover:bg-slate-100 shrink-0"
               >
                 <X className="h-3 w-3 text-slate-500" />
               </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] sm:w-auto max-h-[80vh] overflow-y-auto p-0 flex flex-col sm:flex-row" align="end">
          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-1 p-3 border-b sm:border-b-0 sm:border-r border-border sm:min-w-[150px] bg-slate-50/50">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                className="justify-start text-sm hover:bg-emerald-50 hover:text-emerald-700"
                onClick={preset.onClick}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="p-3 bg-white">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              locale={id}
              className="hidden sm:block"
            />
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={1}
              locale={id}
              className="block sm:hidden"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
