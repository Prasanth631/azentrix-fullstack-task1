import { Category } from "@/types/category";
import { TransactionFilters as TxFilters } from "@/types/transaction";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionFiltersProps {
  categories: Category[];
  filters: TxFilters;
  onFilterChange: (filters: Partial<TxFilters>) => void;
}

export default function TransactionFilters({
  categories,
  filters,
  onFilterChange,
}: TransactionFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = !!(filters.type || filters.categoryId || filters.startDate || filters.endDate);

  const clearFilters = () => {
    onFilterChange({
      type: undefined,
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and filter toggle bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
          />
          <input
            id="search-transactions"
            type="text"
            placeholder="Search ledger entries by title..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-md text-xs bg-brand-card/40 border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all duration-200"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all duration-200 border ${
            hasActiveFilters 
              ? "bg-gradient-to-tr from-brand-accent to-brand-accent/80 text-white border-transparent" 
              : "bg-brand-card/40 border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-border"
          }`}
        >
          <Filter size={14} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="h-4 w-4 rounded-full bg-white/20 text-[9px] flex items-center justify-center font-bold">
              ✓
            </span>
          )}
        </button>
      </div>

      {/* Filter drawer panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass-card p-5 bg-brand-card/50 border border-brand-border backdrop-blur-md overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold tracking-wider text-brand-text uppercase">
                Filter Criteria
              </h4>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-brand-accent hover:text-brand-accent/80 flex items-center gap-1 transition-colors uppercase tracking-wider"
                >
                  <X size={10} /> Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  Ledger Type
                </label>
                <select
                  value={filters.type || ""}
                  onChange={(e) =>
                    onFilterChange({
                      type: (e.target.value as any) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text focus:border-brand-accent focus:outline-none transition-all"
                >
                  <option value="">All Transactions</option>
                  <option value="INCOME">Income Deposits</option>
                  <option value="EXPENSE">Expense Burns</option>
                </select>
              </div>

              {/* Category select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  Category
                </label>
                <select
                  value={filters.categoryId || ""}
                  onChange={(e) =>
                    onFilterChange({
                      categoryId: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text focus:border-brand-accent focus:outline-none transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.type === "INCOME" ? "deposit" : "burn"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    onFilterChange({ startDate: e.target.value || undefined })
                  }
                  className="w-full px-3 py-2 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text focus:border-brand-accent focus:outline-none transition-all"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    onFilterChange({ endDate: e.target.value || undefined })
                  }
                  className="w-full px-3 py-2 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text focus:border-brand-accent focus:outline-none transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
