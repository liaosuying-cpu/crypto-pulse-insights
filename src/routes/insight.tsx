import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, CoinAvatar } from "@/components/shell";
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
      <ReportsSection />
      <MindshareSection />
      <InsightMetrics />
    </PageShell>
  );
}

/* ────────────── 行研机构报告栏 ────────────── */
type Report = {
  org: string;
  orgTone: "primary" | "signal" | "warning" | "positive" | "negative" | "secondary";
  title: string;
  summary: string;
  tag: string;
  rating: "看多" | "看空" | "中性";
  time: string;
  pages: number;
};

const REPORT_CATS = ["全部", "宏观", "板块", "项目", "链上"] as const;
type ReportCat = (typeof REPORT_CATS)[number];

const reports: (Report & { cat: ReportCat })[] = [
  { cat: "宏观", org: "Coinbase Research", orgTone: "primary", title: "Q4 加密市场展望:降息周期下的资金再配置", summary: "降息预期叠加 ETF 持续流入,BTC 或测试 9 万美元关键阻力,ETH/BTC 汇率有望企稳。", tag: "宏观策略", rating: "看多", time: "2 小时前", pages: 24 },
  { cat: "板块", org: "Messari", orgTone: "signal", title: "AI × Crypto 赛道深度:从算力到 Agent 的价值捕获", summary: "推理算力网络正在替代训练叙事,关注具备真实付费用户的协议。", tag: "AI 赛道", rating: "看多", time: "今日 09:30", pages: 38 },
  { cat: "项目", org: "Galaxy Digital", orgTone: "warning", title: "Solana 生态半年报:DEX 份额突破 45%", summary: "Solana 月活地址环比 +28%,但 MEV 与拥堵问题仍是中期隐忧。", tag: "Solana", rating: "中性", time: "昨日", pages: 32 },
  { cat: "链上", org: "Glassnode", orgTone: "positive", title: "BTC 链上数据周报:长期持有者再次进入分发期", summary: "LTH 净仓位变化指标转负,历史上对应中期回调风险上升。", tag: "链上数据", rating: "看空", time: "昨日", pages: 16 },
  { cat: "板块", org: "Delphi Digital", orgTone: "negative", title: "Meme 板块流动性研究:轮动节奏正在变快", summary: "Meme Mindshare 占比从 22% 回落至 13%,资金正在流向 RWA 与 AI。", tag: "Meme", rating: "看空", time: "2 天前", pages: 21 },
  { cat: "宏观", org: "Bitwise", orgTone: "secondary", title: "ETF 资金流向月报:机构配置比例持续抬升", summary: "10 家头部 ETF 累计净流入 132 亿美元,养老金账户占比首次突破 8%。", tag: "ETF", rating: "看多", time: "3 天前", pages: 18 },
];

function ratingBadge(r: Report["rating"]) {
  if (r === "看多") return "bg-positive/15 text-positive";
  if (r === "看空") return "bg-negative/15 text-negative";
  return "bg-elevated text-muted-foreground";
}

function ReportsSection() {
  const [cat, setCat] = useState<ReportCat>("全部");
  const list = cat === "全部" ? reports : reports.filter((r) => r.cat === cat);
  return (
    <section className="overflow-hidden rounded-2xl border border-panel-border bg-panel shadow-panel">
      <div className="flex items-center justify-between px-3.5 pb-1.5 pt-2.5">
        <div>
          <h2 className="text-[13px] font-black tracking-tight">行研机构报告</h2>
          <p className="mt-0.5 text-[10px] text-muted-foreground">来自全球头部研究机构 · 实时同步</p>
        </div>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9.5px] font-black text-primary">{reports.length} 篇</span>
      </div>
      <div className="thin-scrollbar flex gap-1 overflow-x-auto px-3 pb-2 text-[11px] font-black">
        {REPORT_CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-2.5 py-1 transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-elevated text-muted-foreground"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-panel-border/70 border-t border-panel-border">
        {list.map((r) => (
          <li key={r.title} className="px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <CoinAvatar symbol={r.org} tone={r.orgTone} small />
              <b className="truncate text-[11px] text-foreground">{r.org}</b>
              <span className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-black ${ratingBadge(r.rating)}`}>{r.rating}</span>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[12.5px] font-bold leading-snug text-foreground">{r.title}</p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{r.summary}</p>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="rounded bg-elevated px-1.5 py-0.5 font-black text-primary">{r.tag}</span>
              <span>{r.pages} 页</span>
              <span>·</span>
              <span>{r.time}</span>
              <span className="ml-auto font-black text-primary">阅读 →</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
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
