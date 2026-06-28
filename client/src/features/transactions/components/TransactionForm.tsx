import { useState, useEffect } from "react";
import { Transaction, CreateTransactionInput, Tag, RecurringInterval } from "@/types/transaction";
import { Category } from "@/types/category";
import { formatDateInput } from "@/lib/utils";
import { X, Loader2, Calendar, FileText, IndianRupee, Tag as TagIcon, Repeat, Plus } from "lucide-react";
import { tagService } from "../services/tagService";
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
  DollarSign
} from "lucide-react";

interface TransactionFormProps {
  categories: Category[];
  transaction?: Transaction | null;
  onSubmit: (data: CreateTransactionInput) => Promise<void>;
  onClose: () => void;
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

export default function TransactionForm({
  categories,
  transaction,
  onSubmit,
  onClose,
}: TransactionFormProps) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    transaction?.type || "EXPENSE"
  );
  const [title, setTitle] = useState(transaction?.title || "");
  const [amount, setAmount] = useState(transaction?.amount?.toString() || "");
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || "");
  const [date, setDate] = useState(
    transaction ? formatDateInput(transaction.date) : formatDateInput(new Date())
  );
  const [notes, setNotes] = useState(transaction?.notes || "");
  const [isRecurring, setIsRecurring] = useState(transaction?.isRecurring || false);
  const [recurringInterval, setRecurringInterval] = useState<RecurringInterval>(
    transaction?.recurringInterval || "MONTHLY"
  );
  
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    transaction?.tags?.map(t => t.id) || []
  );
  const [newTagName, setNewTagName] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    tagService.getAll().then(setAvailableTags).catch(console.error);
  }, []);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const tag = await tagService.create(newTagName.trim());
      setAvailableTags(prev => [...prev, tag]);
      setSelectedTagIds(prev => [...prev, tag.id]);
      setNewTagName("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const isEditing = !!transaction;
  const filteredCategories = categories.filter((c) => c.type === type);

  // Auto-select first category as default when type changes
  useEffect(() => {
    if (!isEditing && filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type, isEditing, categories]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!amount || parseFloat(amount) <= 0)
      newErrors.amount = "Amount must be greater than zero";
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        categoryId,
        date,
        notes: notes.trim() || undefined,
        tagIds: selectedTagIds,
        isRecurring,
        recurringInterval: isRecurring ? recurringInterval : undefined,
      });
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-md p-6 bg-brand-card border border-brand-border shadow-[0_24px_50px_var(--shadow-color)] z-10 no-scrollbar text-brand-text"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-brand-border">
          <div>
            <h2 className="text-lg font-bold text-brand-text tracking-tight animate-fade-in">
              {isEditing ? "Edit Transaction" : "New Ledger Entry"}
            </h2>
            <p className="text-xs text-brand-muted font-light mt-0.5">
              Record a financial activity in your command ledger.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md transition-all duration-200 hover:bg-brand-card/50 text-brand-muted hover:text-brand-text"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle - Premium Segmented Control */}
          <div className="flex p-1 bg-brand-bg rounded-md border border-brand-border">
            {(["EXPENSE", "INCOME"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`relative flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  type === t
                    ? t === "INCOME"
                      ? "bg-brand-success text-brand-bg shadow-sm"
                      : "bg-brand-expense text-white shadow-sm"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                {t === "INCOME" ? "Income Deposit" : "Expense Burn"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Amount (₹) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                <IndianRupee size={14} />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((prev) => ({ ...prev, amount: "" }));
                }}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-md text-sm bg-brand-bg border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all"
              />
            </div>
            {errors.amount && <p className="text-[10px] text-brand-expense mt-1 font-medium">{errors.amount}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                <FileText size={14} />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="e.g. Salary, Groceries, Cab fare"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-md text-sm bg-brand-bg border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all"
              />
            </div>
            {errors.title && <p className="text-[10px] text-brand-expense mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Category Selector Grid - Premium Replacement for dropdowns */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">
              Select Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
              {filteredCategories.map((cat) => {
                const CatIcon = getCategoryIcon(cat.name);
                const isSelected = categoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoryId(cat.id);
                      setErrors((prev) => ({ ...prev, categoryId: "" }));
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all border ${
                      isSelected
                        ? type === "INCOME"
                          ? "bg-brand-success/15 border-brand-success text-brand-success"
                          : "bg-brand-expense/15 border-brand-expense text-brand-expense"
                        : "bg-brand-bg border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-border"
                    }`}
                  >
                    <CatIcon size={13} />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
            {errors.categoryId && <p className="text-[10px] text-brand-expense mt-1 font-medium">{errors.categoryId}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                <Calendar size={14} />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrors((prev) => ({ ...prev, date: "" }));
                }}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-md text-sm bg-brand-bg border border-brand-border text-brand-text focus:border-brand-accent focus:outline-none transition-all"
              />
            </div>
            {errors.date && <p className="text-[10px] text-brand-expense mt-1 font-medium">{errors.date}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record details..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-md text-sm bg-brand-bg border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5 flex items-center gap-1.5">
              <TagIcon size={12} /> Tags
            </label>
            <div className="flex flex-col gap-2">
              {availableTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase transition-all border ${
                        selectedTagIds.includes(tag.id)
                          ? "bg-brand-accent/20 border-brand-accent/40 text-brand-accent"
                          : "bg-brand-bg border-brand-border text-brand-muted hover:text-brand-text"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateTag();
                    }
                  }}
                  placeholder="New tag..."
                  className="flex-1 px-3 py-1.5 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim()}
                  className="p-1.5 rounded-md bg-brand-bg border border-brand-border text-brand-muted hover:text-brand-accent hover:border-brand-accent/30 disabled:opacity-50 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Recurring */}
          <div className="p-3 rounded-lg border border-brand-border bg-brand-bg/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-text flex items-center gap-1.5">
                <Repeat size={14} className="text-brand-accent" /> Make Recurring
              </label>
              <div
                className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${
                  isRecurring ? "bg-brand-accent" : "bg-brand-border"
                }`}
                onClick={() => setIsRecurring(!isRecurring)}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full transition-transform ${
                    isRecurring ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
            {isRecurring && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-brand-border/50">
                {(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as RecurringInterval[]).map((interval) => (
                  <button
                    key={interval}
                    type="button"
                    onClick={() => setRecurringInterval(interval)}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                      recurringInterval === interval
                        ? "bg-brand-accent text-white shadow-sm shadow-brand-accent/20"
                        : "bg-brand-bg text-brand-muted border border-brand-border hover:text-brand-text"
                    }`}
                  >
                    {interval}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-brand-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md text-xs font-bold bg-brand-muted/10 text-brand-muted hover:text-brand-text hover:bg-brand-muted/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-md text-xs font-bold bg-brand-text text-brand-bg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update entry"
              ) : (
                "Log entry"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
