import React, { useMemo, useState, useCallback } from "react";
import { Transaction } from "@/types/transaction";
import {
  format,
  subDays,
  addDays,
  startOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  subWeeks,
  addWeeks,
  subMonths,
  addMonths,
  subYears,
  addYears,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, TrendingDown, TrendingUp } from "lucide-react";

interface SpendingHeatmapProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

type ViewMode = "week" | "month" | "year";

// Build an expense lookup map from transactions (yyyy-MM-dd -> total)
function buildExpenseMap(transactions: Transaction[]): Record<string, number> {
  const map: Record<string, number> = {};
  transactions.forEach((tx) => {
    if (tx.type === "EXPENSE") {
      const key = format(new Date(tx.date), "yyyy-MM-dd");
      map[key] = (map[key] || 0) + tx.amount;
    }
  });
  return map;
}

// Sum expenses within a date range from the map
function sumRange(expenseMap: Record<string, number>, start: Date, end: Date): number {
  const days = eachDayOfInterval({ start, end });
  return days.reduce((sum, d) => sum + (expenseMap[format(d, "yyyy-MM-dd")] || 0), 0);
}

export default function SpendingHeatmap({ transactions, isLoading }: SpendingHeatmapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [offset, setOffset] = useState(0); // 0 = current period, -1 = previous, etc.
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Build expense lookup once
  const expenseMap = useMemo(() => buildExpenseMap(transactions), [transactions]);

  // Navigate
  const goBack = useCallback(() => setOffset((o) => o - 1), []);
  const goForward = useCallback(() => setOffset((o) => Math.min(o + 1, 0)), []);
  const goToNow = useCallback(() => setOffset(0), []);

  // When view mode changes, reset offset
  const switchView = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setOffset(0);
    setHoveredIdx(null);
  }, []);

  const isCurrentPeriod = offset === 0;

  // ---------- WEEK VIEW ----------
  const weekViewData = useMemo(() => {
    if (viewMode !== "week") return null;

    const today = startOfDay(new Date());
    const base = addWeeks(today, offset);
    const weekStart = startOfWeek(base, { weekStartsOn: 1 }); // Mon
    const weekEnd = endOfWeek(base, { weekStartsOn: 1 }); // Sun

    // Clamp to today if current week
    const effectiveEnd = isAfter(weekEnd, today) && offset === 0 ? today : weekEnd;

    const days = eachDayOfInterval({ start: weekStart, end: effectiveEnd });

    const bars = days.map((day) => {
      const key = format(day, "yyyy-MM-dd");
      const amount = expenseMap[key] || 0;
      const isToday = isSameDay(day, today);

      return {
        key,
        label: isToday ? "Today" : format(day, "EEE"),
        subLabel: format(day, "dd MMM"),
        amount,
        isHighlight: isToday,
      };
    });

    const total = bars.reduce((s, b) => s + b.amount, 0);
    const activeDays = bars.filter((b) => b.amount > 0).length;
    const avg = bars.length > 0 ? Math.round(total / bars.length) : 0;

    // Previous period comparison
    const prevStart = subWeeks(weekStart, 1);
    const prevEnd = subWeeks(weekEnd, 1);
    const prevTotal = sumRange(expenseMap, prevStart, prevEnd);

    return {
      bars,
      total,
      activeDays,
      totalDays: bars.length,
      avg,
      prevTotal,
      periodLabel: `${format(weekStart, "dd MMM")} – ${format(effectiveEnd, "dd MMM yyyy")}`,
      avgLabel: "Avg / day",
      compLabel: "vs prev week",
    };
  }, [viewMode, offset, expenseMap]);

  // ---------- MONTH VIEW ----------
  const monthViewData = useMemo(() => {
    if (viewMode !== "month") return null;

    const today = startOfDay(new Date());
    const base = addMonths(today, offset);
    const monthStart = startOfMonth(base);
    const monthEnd = endOfMonth(base);

    // Clamp end to today if current month
    const effectiveEnd = isAfter(monthEnd, today) && offset === 0 ? today : monthEnd;

    // Group days into weeks within the month
    const allDays = eachDayOfInterval({ start: monthStart, end: effectiveEnd });
    const weekBuckets: { start: Date; end: Date; days: Date[] }[] = [];
    let currentBucketStart = allDays[0];
    let currentBucket: Date[] = [];

    allDays.forEach((day) => {
      const dayOfWeek = day.getDay();
      if (dayOfWeek === 1 && currentBucket.length > 0) {
        // Monday starts a new week
        weekBuckets.push({
          start: currentBucketStart,
          end: currentBucket[currentBucket.length - 1],
          days: [...currentBucket],
        });
        currentBucket = [];
        currentBucketStart = day;
      }
      currentBucket.push(day);
    });
    // Push the last bucket
    if (currentBucket.length > 0) {
      weekBuckets.push({
        start: currentBucketStart,
        end: currentBucket[currentBucket.length - 1],
        days: [...currentBucket],
      });
    }

    const bars = weekBuckets.map((bucket, idx) => {
      const amount = bucket.days.reduce(
        (s, d) => s + (expenseMap[format(d, "yyyy-MM-dd")] || 0),
        0
      );
      const hasToday = bucket.days.some((d) => isSameDay(d, today));

      return {
        key: `week-${idx}`,
        label: `Week ${idx + 1}`,
        subLabel: `${format(bucket.start, "dd")}–${format(bucket.end, "dd MMM")}`,
        amount,
        isHighlight: hasToday,
      };
    });

    const total = bars.reduce((s, b) => s + b.amount, 0);
    const activeDays = allDays.filter((d) => (expenseMap[format(d, "yyyy-MM-dd")] || 0) > 0).length;
    const avg = weekBuckets.length > 0 ? Math.round(total / weekBuckets.length) : 0;

    // Previous month comparison
    const prevMonthStart = startOfMonth(subMonths(monthStart, 1));
    const prevMonthEnd = endOfMonth(subMonths(monthStart, 1));
    const prevTotal = sumRange(expenseMap, prevMonthStart, prevMonthEnd);

    return {
      bars,
      total,
      activeDays,
      totalDays: allDays.length,
      avg,
      prevTotal,
      periodLabel: format(monthStart, "MMMM yyyy"),
      avgLabel: "Avg / week",
      compLabel: "vs prev month",
    };
  }, [viewMode, offset, expenseMap]);

  // ---------- YEAR VIEW ----------
  const yearViewData = useMemo(() => {
    if (viewMode !== "year") return null;

    const today = startOfDay(new Date());
    const base = addYears(today, offset);
    const yearStart = startOfYear(base);
    const yearEnd = endOfYear(base);

    // Clamp to today if current year
    const effectiveEnd = isAfter(yearEnd, today) && offset === 0 ? today : yearEnd;

    const months = eachMonthOfInterval({ start: yearStart, end: effectiveEnd });

    const bars = months.map((month) => {
      const mStart = startOfMonth(month);
      const mEnd = isAfter(endOfMonth(month), effectiveEnd) ? effectiveEnd : endOfMonth(month);
      const monthDays = eachDayOfInterval({ start: mStart, end: mEnd });
      const amount = monthDays.reduce(
        (s, d) => s + (expenseMap[format(d, "yyyy-MM-dd")] || 0),
        0
      );
      const isCurrent = isSameDay(startOfMonth(today), mStart) && offset === 0;

      return {
        key: format(month, "yyyy-MM"),
        label: format(month, "MMM"),
        subLabel: format(month, "yyyy"),
        amount,
        isHighlight: isCurrent,
      };
    });

    const total = bars.reduce((s, b) => s + b.amount, 0);
    const activeMonths = bars.filter((b) => b.amount > 0).length;
    const avg = bars.length > 0 ? Math.round(total / bars.length) : 0;

    // Previous year comparison
    const prevYearStart = startOfYear(subYears(yearStart, 1));
    const prevYearEnd = endOfYear(subYears(yearStart, 1));
    const prevTotal = sumRange(expenseMap, prevYearStart, prevYearEnd);

    return {
      bars,
      total,
      activeDays: activeMonths,
      totalDays: bars.length,
      avg,
      prevTotal,
      periodLabel: format(yearStart, "yyyy"),
      avgLabel: "Avg / month",
      compLabel: "vs prev year",
    };
  }, [viewMode, offset, expenseMap]);

  // Pick active data
  const viewData = viewMode === "week" ? weekViewData : viewMode === "month" ? monthViewData : yearViewData;

  if (isLoading) {
    return <div className="glass-card p-6 h-[340px] skeleton" />;
  }

  if (!viewData) return null;

  const maxAmount = Math.max(...viewData.bars.map((b) => b.amount), 1);
  const changePercent =
    viewData.prevTotal > 0
      ? ((viewData.total - viewData.prevTotal) / viewData.prevTotal) * 100
      : 0;

  return (
    <div className="glass-card p-6 bg-brand-card/40 backdrop-blur-md border border-brand-border">
      {/* ─── Header Row ─── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        {/* Left: Period navigation */}
        <div className="flex items-center gap-3">
          <CalendarDays size={14} className="text-brand-muted shrink-0" />

          {/* Prev / Next buttons */}
          <button
            onClick={goBack}
            className="p-1 rounded-md hover:bg-brand-bg/60 text-brand-muted hover:text-brand-text transition-colors"
            aria-label="Previous period"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="min-w-[130px] text-center">
            <h3 className="text-sm font-semibold text-brand-text leading-tight">
              {viewData.periodLabel}
            </h3>
          </div>

          <button
            onClick={goForward}
            disabled={isCurrentPeriod}
            className="p-1 rounded-md hover:bg-brand-bg/60 text-brand-muted hover:text-brand-text transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Next period"
          >
            <ChevronRight size={16} />
          </button>

          {!isCurrentPeriod && (
            <button
              onClick={goToNow}
              className="text-[10px] font-semibold text-brand-accent hover:text-brand-text px-2 py-0.5 rounded-md bg-brand-accent/10 hover:bg-brand-accent/15 transition-colors"
            >
              Today
            </button>
          )}
        </div>

        {/* Right: View mode toggle + stats */}
        <div className="flex items-center gap-4">
          {/* Summary stats */}
          <div className="hidden sm:flex items-center gap-3 text-right">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-brand-muted font-semibold">Total</p>
              <p className="text-sm font-bold text-brand-text">₹{viewData.total.toLocaleString()}</p>
            </div>
            <div className="w-px h-7 bg-brand-border" />
            <div>
              <p className="text-[9px] uppercase tracking-wider text-brand-muted font-semibold">{viewData.avgLabel}</p>
              <p className="text-sm font-bold text-brand-text">₹{viewData.avg.toLocaleString()}</p>
            </div>
            {viewData.prevTotal > 0 && (
              <>
                <div className="w-px h-7 bg-brand-border" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-brand-muted font-semibold">
                    {viewData.compLabel}
                  </p>
                  <p
                    className={`text-sm font-bold flex items-center gap-0.5 justify-end ${
                      changePercent <= 0 ? "text-brand-success" : "text-brand-expense"
                    }`}
                  >
                    {changePercent <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                    {Math.abs(changePercent).toFixed(0)}%
                  </p>
                </div>
              </>
            )}
          </div>

          {/* View mode segmented control */}
          <div className="flex bg-brand-bg/50 rounded-md p-0.5">
            {(["week", "month", "year"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => switchView(mode)}
                className={`px-3 py-1 rounded-[5px] text-[11px] font-semibold capitalize transition-all duration-200 ${
                  viewMode === mode
                    ? "bg-brand-card text-brand-text shadow-sm"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile summary row */}
      <div className="sm:hidden flex items-center justify-between mb-4 text-xs">
        <div>
          <span className="text-brand-muted font-light">Total: </span>
          <span className="font-bold text-brand-text">₹{viewData.total.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-brand-muted font-light">{viewData.avgLabel}: </span>
          <span className="font-bold text-brand-text">₹{viewData.avg.toLocaleString()}</span>
        </div>
      </div>

      {/* ─── Bar Chart ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${offset}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-2.5"
        >
          {viewData.bars.length === 0 ? (
            <div className="text-center py-12 text-xs text-brand-muted font-light">
              No spending data for this period.
            </div>
          ) : (
            viewData.bars.map((bar, idx) => {
              const widthPct = maxAmount > 0 ? (bar.amount / maxAmount) * 100 : 0;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={bar.key}
                  className="flex items-center gap-3 group"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Label */}
                  <div className="w-[72px] shrink-0 text-right">
                    <span
                      className={`text-xs font-medium ${
                        bar.isHighlight ? "text-brand-text" : "text-brand-muted"
                      }`}
                    >
                      {bar.label}
                    </span>
                    <p className="text-[9px] text-brand-muted/50 font-light">{bar.subLabel}</p>
                  </div>

                  {/* Bar track */}
                  <div className="flex-1 h-8 bg-brand-bg/40 rounded-md overflow-hidden relative">
                    {bar.amount > 0 ? (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(widthPct, 3)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.04 }}
                        className={`h-full rounded-md transition-colors duration-200 ${
                          bar.isHighlight
                            ? "bg-brand-accent/70"
                            : isHovered
                            ? "bg-brand-accent/45"
                            : "bg-brand-accent/20"
                        }`}
                      />
                    ) : (
                      <div className="h-full flex items-center px-3">
                        <span className="text-[10px] text-brand-muted/30 font-light italic">
                          No spending
                        </span>
                      </div>
                    )}

                    {/* Amount overlay */}
                    {bar.amount > 0 && (
                      <div className="absolute inset-0 flex items-center px-3">
                        <span
                          className={`text-[11px] font-semibold ${
                            widthPct > 35 ? "text-brand-text" : "text-brand-muted"
                          }`}
                        >
                          ₹{bar.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── Footer ─── */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border">
        <span className="text-[10px] text-brand-muted font-light">
          {viewMode === "year"
            ? `${viewData.activeDays} of ${viewData.totalDays} months active`
            : `${viewData.activeDays} of ${viewData.totalDays} days active`}
        </span>
        <span className="text-[10px] text-brand-muted font-light">{viewData.periodLabel}</span>
      </div>
    </div>
  );
}
