import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/shell";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/insight")({
  head: () => ({
    meta: [
      { title: "行情 · CryptOracle 加密市场数据库" },
      { name: "description", content: "AI 报告、交易机会与关键市场指标，量化决策必读。" },
      { property: "og:title", content: "行情 · CryptOracle" },
      { property: "og:description", content: "AI 报告、异动交易机会与关键市场指标。" },
    ],
  }),
  component: InsightPage,
});

function InsightPage() {
  return (
    <PageShell>
      <h1 className="sr-only">行情</h1>
      <AiReport />
      <MindshareSection />
      <TradingOpportunities />
      <InsightMetrics />
    </PageShell>
  );
}

function AiReport() {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <h2 className="mb-2.5 text-base font-black tracking-tight">AI 报告</h2>
      <div className="mb-3 grid grid-cols-3 rounded-xl border border-panel-border bg-background/40 p-1 text-center text-[11px] font-bold">
        <span className="rounded-lg bg-primary px-2 py-1.5 text-primary-foreground">市场情绪</span>
        <span className="px-2 py-1.5 text-muted-foreground">社交数据</span>
        <span className="px-2 py-1.5 text-muted-foreground">KOL 洞察</span>
      </div>
      <p className="text-[12.5px] leading-6 text-muted-foreground">
        CO10 情绪扩散速度高于价格动量，短周期风险偏好回升。BTC 与 SOL 的社群提及量同步上升，但 KOL 观点分歧扩大，适合以波动率与热度背离作为观察因子。
      </p>
    </section>
  );
}

type TF = "1h" | "4h" | "24h" | "7d";

type Opportunity = {
  symbol: string;
  name: string;
  factor: string;
  delta: number; // % change of factor
  price: number;
  priceChg: number; // %
  tf: TF;
};

const ALL_OPPS: Opportunity[] = [
  { symbol: "SOL", name: "Solana", factor: "社交热度", delta: 184, price: 198.4, priceChg: 6.2, tf: "1h" },
  { symbol: "PEPE", name: "Pepe", factor: "KOL 提及", delta: 312, price: 0.0000123, priceChg: 18.4, tf: "1h" },
  { symbol: "ARB", name: "Arbitrum", factor: "情绪转负", delta: -67, price: 0.78, priceChg: -4.1, tf: "1h" },
  { symbol: "ETH", name: "Ethereum", factor: "巨鲸流入", delta: 92, price: 3420, priceChg: 2.8, tf: "4h" },
  { symbol: "DOGE", name: "Dogecoin", factor: "社群活跃", delta: 145, price: 0.142, priceChg: 9.6, tf: "4h" },
  { symbol: "SUI", name: "Sui", factor: "开发活跃", delta: 78, price: 1.84, priceChg: 5.1, tf: "24h" },
  { symbol: "BTC", name: "Bitcoin", factor: "情绪反转", delta: 56, price: 68420, priceChg: 3.2, tf: "24h" },
  { symbol: "AVAX", name: "Avalanche", factor: "热度暴跌", delta: -82, price: 28.4, priceChg: -7.4, tf: "24h" },
  { symbol: "LINK", name: "Chainlink", factor: "KOL 看多", delta: 124, price: 14.8, priceChg: 11.2, tf: "7d" },
  { symbol: "TON", name: "Toncoin", factor: "社群增长", delta: 218, price: 6.42, priceChg: 24.5, tf: "7d" },
  { symbol: "OP", name: "Optimism", factor: "情绪走弱", delta: -54, price: 1.92, priceChg: -8.7, tf: "7d" },
];

const TFS: TF[] = ["1h", "4h", "24h", "7d"];

function TradingOpportunities() {
  const [tf, setTf] = useState<TF>("24h");
  const list = ALL_OPPS.filter((o) => o.tf === tf);

  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-base font-black tracking-tight">交易机会</h2>
        <div className="flex gap-1 rounded-lg border border-panel-border bg-background/40 p-0.5 text-[10.5px] font-bold">
          {TFS.map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={`rounded-md px-2 py-1 transition-colors ${
                tf === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-[10.5px] text-muted-foreground">{tf} 内指标出现大幅异动的币种</p>
      <div className="divide-y divide-panel-border">
        {list.map((o) => {
          const up = o.delta >= 0;
          const priceUp = o.priceChg >= 0;
          return (
            <Link
              key={o.symbol + o.factor}
              to="/coin/$symbol"
              params={{ symbol: o.symbol }}
              className="flex items-center gap-2.5 py-2 transition-colors hover:bg-elevated/50"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-elevated text-[10px] font-black">
                {o.symbol.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] font-black">{o.symbol}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9.5px] font-bold ${
                      up ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"
                    }`}
                  >
                    {o.factor} {up ? "↑" : "↓"}
                    {Math.abs(o.delta)}%
                  </span>
                </div>
                <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{o.name}</div>
              </div>
              <div className="text-right">
                <div className="text-[11.5px] font-bold tabular-nums">${o.price.toLocaleString()}</div>
                <div
                  className={`text-[10px] font-bold tabular-nums ${
                    priceUp ? "text-positive" : "text-negative"
                  }`}
                >
                  {priceUp ? "+" : ""}
                  {o.priceChg}%
                </div>
              </div>
            </Link>
          );
        })}
        {list.length === 0 && (
          <div className="py-6 text-center text-[11px] text-muted-foreground">该时段暂无显著异动</div>
        )}
      </div>
    </section>
  );
}

function InsightMetrics() {
  const metrics: Array<[string, number]> = [["CO-A-05-01", 92], ["CO-A-04-02", 76], ["CO-B-03-01", 61], ["CO-B-05-02", 48]];
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <h2 className="mb-2.5 text-[13px] font-black tracking-tight">高频标签</h2>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-primary/60 bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">CO-B-03-01</span>
            <span className="rounded-full border border-signal/60 bg-signal/15 px-2.5 py-1 text-[11px] font-bold text-signal">CO-B-05-02</span>
          </div>
        </div>
        <div>
          <h2 className="mb-2.5 text-[13px] font-black tracking-tight">关键市场指标</h2>
          <div className="space-y-2">
            {metrics.map(([label, value]) => (
              <div key={label}>
                <div className="mb-0.5 flex justify-between text-[10px] text-muted-foreground"><span>{label}</span><span>{value}</span></div>
                <div className="h-1.5 rounded-full bg-elevated"><div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
