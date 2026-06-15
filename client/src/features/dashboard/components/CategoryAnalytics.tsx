import React, { useMemo } from "react";
import { ExpenseBreakdown } from "@/types/dashboard";
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
} from "lucide-react";

interface CategoryAnalyticsProps {
  data: ExpenseBreakdown[];
  totalIncome?: number;
  totalExpense?: number;
  isLoading?: boolean;
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

// Colors mapping matching the theme dynamically
const getCategoryColor = (index: number) => {
  const colors = [
    { text: "text-brand-accent", bg: "bg-brand-accent", hex: "var(--accent-color)" },
    { text: "text-brand-success", bg: "bg-brand-success", hex: "var(--success-color)" },
    { text: "text-brand-expense", bg: "bg-brand-expense", hex: "var(--expense-color)" },
    { text: "text-brand-success", bg: "bg-brand-success", hex: "var(--success-color)" },
    { text: "text-brand-text", bg: "bg-brand-muted/20", hex: "var(--text-secondary)" },
  ];
  return colors[index % colors.length];
};

export default function CategoryAnalytics({ data, totalIncome = 0, totalExpense = 0, isLoading }: CategoryAnalyticsProps) {
  // Sort data descending by amount to get top categories
  const sortedCategories = useMemo(() => {
    return [...data].sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [data]);

  // Overall budget burn rate (percentage of income spent)
  const burnRate = useMemo(() => {
    if (!totalIncome || totalIncome === 0) return 0;
    return Math.min(Math.round((totalExpense / totalIncome) * 100), 100);
  }, [totalIncome, totalExpense]);

  // SVG parameters for center progress ring
  const radius = 65;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (burnRate / 100) * circumference;

  if (isLoading) {
    return <div className="glass-card p-6 h-[380px] skeleton" />;
  }

  return (
    <div className="glass-card p-6 bg-brand-card/45 backdrop-blur-md border border-brand-border flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-semibold tracking-wide text-brand-text">CATEGORY PERFORMANCE</h3>
        <p className="text-[11px] text-brand-muted font-light mb-6">
          Realtime breakdown of discretionary burn rates and velocity limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">
        {/* Ring Chart Column */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative py-2">
          <div className="relative w-40 h-40">
            {/* Background SVG Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-brand-accent/5 fill-transparent"
                strokeWidth={strokeWidth}
              />
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                className="fill-transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                stroke="var(--accent-color)"
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] tracking-wider uppercase text-brand-muted font-semibold">BURN RATE</span>
              <span className="text-3xl font-extrabold text-brand-text tracking-tight">{burnRate}%</span>
              <span className="text-[9px] text-brand-muted font-light mt-0.5">
                of income spent
              </span>
            </div>
          </div>

          <div className="text-center mt-3 text-[10px] text-brand-muted font-light">
            You spent <span className="font-semibold text-brand-expense">₹{totalExpense.toLocaleString()}</span> of your{" "}
            <span className="font-semibold text-brand-success">₹{totalIncome.toLocaleString()}</span> income.
          </div>
        </div>

        {/* Categories Progress Column */}
        <div className="md:col-span-7 space-y-4">
          {sortedCategories.length === 0 ? (
            <div className="text-center py-8 text-xs text-brand-muted">
              No transactions recorded yet.
            </div>
          ) : (
            sortedCategories.map((item, idx) => {
              const Icon = getCategoryIcon(item.category);
              const colorInfo = getCategoryColor(idx);
              
              // Calculate percentage of category amount in relation to total expense
              const percentage = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;

              return (
                <div key={item.category} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg bg-brand-bg border border-brand-border ${colorInfo.text} group-hover:opacity-80 transition-opacity duration-200`}>
                        <Icon size={13} />
                      </div>
                      <span className="text-brand-text font-semibold group-hover:text-brand-accent transition-colors">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-brand-muted font-light">
                        ₹{item.amount.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-semibold text-brand-muted">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Custom Progress Bar */}
                  <div className="relative h-2 w-full bg-brand-bg/50 border border-brand-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                      className={`h-full rounded-full ${colorInfo.bg}`}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-brand-muted px-0.5 font-light">
                    <span>Allocation</span>
                    <span>{percentage.toFixed(0)}% of expenses</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
