import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { dashboardService } from "@/features/dashboard/services/dashboardService";
import { transactionService } from "@/features/transactions/services/transactionService";
import { categoryService } from "@/features/transactions/services/categoryService";
import { budgetService } from "@/features/transactions/services/budgetService";
import { DashboardSummary, ExpenseBreakdown, MonthlyTrend } from "@/types/dashboard";
import { Transaction, BudgetProgress } from "@/types/transaction";
import { Category } from "@/types/category";

import SpendingHeatmap from "@/features/dashboard/components/SpendingHeatmap";
import InsightCards from "@/features/dashboard/components/InsightCards";
import CategoryAnalytics from "@/features/dashboard/components/CategoryAnalytics";
import SpendingTimeline from "@/features/dashboard/components/SpendingTimeline";
import FloatingActionButton from "@/components/FloatingActionButton";
import TransactionForm from "@/features/transactions/components/TransactionForm";
import IncomeExpenseBarChart from "@/features/dashboard/components/IncomeExpenseBarChart";

import { Mail, Shield, LogOut, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good Evening");

  // Determine active tab from URL query params
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get("tab") || "home";

  // Calculate dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setIsLoading(true);
    try {
      const [summaryData, breakdownData, trendData, txData, catData, budgetData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getExpenseBreakdown(),
        dashboardService.getMonthlyTrend(),
        transactionService.getAll({ limit: 500, sortBy: "date", sortOrder: "desc" }),
        categoryService.getAll(),
        budgetService.getProgress(),
      ]);

      setSummary(summaryData);
      setExpenseBreakdown(breakdownData);
      setMonthlyTrend(trendData);
      setAllTransactions(txData.data);
      setCategories(catData);
      setBudgetProgress(budgetData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      showToast("Failed to sync financial parameters", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddTransaction = async (data: any) => {
    try {
      await transactionService.create(data);
      showToast("Transaction logged successfully", "success");
      setIsFormOpen(false);
      loadDashboardData();
    } catch (error) {
      showToast("Failed to log transaction", "error");
      throw error;
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-10">
      {/* Header Greeting & Pulse Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-text tracking-tight animate-fade-in">
            {greeting}, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-xs text-brand-muted font-light mt-0.5">
            Here's your financial overview.
          </p>
        </div>

        {/* Dynamic Net Worth Indicator */}
        <div className="glass-card px-4 py-3 bg-brand-card/30 border border-brand-border flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-brand-success animate-pulse" />
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-wider text-brand-muted font-bold">CURRENT BALANCE</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-brand-text">
                ₹{summary?.remainingBalance?.toLocaleString() ?? "0"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout Handler */}
      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 lg:space-y-8"
          >
            {/* AI Insights row */}
            <InsightCards
              summary={summary}
              breakdown={expenseBreakdown}
              trend={monthlyTrend}
              isLoading={isLoading}
            />

            {/* Heatmap Row */}
            <SpendingHeatmap transactions={allTransactions} isLoading={isLoading} />

            {/* Bottom Grid components */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5">
                <CategoryAnalytics
                  data={expenseBreakdown}
                  budgetProgress={budgetProgress}
                  totalIncome={summary?.totalIncome}
                  totalExpense={summary?.totalExpenses}
                  isLoading={isLoading}
                />
              </div>
              <div className="lg:col-span-7">
                <SpendingTimeline
                  transactions={allTransactions}
                  isLoading={isLoading}
                  onAddClick={() => setIsFormOpen(true)}
                  limit={6}
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 lg:space-y-8"
          >
            {/* Category Performance + Progress Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <IncomeExpenseBarChart data={monthlyTrend} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-4">
                <CategoryAnalytics
                  data={expenseBreakdown}
                  budgetProgress={budgetProgress}
                  totalIncome={summary?.totalIncome}
                  totalExpense={summary?.totalExpenses}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* AI Insights for breakdown */}
            <InsightCards
              summary={summary}
              breakdown={expenseBreakdown}
              trend={monthlyTrend}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center py-6"
          >
            <div className="w-full max-w-xl glass-card p-8 bg-brand-card/30 border border-brand-border backdrop-blur-md space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-accent/5 blur-xl pointer-events-none" />

              <div className="flex flex-col items-center text-center space-y-4">
                {/* Large initials badge */}
                <div className="h-20 w-20 rounded-md gradient-bg flex items-center justify-center text-2xl font-black text-white shadow-2xl">
                  {user?.name ? user.name.split(" ").map(n => n[0]).join("") : "?"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-text">{user?.name}</h3>
                  <p className="text-xs text-brand-muted font-light mt-0.5">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-bg/50 border border-brand-border p-4 rounded-lg">
                  <span className="text-[9px] uppercase tracking-wider text-brand-muted font-bold">TOTAL DEPOSITS</span>
                  <p className="text-lg font-bold text-brand-income mt-1">₹{summary?.totalIncome?.toLocaleString() ?? "0"}</p>
                </div>
                <div className="bg-brand-bg/50 border border-brand-border p-4 rounded-lg">
                  <span className="text-[9px] uppercase tracking-wider text-brand-muted font-bold">TOTAL EXPENSES</span>
                  <p className="text-lg font-bold text-brand-expense mt-1">₹{summary?.totalExpenses?.toLocaleString() ?? "0"}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-brand-border pt-6">
                <div className="flex items-center gap-3 text-xs text-brand-muted">
                  <Mail size={15} className="text-brand-accent" />
                  <span>Email: {user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-brand-muted">
                  <Shield size={15} className="text-brand-accent" />
                  <span>Account Type: Premium Command Center</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-brand-muted">
                  <ArrowLeftRight size={15} className="text-brand-accent" />
                  <span>Total Ledger Activity: {allTransactions.length} items logged</span>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex gap-3">
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-lg bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-brand-expense text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={14} /> Log Out of Command Center
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsFormOpen(true)} visible={!isFormOpen} />

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <TransactionForm
            categories={categories}
            onSubmit={handleAddTransaction}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
