import { Transaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function RecentTransactions({
  transactions,
  isLoading,
}: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-5 w-48 mb-6" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <div className="skeleton h-10 w-10 rounded-md" />
            <div className="flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-20" />
            </div>
            <div className="skeleton h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in-up delay-400" style={{ animationFillMode: "backwards" }}>
      <h3
        className="text-lg font-semibold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Recent Transactions
      </h3>
      {transactions.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p style={{ color: "var(--text-tertiary)" }}>
            No transactions yet. Create your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {transactions.slice(0, 7).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 py-3 px-3 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md shrink-0"
                style={{
                  backgroundColor:
                    tx.type === "INCOME"
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(244, 63, 94, 0.1)",
                }}
              >
                {tx.type === "INCOME" ? (
                  <ArrowUpRight size={18} style={{ color: "var(--income-color)" }} />
                ) : (
                  <ArrowDownRight size={18} style={{ color: "var(--expense-color)" }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tx.title}
                </p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {tx.category.name} · {formatDate(tx.date)}
                </p>
              </div>

              <span
                className="text-sm font-semibold shrink-0"
                style={{
                  color: tx.type === "INCOME" ? "var(--income-color)" : "var(--expense-color)",
                }}
              >
                {tx.type === "INCOME" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
