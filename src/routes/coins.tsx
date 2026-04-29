import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, CoinLink, CoinAvatar, DualSparkline, FooterBrand, coins, type Coin } from "@/components/shell";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/coins")({
  head: () => ({
    meta: [
      { title: "自选 · CryptOracle 加密市场数据库" },
      { name: "description", content: "讨论占有率、币种发现与自选币种总览，含情绪、KOL、社区指标。" },
      { property: "og:title", content: "自选 · CryptOracle" },
      { property: "og:description", content: "板块讨论占有率、币种发现与自选币种多维数据面板。" },
    ],
  }),
  component: CoinsPage,
});

function CoinsPage() {
  const [watchlist, setWatchlist] = useState<string[]>(coins.map((c) => c.symbol));
  const toggleWatch = (sym: string) =>
    setWatchlist((prev) => (prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]));
  return (
    <PageShell>
      <h1 className="sr-only">自选</h1>
      <MindshareSection />
      <WatchlistSection watchlist={watchlist} onToggle={toggleWatch} />
      <DiscoverSection watchlist={watchlist} onToggle={toggleWatch} />
      <FooterBrand />
    </PageShell>
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

/* ============== 发现 ============== */
const DISCOVER_TABS = ["热度榜", "提及榜", "情绪榜", "涨幅榜", "跌幅榜", "新上线"] as const;
type DiscoverTab = (typeof DISCOVER_TABS)[number];

type DiscoverRow = {
  symbol: string;
  name: string;
  avatar: Coin["avatar"];
  heat: number;
  mentions: number;
  sentiment: number; // 0-100
  price: number;
  change: number; // %
  rankShift: number; // +up / -down
  isNew?: boolean;
  trend: number[];
};

const discoverPool: DiscoverRow[] = [
  { symbol: "BTC", name: "Bitcoin", avatar: "warning", heat: 98.7, mentions: 184000, sentiment: 78, price: 77970, change: 2.34, rankShift: 0, trend: [1, 2, 1.5, 2.4, 2.8, 3.2, 3.6] },
  { symbol: "ETH", name: "Ethereum", avatar: "signal", heat: 94.2, mentions: 142000, sentiment: 64, price: 3521, change: -1.28, rankShift: -1, trend: [3, 2.7, 2.9, 2.4, 2.1, 2.0, 1.8] },
  { symbol: "SOL", name: "Solana", avatar: "primary", heat: 89.5, mentions: 121000, sentiment: 81, price: 178.5, change: 5.67, rankShift: 2, trend: [1, 1.4, 1.8, 2.2, 2.6, 3.1, 3.8] },
  { symbol: "BNB", name: "BNB", avatar: "secondary", heat: 82.1, mentions: 78000, sentiment: 52, price: 612, change: -5.67, rankShift: -2, trend: [3, 2.9, 2.6, 2.3, 2.0, 1.7, 1.4] },
  { symbol: "XRP", name: "Ripple", avatar: "positive", heat: 76.8, mentions: 65000, sentiment: 71, price: 0.62, change: 12.11, rankShift: 4, trend: [1, 1.6, 2.0, 2.5, 3.1, 3.6, 4.2] },
  { symbol: "WIF", name: "dogwifhat", avatar: "negative", heat: 71.2, mentions: 58000, sentiment: 69, price: 2.85, change: 12.45, rankShift: 6, isNew: true, trend: [0.5, 1.2, 1.8, 2.4, 3.0, 3.6, 4.0] },
  { symbol: "JUP", name: "Jupiter", avatar: "positive", heat: 64.0, mentions: 42000, sentiment: 47, price: 1.23, change: -3.21, rankShift: -3, isNew: true, trend: [2.5, 2.3, 2.0, 1.8, 1.5, 1.4, 1.2] },
  { symbol: "STRK", name: "Starknet", avatar: "primary", heat: 61.5, mentions: 38000, sentiment: 58, price: 1.87, change: 8.92, rankShift: 1, isNew: true, trend: [1, 1.4, 1.5, 2.0, 2.4, 2.7, 3.1] },
];

function sortByTab(tab: DiscoverTab, rows: DiscoverRow[]): DiscoverRow[] {
  const r = [...rows];
  switch (tab) {
    case "热度榜": return r.sort((a, b) => b.heat - a.heat);
    case "提及榜": return r.sort((a, b) => b.mentions - a.mentions);
    case "情绪榜": return r.sort((a, b) => b.sentiment - a.sentiment);
    case "涨幅榜": return r.sort((a, b) => b.change - a.change);
    case "跌幅榜": return r.sort((a, b) => a.change - b.change);
    case "新上线": return r.filter((x) => x.isNew).sort((a, b) => b.heat - a.heat);
  }
}

const SORT_FIELDS = [
  { key: "heat", label: "热度", min: 0, max: 100, step: 1, suffix: "" },
  { key: "mentions", label: "提及", min: 0, max: 200000, step: 1000, suffix: "" },
  { key: "sentiment", label: "情绪", min: 0, max: 100, step: 1, suffix: "" },
  { key: "change", label: "涨跌幅", min: -20, max: 20, step: 0.5, suffix: "%" },
  { key: "price", label: "价格", min: 0, max: 100000, step: 100, suffix: "$" },
] as const;
type SortKey = (typeof SORT_FIELDS)[number]["key"];
type FilterMap = Partial<Record<SortKey, { min: number; max: number }>>;

function DiscoverSection() {
  const [tab, setTab] = useState<DiscoverTab>("热度榜");
  const [openCustom, setOpenCustom] = useState(false);
  const [customSort, setCustomSort] = useState<SortKey | null>(null);
  const [customDir, setCustomDir] = useState<"desc" | "asc">("desc");
  const [filters, setFilters] = useState<FilterMap>({});

  const activeFilterCount = Object.keys(filters).length;

  const rows = useMemo(() => {
    let r = sortByTab(tab, discoverPool);
    (Object.keys(filters) as SortKey[]).forEach((k) => {
      const f = filters[k]!;
      r = r.filter((x) => {
        const v = x[k] as number;
        return v >= f.min && v <= f.max;
      });
    });
    if (customSort) {
      r = [...r].sort((a, b) => {
        const va = a[customSort] as number;
        const vb = b[customSort] as number;
        return customDir === "desc" ? vb - va : va - vb;
      });
    }
    return r;
  }, [tab, customSort, customDir, filters]);

  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-base font-black tracking-tight">发现</h2>
        <button
          onClick={() => setOpenCustom(true)}
          className="flex items-center gap-1 rounded-full border border-primary/60 bg-primary/10 px-2.5 py-1 text-[10.5px] font-bold text-primary"
        >
          自定义
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-[9.5px] font-black text-primary-foreground">{activeFilterCount}</span>
          )}
        </button>
      </div>

      <div className="mb-2 -mx-3.5 overflow-x-auto px-3.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-1.5">
          {DISCOVER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                t === tab ? "bg-primary text-primary-foreground" : "border border-panel-border bg-background/50 text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {(activeFilterCount > 0 || customSort) && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {customSort && (
            <span className="rounded-full border border-primary/50 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              排序：{SORT_FIELDS.find((f) => f.key === customSort)?.label} {customDir === "desc" ? "↓" : "↑"}
            </span>
          )}
          {(Object.keys(filters) as SortKey[]).map((k) => {
            const f = SORT_FIELDS.find((s) => s.key === k)!;
            const v = filters[k]!;
            return (
              <span key={k} className="flex items-center gap-1 rounded-full border border-panel-border bg-background/60 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                {f.label} {f.suffix}{v.min}~{f.suffix}{v.max}
                <button
                  onClick={() => setFilters((p) => { const n = { ...p }; delete n[k]; return n; })}
                  className="text-negative"
                >✕</button>
              </span>
            );
          })}
          <button
            onClick={() => { setFilters({}); setCustomSort(null); }}
            className="text-[10px] font-bold text-muted-foreground underline"
          >清除全部</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-panel-border bg-background/45">
        <table className="w-full text-left text-[11.5px]">
          <thead className="text-[9.5px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 font-bold">排名</th>
              <th className="px-2 py-1.5 font-bold">币种</th>
              <th className="px-2 py-1.5 font-bold">热度</th>
              <th className="px-2 py-1.5 font-bold">价格</th>
              <th className="px-2 py-1.5 text-right font-bold">趋势</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.symbol} className="border-t border-panel-border/60">
                <td className="px-2 py-1.5">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[11px] font-black">{i + 1}</span>
                    <RankShift n={r.rankShift} />
                  </div>
                </td>
                <td className="px-2 py-1.5">
                  <CoinLink symbol={r.symbol} className="flex items-center gap-1.5">
                    <CoinAvatar symbol={r.symbol} tone={r.avatar} small />
                    <span className="leading-tight">
                      <b className="block text-[12px]">{r.symbol}</b>
                      <span className="block text-[9.5px] text-muted-foreground">{r.name}</span>
                    </span>
                  </CoinLink>
                </td>
                <td className="px-2 py-1.5 font-mono font-black text-primary">{r.heat.toFixed(1)}</td>
                <td className="px-2 py-1.5">
                  <div className="leading-tight">
                    <b className="block font-mono">${formatPrice(r.price)}</b>
                    <span className={`block font-mono text-[10px] font-bold ${r.change >= 0 ? "text-positive" : "text-negative"}`}>
                      {r.change >= 0 ? "+" : ""}{r.change.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1.5">
                  <div className="ml-auto w-16">
                    <Trendline data={r.trend} up={r.change >= 0} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-2 py-4 text-center text-[11px] text-muted-foreground">暂无符合条件的数据</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {openCustom && (
        <CustomSortDialog
          sortKey={customSort}
          dir={customDir}
          filters={filters}
          onApply={(k, d, f) => { setCustomSort(k); setCustomDir(d); setFilters(f); }}
          onClose={() => setOpenCustom(false)}
        />
      )}
    </section>
  );
}

