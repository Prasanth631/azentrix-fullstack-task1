import { useState, useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Edit2, Trash2, ChevronLeft, ChevronRight, Utensils, ShoppingBag, Car, Tv, Lightbulb, Heart, BookOpen, TrendingUp, Briefcase, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  meta: { total: number; page: number; limit: number; totalPages: number };
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
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

export default function TransactionList({
  transactions,
  isLoading,
  meta,
  onEdit,
  onDelete,
  onPageChange,
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deletingId === id) {
      onDelete(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 4000);
    }
  };

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    transactions.forEach((tx) => {
      const dateKey = format(new Date(tx.date), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="glass-card p-6 overflow-hidden space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="skeleton h-10 w-10 rounded-md shrink-0" />
            <div className="flex-1">
              <div className="skeleton h-4 w-40 mb-2" />
              <div className="skeleton h-3 w-24" />
            </div>
            <div className="skeleton h-6 w-20 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-12 text-center bg-brand-card/40 border border-brand-border backdrop-blur-md">
        <h3 className="text-md font-semibold text-brand-text mb-1">
          No ledger entries found
        </h3>
        <p className="text-xs text-brand-muted font-light">
          Try adjusting your filter settings or create a new entry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline view container */}
      <div className="glass-card p-6 bg-brand-card/40 border border-brand-border backdrop-blur-md relative overflow-hidden">
        <div className="relative pl-8 space-y-8 py-2">
          {/* Vertical line — visible in both themes */}
          <div className="absolute left-[7px] top-3 bottom-3 w-[2px] rounded-full bg-brand-muted/30" />

          {groupedTransactions.map(([dateStr, txList]) => (
            <div key={dateStr} className="relative space-y-3">
              
              {/* Date dot — sits on the line */}
              <div className="absolute -left-[24px] top-[5px] h-3 w-3 rounded-full bg-brand-accent border-2 border-brand-bg" />

              {/* Day Header */}
              <span className="text-[10px] font-bold text-brand-text tracking-wider uppercase">
                {formatTimelineDate(dateStr)}
              </span>

              {/* Transactions in date */}
              <div className="space-y-2.5">
                {txList.map((tx) => {
                  const Icon = getCategoryIcon(tx.category?.name || "");
                  const isIncome = tx.type === "INCOME";

                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative flex items-center justify-between p-3.5 rounded-lg bg-brand-bg/40 hover:bg-brand-bg/70 border border-brand-border group transition-all duration-200"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Category badge */}
                        <div
                          className={`p-2 rounded-md shrink-0 ${
                            isIncome
                              ? "bg-brand-income/10 text-brand-income"
                              : "bg-brand-expense/10 text-brand-expense"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-brand-text truncate">
                            {tx.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                              {tx.category?.name}
                            </span>
                            {tx.notes && (
                              <>
                                <span className="text-[9px] text-brand-muted/50">•</span>
                                <span className="text-[9px] text-brand-muted/60 truncate max-w-[150px] font-light">
                                  {tx.notes}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Panel: Amount & Edit/Delete actions */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold ${
                              isIncome ? "text-brand-income" : "text-brand-expense"
                            }`}
                          >
                            {isIncome ? "+" : "-"} {formatCurrency(tx.amount)}
                          </span>
                          <p className="text-[9px] text-brand-muted font-light mt-0.5">
                            {format(new Date(tx.date), "h:mm a")}
                          </p>
                        </div>

                        {/* Slide-in Action controls */}
                        <div className="flex items-center gap-1.5 pl-2 border-l border-brand-border opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => onEdit(tx)}
                            className="p-1.5 rounded-lg text-brand-muted hover:text-brand-accent hover:bg-brand-bg/50 transition-all"
                            title="Edit Ledger Entry"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className={`p-1.5 rounded-lg transition-all ${
                              deletingId === tx.id
                                ? "bg-brand-expense/20 text-brand-expense"
                                : "text-brand-muted hover:text-brand-expense hover:bg-brand-bg/50"
                            }`}
                            title={deletingId === tx.id ? "Click again to confirm" : "Delete Ledger Entry"}
                          >
                            {deletingId === tx.id ? (
                              <span className="text-[8px] font-extrabold uppercase px-1">Confirm</span>
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination control */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs font-medium text-brand-muted px-2">
          <span>
            Showing {(meta.page - 1) * meta.limit + 1}-
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="p-1.5 rounded-md border border-brand-border bg-brand-card/40 text-brand-muted hover:text-brand-text disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`h-7 w-7 rounded-md text-[10px] font-bold transition-all ${
                  meta.page === page
                    ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20"
                    : "border border-brand-border bg-brand-card/40 text-brand-muted hover:text-brand-text"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="p-1.5 rounded-md border border-brand-border bg-brand-card/40 text-brand-muted hover:text-brand-text disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
