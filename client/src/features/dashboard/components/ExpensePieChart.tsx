import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ExpenseBreakdown } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils";

interface ExpensePieChartProps {
  data: ExpenseBreakdown[];
  isLoading: boolean;
}

const COLORS = [
  "#6366F1",
  "#F43F5E",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#06B6D4",
  "#84CC16",
];

export default function ExpensePieChart({ data, isLoading }: ExpensePieChartProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-5 w-48 mb-6" />
        <div className="skeleton h-64 w-full rounded-md" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3
          className="text-lg font-semibold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Expense Breakdown
        </h3>
        <div className="flex items-center justify-center h-64">
          <p style={{ color: "var(--text-tertiary)" }}>
            No expense data yet. Start by adding transactions.
          </p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-4 py-3 rounded-md shadow-lg text-sm"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p className="font-medium" style={{ color: "var(--text-primary)" }}>
            {payload[0].name}
          </p>
          <p style={{ color: payload[0].payload.fill }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up delay-200" style={{ animationFillMode: "backwards" }}>
      <h3
        className="text-lg font-semibold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Expense Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="amount"
            nameKey="category"
            strokeWidth={0}
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
