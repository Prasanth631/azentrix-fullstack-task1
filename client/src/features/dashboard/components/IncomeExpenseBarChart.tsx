import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MonthlyTrend } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils";

interface IncomeExpenseBarChartProps {
  data: MonthlyTrend[];
  isLoading: boolean;
}

export default function IncomeExpenseBarChart({
  data,
  isLoading,
}: IncomeExpenseBarChartProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 h-[380px] skeleton" />
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-6 bg-brand-card/40 border border-brand-border backdrop-blur-md h-[380px] flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-brand-text">CASHFLOW VELOCITY</h3>
          <p className="text-[11px] text-brand-muted font-light mb-6">
            Comparative analysis of monthly earnings vs burn rates.
          </p>
        </div>
        <div className="flex items-center justify-center h-48">
          <p className="text-xs text-brand-muted font-light">
            No transaction records found. Log income/expenses to populate charts.
          </p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-4 py-3 rounded-md shadow-xl text-xs bg-brand-card border border-brand-border backdrop-blur-md"
        >
          <p className="font-bold text-brand-text mb-2">
            {label}
          </p>
          {payload.map((item: any) => (
            <p key={item.name} className="font-semibold" style={{ color: item.color }}>
              {item.name}: {formatCurrency(item.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 bg-brand-card/40 border border-brand-border backdrop-blur-md flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-semibold tracking-wide text-brand-text">CASHFLOW VELOCITY</h3>
        <p className="text-[11px] text-brand-muted font-light mb-6">
          Comparative analysis of monthly earnings vs burn rates.
        </p>
      </div>

      <div className="flex-1 w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-color)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--text-secondary)", fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: "var(--border-color)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border-color)", opacity: 0.3 }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider pl-1 pr-3">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="var(--income-color)"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="var(--expense-color)"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
