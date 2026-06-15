import { DashboardSummary } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

interface SummaryCardsProps {
  summary: DashboardSummary | null;
  isLoading: boolean;
}

const cards = [
  {
    key: "totalIncome" as const,
    label: "Total Income",
    icon: TrendingUp,
    color: "#10B981",
    bgLight: "rgba(16, 185, 129, 0.1)",
  },
  {
    key: "totalExpenses" as const,
    label: "Total Expenses",
    icon: TrendingDown,
    color: "#F43F5E",
    bgLight: "rgba(244, 63, 94, 0.1)",
  },
  {
    key: "remainingBalance" as const,
    label: "Balance",
    icon: Wallet,
    color: "#6366F1",
    bgLight: "rgba(99, 102, 241, 0.1)",
  },
  {
    key: "currentMonthSavings" as const,
    label: "This Month Savings",
    icon: PiggyBank,
    color: "#F59E0B",
    bgLight: "rgba(245, 158, 11, 0.1)",
  },
];

export default function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-6">
            <div className="skeleton h-4 w-24 mb-4" />
            <div className="skeleton h-8 w-32 mb-2" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card, index) => {
        const value = summary?.[card.key] ?? 0;
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="glass-card p-6 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {card.label}
              </span>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md"
                style={{ backgroundColor: card.bgLight }}
              >
                <Icon size={20} style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: card.color }}>
              {formatCurrency(value)}
            </div>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {card.key === "currentMonthSavings"
                ? "Current month"
                : "All time"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
