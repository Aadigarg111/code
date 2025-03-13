import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { date: "Mon", commits: 4 },
  { date: "Tue", commits: 3 },
  { date: "Wed", commits: 7 },
  { date: "Thu", commits: 5 },
  { date: "Fri", commits: 6 },
  { date: "Sat", commits: 2 },
  { date: "Sun", commits: 8 },
];

export function ProgressChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="commits"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
