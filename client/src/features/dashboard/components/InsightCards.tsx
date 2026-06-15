import React, { useMemo } from "react";
import { DashboardSummary, ExpenseBreakdown, MonthlyTrend } from "@/types/dashboard";
import { TrendingUp, TrendingDown, Flame, ShieldCheck, Wallet, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface InsightCardsProps {
  summary: DashboardSummary | null;
  breakdown: ExpenseBreakdown[];
  trend: MonthlyTrend[];
  isLoading?: boolean;
}

interface InsightCard {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
}

export default function InsightCards({ summary, breakdown, trend, isLoading }: InsightCardsProps) {
  const insights = useMemo(() => {
    const list: InsightCard[] = [];

    if (!summary) return [];

    const income = summary.totalIncome || 0;
    const expenses = summary.totalExpenses || 0;
    const balance = summary.remainingBalance ?? income - expenses;
    const monthSavings = summary.currentMonthSavings ?? 0;

    // 1. Total Income card — always show if there's any income
    if (income > 0) {
      list.push({
        title: "Total Income",
        value: formatCurrency(income),
        description: "Total income recorded across all transactions.",
        icon: TrendingUp,
        iconColor: "text-brand-success",
      });
    }

    // 2. Total Expenses card — always show if there are any expenses
    if (expenses > 0) {
      list.push({
        title: "Total Expenses",
        value: formatCurrency(expenses),
        description: `You've spent ${income > 0 ? `${((expenses / income) * 100).toFixed(0)}% of your income` : "across all categories"}.`,
        icon: TrendingDown,
        iconColor: "text-brand-expense",
      });
    }

    // 3. Current Balance — always show
    list.push({
      title: "Balance",
      value: formatCurrency(balance),
      description:
        balance >= 0
          ? "Your remaining balance after all expenses."
          : "Your expenses have exceeded your income.",
      icon: Wallet,
      iconColor: balance >= 0 ? "text-brand-accent" : "text-brand-expense",
    });

    // 4. This Month Savings — show if we have the data
    if (monthSavings !== 0 || income > 0) {
      list.push({
        title: "This Month Savings",
        value: formatCurrency(monthSavings),
        description:
          monthSavings > 0
            ? "Net savings for the current month."
            : monthSavings < 0
            ? "You're spending more than you're earning this month."
            : "No savings recorded yet this month.",
        icon: PiggyBank,
        iconColor: monthSavings >= 0 ? "text-brand-success" : "text-brand-expense",
      });
    }

    // 5. Top Spending Category — only if we have real breakdown data
    if (breakdown && breakdown.length > 0 && expenses > 0) {
      const sorted = [...breakdown].sort((a, b) => b.amount - a.amount);
      const top = sorted[0];
      const pct = ((top.amount / expenses) * 100).toFixed(0);

      list.push({
        title: "Top Category",
        value: `${top.category}`,
        description: `${formatCurrency(top.amount)} spent — ${pct}% of your total expenses.`,
        icon: Flame,
        iconColor: "text-brand-expense",
      });
    }

    // 6. Spending Trend — only if we have at least 2 months of real trend data
    if (trend && trend.length >= 2) {
      const current = trend[trend.length - 1];
      const previous = trend[trend.length - 2];
      const currentExp = current.expense || 0;
      const prevExp = previous.expense || 0;

      if (prevExp > 0 && currentExp > 0) {
        const pctDiff = ((currentExp - prevExp) / prevExp) * 100;
        const decreased = pctDiff < 0;

        list.push({
          title: "Month-over-Month",
          value: `${decreased ? "" : "+"}${pctDiff.toFixed(0)}% spending`,
          description: decreased
            ? `You spent ${Math.abs(pctDiff).toFixed(0)}% less this month compared to last month.`
            : `Expenses increased by ${pctDiff.toFixed(0)}% compared to last month.`,
          icon: decreased ? ShieldCheck : TrendingUp,
          iconColor: decreased ? "text-brand-success" : "text-brand-expense",
        });
      }
    }

    return list;
  }, [summary, breakdown, trend]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-5 h-[130px] skeleton" />
        ))}
      </div>
    );
  }

  if (insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {insights.slice(0, 6).map((insight, idx) => {
        const Icon = insight.icon;

        return (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
            className="glass-card p-5 bg-brand-card/40 border border-brand-border backdrop-blur-md flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] uppercase tracking-wider text-brand-muted font-semibold">
                {insight.title}
              </span>
              <div className={`p-1.5 rounded-md bg-brand-bg/60 ${insight.iconColor}`}>
                <Icon size={14} />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-brand-text tracking-tight leading-tight">
                {insight.value}
              </h4>
              <p className="text-[11px] text-brand-muted mt-1.5 font-light leading-relaxed">
                {insight.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