function formatPrice(p: number) {
  if (p >= 1000) return p.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (p >= 1) return p.toFixed(2);
  return p.toFixed(4);
}

function RankShift({ n }: { n: number }) {
  if (n === 0) return <span className="text-[9px] text-muted-foreground">—</span>;
  const up = n > 0;
  return (
    <span className={`flex items-center text-[9px] font-bold ${up ? "text-positive" : "text-negative"}`}>
      {up ? "▲" : "▼"}{Math.abs(n)}
    </span>
  );
}

function Trendline({ data, up }: { data: number[]; up: boolean }) {
  const w = 64, h = 22;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const color = up ? "oklch(0.74 0.18 150)" : "oklch(0.68 0.22 25)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-5 w-full">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
    </svg>
  );
}

function CustomSortDialog({
  sortKey, dir, filters, onApply, onClose,
}: {
  sortKey: SortKey | null;
  dir: "desc" | "asc";
  filters: FilterMap;
  onApply: (k: SortKey | null, d: "desc" | "asc", f: FilterMap) => void;
  onClose: () => void;
}) {
  const [k, setK] = useState<SortKey | null>(sortKey);
  const [d, setD] = useState<"desc" | "asc">(dir);
  const [f, setF] = useState<FilterMap>(filters);

  const toggleFilter = (key: SortKey) => {
    setF((prev) => {
      const n = { ...prev };
      if (n[key]) {
        delete n[key];
      } else {
        const meta = SORT_FIELDS.find((s) => s.key === key)!;
        n[key] = { min: meta.min, max: meta.max };
      }
      return n;
    });
  };

  const updateRange = (key: SortKey, which: "min" | "max", v: number) => {
    setF((prev) => {
      const cur = prev[key];
      if (!cur) return prev;
      return { ...prev, [key]: { ...cur, [which]: v } };
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 px-3 pb-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-[400px] overflow-y-auto rounded-2xl border border-panel-border bg-panel p-4 shadow-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-black">自定义排序 / 多条件筛选</h3>
          <button onClick={onClose} className="text-muted-foreground">✕</button>
        </div>

        <p className="mb-1.5 text-[10.5px] font-bold text-muted-foreground">排序指标（单选）</p>
        <div className="mb-3 grid grid-cols-3 gap-1.5">
          {SORT_FIELDS.map((field) => (
            <button
              key={field.key}
              onClick={() => setK(k === field.key ? null : field.key)}
              className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${
                k === field.key ? "bg-primary text-primary-foreground" : "border border-panel-border bg-background/50 text-muted-foreground"
              }`}
            >
              {field.label}
            </button>
          ))}
        </div>

        <p className="mb-1.5 text-[10.5px] font-bold text-muted-foreground">方向</p>
        <div className="mb-3 grid grid-cols-2 gap-1.5">
          <button onClick={() => setD("desc")} className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${d === "desc" ? "bg-primary text-primary-foreground" : "border border-panel-border bg-background/50 text-muted-foreground"}`}>降序 ↓</button>
          <button onClick={() => setD("asc")} className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${d === "asc" ? "bg-primary text-primary-foreground" : "border border-panel-border bg-background/50 text-muted-foreground"}`}>升序 ↑</button>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10.5px] font-bold text-muted-foreground">筛选条件（可多选）</p>
          <span className="text-[9.5px] text-muted-foreground">已启用 {Object.keys(f).length}</span>
        </div>
        <div className="mb-3 space-y-2">
          {SORT_FIELDS.map((field) => {
            const enabled = !!f[field.key];
            const cur = f[field.key];
            return (
              <div key={field.key} className={`rounded-lg border p-2 transition ${enabled ? "border-primary/60 bg-primary/5" : "border-panel-border bg-background/40"}`}>
                <button
                  onClick={() => toggleFilter(field.key)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-[11px] font-bold">{field.label}</span>
                  <span className={`flex h-4 w-4 items-center justify-center rounded border text-[9px] font-black ${enabled ? "border-primary bg-primary text-primary-foreground" : "border-panel-border text-muted-foreground"}`}>
                    {enabled ? "✓" : ""}
                  </span>
                </button>
                {enabled && cur && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 text-[9.5px] font-bold text-muted-foreground">最小</span>
                      <input
                        type="range"
                        min={field.min} max={field.max} step={field.step}
                        value={cur.min}
                        onChange={(e) => updateRange(field.key, "min", Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="w-14 text-right font-mono text-[10px] font-bold text-primary">{field.suffix}{cur.min}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-7 text-[9.5px] font-bold text-muted-foreground">最大</span>
                      <input
                        type="range"
                        min={field.min} max={field.max} step={field.step}
                        value={cur.max}
                        onChange={(e) => updateRange(field.key, "max", Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="w-14 text-right font-mono text-[10px] font-bold text-primary">{field.suffix}{cur.max}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setK(null); setD("desc"); setF({}); }} className="flex-1 rounded-lg border border-panel-border py-2 text-[12px] font-bold text-muted-foreground">重置</button>
          <button onClick={() => { onApply(k, d, f); onClose(); }} className="flex-1 rounded-lg bg-primary py-2 text-[12px] font-black text-primary-foreground">应用筛选</button>
        </div>
      </div>
    </div>
  );
}

/* ============== 自选 ============== */
function WatchlistSection() {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-base font-black tracking-tight">自选</h2>
        <span className="text-[10px] font-bold text-muted-foreground">← 左右滑动查看更多 →</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-panel-border bg-background/45">
        <div className="relative">
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-0 text-left text-[11.5px]" style={{ minWidth: 720 }}>
              <thead className="text-[9.5px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="sticky left-0 z-10 w-[112px] bg-panel px-2 py-2 font-bold shadow-[2px_0_0_0_hsl(var(--border))]">币种</th>
                  <th className="px-2.5 py-2 font-bold">热度</th>
                  <th className="px-2.5 py-2 font-bold">价格</th>
                  <th className="px-2.5 py-2 font-bold">market & sentiment</th>
                  <th className="px-2.5 py-2 font-bold">KOLS 24h/7d</th>
                  <th className="px-2.5 py-2 font-bold">popular 24h/7d</th>
                  <th className="px-2.5 py-2 font-bold">communities 24h/7d</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin) => (
                  <tr key={coin.symbol} className="border-t border-panel-border/60">
                    <td className="sticky left-0 z-10 w-[112px] bg-panel px-2 py-1.5 shadow-[2px_0_0_0_hsl(var(--border))]">
                      <CoinLink symbol={coin.symbol} className="flex items-center gap-1.5">
                        <CoinAvatar symbol={coin.symbol} tone={coin.avatar} small />
                        <span className="min-w-0 leading-tight">
                          <b className="block truncate text-[12px]">{coin.symbol}</b>
                          <span className="block truncate text-[9.5px] text-muted-foreground">{coin.name}</span>
                        </span>
                      </CoinLink>
                    </td>
                    <td className="px-2.5 py-1.5 font-mono font-black text-primary">{coin.heat}</td>
                    <td className="px-2.5 py-1.5">
                      <div className="leading-tight">
                        <b className="block font-mono">{coin.price}</b>
                        <span className={`block font-mono text-[10px] font-bold ${coin.tone === "up" ? "text-positive" : "text-negative"}`}>{coin.change}</span>
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5"><DualSparkline /></td>
                    <td className="px-2.5 py-1.5 font-mono"><b>{coin.kol24}</b><span className="text-muted-foreground"> / {coin.kol7}</span></td>
                    <td className="px-2.5 py-1.5 font-mono"><b>{coin.popular24}</b><span className="text-muted-foreground"> / {coin.popular7}</span></td>
                    <td className="px-2.5 py-1.5 font-mono"><b>{coin.communities24}</b><span className="text-muted-foreground"> / {coin.communities7}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
