import React, { useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";
import {
  Utensils,
  ShoppingBag,
  Car,
  Tv,
  Lightbulb,
  Heart,
  BookOpen,
  TrendingUp,
  Briefcase,
  DollarSign,
  Plus
} from "lucide-react";

interface SpendingTimelineProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onAddClick?: () => void;
  limit?: number;
}

// Icon mapping helper
const getCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("food") || normalized.includes("dine") || normalized.includes("restaurant")) return Utensils;
  if (normalized.includes("shop") || normalized.includes("clothes") || normalized.includes("groceries")) return ShoppingBag;
  if (normalized.includes("travel") || normalized.includes("cab") || normalized.includes("transport") || normalized.includes("fuel")) return Car;
  if (normalized.includes("entertainment") || normalized.includes("movie") || normalized.includes("sub") || normalized.includes("show")) return Tv;
  if (normalized.includes("bill") || normalized.includes("utility") || normalized.includes("electricity") || normalized.includes("rent")) return Lightbulb;
  if (normalized.includes("health") || normalized.includes("medical") || normalized.includes("medicine")) return Heart;
  if (normalized.includes("education") || normalized.includes("book") || normalized.includes("course")) return BookOpen;
  if (normalized.includes("save") || normalized.includes("invest") || normalized.includes("stock")) return TrendingUp;
  if (normalized.includes("salary") || normalized.includes("wage") || normalized.includes("work")) return Briefcase;
  return DollarSign;
};

// Date formatting helper
const formatTimelineDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
};

export default function SpendingTimeline({ transactions, isLoading, onAddClick, limit }: SpendingTimelineProps) {
  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const displayList = limit ? sorted.slice(0, limit) : sorted;

    const groups: Record<string, Transaction[]> = {};
    displayList.forEach((tx) => {
      const dateKey = format(new Date(tx.date), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [transactions, limit]);

  if (isLoading) {
    return (
      <div className="glass-card p-6 h-[400px] skeleton" />
    );
  }

  return (
    <div className="glass-card p-6 bg-brand-card/45 border border-brand-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-brand-text">SPENDING TIMELINE</h3>
          <p className="text-[11px] text-brand-muted font-light">
            Sequential stream of income deposits and expense burns.
          </p>
        </div>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-accent/10 border border-brand-border text-brand-accent text-[11px] font-bold tracking-wide hover:bg-brand-accent/20 hover:opacity-80 transition-all duration-200"
          >
            <Plus size={12} /> Add Ledger
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 select-none space-y-6 relative max-h-[500px] no-scrollbar">
        {groupedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xs text-brand-muted font-light mb-3">No activity recorded yet.</p>
            {onAddClick && (
              <button
                onClick={onAddClick}
                className="px-4 py-2 rounded-md bg-brand-accent text-white text-xs font-bold hover:bg-brand-accent/90 transition-colors"
              >
                Log First Transaction
              </button>
            )}
          </div>
        ) : (
          <div className="relative pl-8 space-y-8">
            {/* Vertical line — visible in both themes */}
            <div className="absolute left-[7px] top-3 bottom-3 w-[2px] rounded-full bg-brand-muted/30" />

            {groupedTransactions.map(([dateStr, txList], groupIdx) => (
              <div key={dateStr} className="relative space-y-3">
                {/* Date dot — sits on the line */}
                <div className="absolute -left-[24px] top-[6px] h-3 w-3 rounded-full bg-brand-accent border-2 border-brand-bg" />

                {/* Date label */}
                <span className="text-[11px] font-bold text-brand-text tracking-wider uppercase">
                  {formatTimelineDate(dateStr)}
                </span>

                {/* Date's Transactions list */}
                <div className="space-y-2.5">
                  {txList.map((tx, txIdx) => {
                    const Icon = getCategoryIcon(tx.category?.name || "");
                    const isIncome = tx.type === "INCOME";

                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: txIdx * 0.05 }}
                        className="relative flex items-center justify-between p-3 rounded-lg bg-brand-bg/40 hover:bg-brand-bg/70 border border-brand-border group transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          {/* Category Badge Icon */}
                          <div
                            className={`p-2 rounded-md ${
                              isIncome
                                ? "bg-brand-income/10 text-brand-income"
                                : "bg-brand-expense/10 text-brand-expense"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-brand-text">
                              {tx.title}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] text-brand-muted uppercase font-semibold">
                                {tx.category?.name}
                              </span>
                              {tx.notes && (
                                <>
                                  <span className="text-[9px] text-brand-muted/50">•</span>
                                  <span className="text-[9px] text-brand-muted/60 truncate max-w-[120px] font-light">
                                    {tx.notes}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold ${
                              isIncome ? "text-brand-income" : "text-brand-expense"
                            }`}
                          >
                            {isIncome ? "+" : "-"} ₹{tx.amount.toLocaleString()}
                          </span>
                          <p className="text-[9px] text-brand-muted font-light mt-0.5">
                            {format(new Date(tx.date), "h:mm a")}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
