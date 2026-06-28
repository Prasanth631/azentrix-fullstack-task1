import { useState, useEffect, useCallback } from "react";
import { Transaction, TransactionFilters as TxFilters } from "@/types/transaction";
import { Category } from "@/types/category";
import { transactionService } from "@/features/transactions/services/transactionService";
import { categoryService } from "@/features/transactions/services/categoryService";
import TransactionList from "@/features/transactions/components/TransactionList";
import TransactionForm from "@/features/transactions/components/TransactionForm";
import TransactionFilters from "@/features/transactions/components/TransactionFilters";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useToast } from "@/hooks/useToast";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 0 });
  const [filters, setFilters] = useState<TxFilters>({ page: 1, limit: 12 });
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { showToast } = useToast();

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await transactionService.getAll(filters);
      setTransactions(result.data);
      if (result.meta) setMeta(result.meta);
    } catch (error) {
      showToast("Failed to load financial records", "error");
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {});
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await transactionService.create(data);
      showToast("Ledger entry created successfully", "success");
      setShowForm(false);
      loadTransactions();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to log entry", "error");
      throw error;
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingTransaction) return;
    try {
      await transactionService.update(editingTransaction.id, data);
      showToast("Ledger entry updated successfully", "success");
      setEditingTransaction(null);
      setShowForm(false);
      loadTransactions();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update entry", "error");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionService.delete(id);
      showToast("Ledger entry deleted successfully", "success");
      loadTransactions();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to delete entry", "error");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleFilterChange = (newFilters: Partial<TxFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
            Transactions
          </h2>
          <p className="text-xs text-brand-muted font-light mt-0.5">
            Your recent financial activity
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-brand-text text-brand-bg font-bold text-xs hover:opacity-90 transition-all"
        >
          <Plus size={14} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Filter panel */}
      <TransactionFilters
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Sequential Timeline component */}
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        meta={meta}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowForm(true)} visible={!showForm} />

      {/* Modal Dialog */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            categories={categories}
            transaction={editingTransaction}
            onSubmit={editingTransaction ? handleUpdate : handleCreate}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
