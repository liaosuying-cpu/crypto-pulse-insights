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

/* ============== 讨论占有率（按币种） ============== */
const MIND_COINS = [
  { key: "btc", label: "BTC", color: "oklch(0.78 0.17 60)" },
  { key: "eth", label: "ETH", color: "oklch(0.72 0.14 230)" },
  { key: "sol", label: "SOL", color: "oklch(0.72 0.18 280)" },
  { key: "doge", label: "DOGE", color: "oklch(0.78 0.19 25)" },
  { key: "pepe", label: "PEPE", color: "oklch(0.74 0.16 145)" },
  { key: "others", label: "其他", color: "oklch(0.55 0.02 250)" },
] as const;

const mindshareData = [
  { t: "00:00", btc: 30, eth: 22, sol: 14, doge: 12, pepe: 10, others: 12 },
  { t: "04:00", btc: 29, eth: 22, sol: 16, doge: 11, pepe: 11, others: 11 },
  { t: "08:00", btc: 28, eth: 21, sol: 18, doge: 10, pepe: 12, others: 11 },
  { t: "12:00", btc: 27, eth: 20, sol: 21, doge: 9, pepe: 12, others: 11 },
  { t: "16:00", btc: 26, eth: 20, sol: 23, doge: 8, pepe: 13, others: 10 },
  { t: "20:00", btc: 25, eth: 19, sol: 26, doge: 7, pepe: 13, others: 10 },
  { t: "现在", btc: 24, eth: 19, sol: 28, doge: 7, pepe: 12, others: 10 },
];

const sentimentRows = [
  { sector: "BTC", share: "24%", delta: "-6.0%", bull: 68, deltaTone: "down" as const },
  { sector: "ETH", share: "19%", delta: "-3.0%", bull: 61, deltaTone: "down" as const },
  { sector: "SOL", share: "28%", delta: "+14.0%", bull: 81, deltaTone: "up" as const },
  { sector: "DOGE", share: "7%", delta: "-5.0%", bull: 47, deltaTone: "down" as const },
  { sector: "PEPE", share: "12%", delta: "+2.0%", bull: 54, deltaTone: "up" as const },
  { sector: "其他", share: "10%", delta: "-2.0%", bull: 55, deltaTone: "down" as const },
];

function MindshareSection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <h2 className="text-base font-black tracking-tight">讨论占有率</h2>
          <p className="mt-0.5 text-[10.5px] leading-tight text-muted-foreground">全网加密讨论 · 币种占比 · 24h（SOL 正在挤压 BTC）</p>
        </div>
        <span className="rounded-full border border-positive/50 bg-positive/10 px-2 py-0.5 text-[10px] font-bold text-positive">SOL ↑ 14.0%</span>
      </div>

      <div className="mb-2 flex flex-wrap gap-x-2.5 gap-y-1">
        {MIND_COINS.map((s) => (
          <span key={s.key} className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
            <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className={`${expanded ? "h-[150px]" : "h-[80px]"} w-full transition-all`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mindshareData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} stackOffset="expand">
            <defs>
              {MIND_COINS.map((s) => (
                <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.55} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="t" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={false} axisLine={false} tickLine={false} width={0} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11, padding: "6px 8px" }}
              formatter={(v: number, n: string) => [`${(v * 100).toFixed(1)}%`, n.toUpperCase()]}
            />
            {MIND_COINS.map((s) => (
              <Area key={s.key} type="monotone" dataKey={s.key} stackId="1" stroke={s.color} strokeWidth={1} fill={`url(#g-${s.key})`} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {expanded && (
        <div className="mt-2.5 overflow-hidden rounded-xl border border-panel-border bg-background/45">
          <table className="w-full text-left text-[11px]">
            <thead className="text-[9.5px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-2.5 py-1.5 font-bold">板块</th>
                <th className="px-2 py-1.5 font-bold">占比</th>
                <th className="px-2 py-1.5 font-bold">24h Δ</th>
                <th className="px-2.5 py-1.5 font-bold">好/坏名声</th>
              </tr>
            </thead>
            <tbody>
              {sentimentRows.map((r) => (
                <tr key={r.sector} className="border-t border-panel-border/60">
                  <td className="px-2.5 py-1.5 font-bold">{r.sector}</td>
                  <td className="px-2 py-1.5 font-mono font-black text-primary">{r.share}</td>
                  <td className={`px-2 py-1.5 font-mono font-bold ${r.deltaTone === "up" ? "text-positive" : "text-negative"}`}>{r.delta}</td>
                  <td className="px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-negative/30">
                        <div className="absolute inset-y-0 left-0 rounded-full bg-positive" style={{ width: `${r.bull}%` }} />
                      </div>
                      <span className="w-12 text-right font-mono text-[10px] font-bold">
                        <span className="text-positive">{r.bull}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-negative">{100 - r.bull}</span>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-panel-border bg-background/40 py-1 text-[10.5px] font-bold text-muted-foreground"
      >
        {expanded ? "收起 ▲" : "展开详情 ▼"}
      </button>
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
