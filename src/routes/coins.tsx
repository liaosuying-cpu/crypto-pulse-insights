import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, DataTable, StickyTh, StickyTd, CoinLink, CoinAvatar, DualSparkline, FooterBrand, coins, latest, type Coin } from "@/components/shell";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/coins")({
  head: () => ({
    meta: [
      { title: "币种 · CryptOracle 加密市场数据库" },
      { name: "description", content: "热门币种、最新上线与自选币种总览，含情绪、KOL、社区指标。" },
      { property: "og:title", content: "币种 · CryptOracle" },
      { property: "og:description", content: "自选币种与最新上线代币的多维数据面板。" },
    ],
  }),
  component: CoinsPage,
});

function CoinsPage() {
  return (
    <PageShell>
      <h1 className="sr-only">币种</h1>
      <MindshareSection />
      <CoinOverview />
      <WatchlistTable />
      <FooterBrand />
    </PageShell>
  );
}

const MIND_SECTORS = [
  { key: "ai", label: "AI", color: "oklch(0.72 0.18 280)" },
  { key: "meme", label: "Meme", color: "oklch(0.78 0.19 25)" },
  { key: "defi", label: "DeFi", color: "oklch(0.74 0.16 165)" },
  { key: "l1", label: "L1", color: "oklch(0.72 0.14 230)" },
  { key: "rwa", label: "RWA", color: "oklch(0.75 0.14 90)" },
] as const;

const mindshareData = [
  { t: "00:00", ai: 18, meme: 32, defi: 16, l1: 22, rwa: 12 },
  { t: "04:00", ai: 21, meme: 30, defi: 16, l1: 21, rwa: 12 },
  { t: "08:00", ai: 25, meme: 28, defi: 15, l1: 21, rwa: 11 },
  { t: "12:00", ai: 29, meme: 25, defi: 15, l1: 20, rwa: 11 },
  { t: "16:00", ai: 33, meme: 22, defi: 14, l1: 20, rwa: 11 },
  { t: "20:00", ai: 36, meme: 19, defi: 14, l1: 20, rwa: 11 },
  { t: "现在", ai: 38, meme: 17, defi: 14, l1: 20, rwa: 11 },
];

const sentimentRows = [
  { sector: "AI", share: "38%", delta: "+11.4%", bull: 72, deltaTone: "up" as const },
  { sector: "Meme", share: "17%", delta: "-15.0%", bull: 41, deltaTone: "down" as const },
  { sector: "DeFi", share: "14%", delta: "-2.1%", bull: 58, deltaTone: "down" as const },
  { sector: "L1", share: "20%", delta: "-1.0%", bull: 63, deltaTone: "down" as const },
  { sector: "RWA", share: "11%", delta: "-0.8%", bull: 67, deltaTone: "down" as const },
];

function MindshareSection() {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <h2 className="text-base font-black tracking-tight">处理币种 · Mindshare</h2>
          <p className="mt-0.5 text-[10.5px] leading-tight text-muted-foreground">心智占有率：AI 板块正在挤压 Meme · 24h</p>
        </div>
        <span className="rounded-full border border-positive/50 bg-positive/10 px-2 py-0.5 text-[10px] font-bold text-positive">AI ↑ 11.4%</span>
      </div>

      <div className="mb-2 flex flex-wrap gap-x-2.5 gap-y-1">
        {MIND_SECTORS.map((s) => (
          <span key={s.key} className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
            <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mindshareData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} stackOffset="expand">
            <defs>
              {MIND_SECTORS.map((s) => (
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
            {MIND_SECTORS.map((s) => (
              <Area key={s.key} type="monotone" dataKey={s.key} stackId="1" stroke={s.color} strokeWidth={1} fill={`url(#g-${s.key})`} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2.5 overflow-hidden rounded-xl border border-panel-border bg-background/45">
        <table className="w-full text-left text-[11px]">
          <thead className="text-[9.5px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-2.5 py-1.5 font-bold">板块</th>
              <th className="px-2 py-1.5 font-bold">占比</th>
              <th className="px-2 py-1.5 font-bold">24h Δ</th>
              <th className="px-2.5 py-1.5 font-bold">Bull / Bear</th>
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
    </section>
  );
}

function CoinOverview() {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-black tracking-tight">币种</h2>
        <Link to="/" className="rounded-full border border-primary/60 px-3 py-1 text-[11px] font-bold text-primary">显示更多</Link>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <MiniCoinTable title="热门币种" data={coins.slice(0, 3)} />
        <MiniCoinTable title="最新上线" data={latest} />
      </div>
    </section>
  );
}

function MiniCoinTable({ title, data }: { title: string; data: Array<{ rank: number; symbol: string; name?: string; price: string; change: string; tone: "up" | "down"; avatar: Coin["avatar"] }> }) {
  return (
    <div className="rounded-xl border border-panel-border bg-background/45 p-2.5">
      <h3 className="mb-2 text-[11px] font-black uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="space-y-2">
        {data.map((coin) => (
          <CoinLink key={coin.symbol} symbol={coin.symbol} className="grid grid-cols-[0.75rem_1.5rem_1fr] items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{coin.rank}</span>
            <CoinAvatar symbol={coin.symbol} tone={coin.avatar} small />
            <span className="min-w-0 text-right leading-tight">
              <b className="block truncate text-[12px]">{coin.symbol}</b>
              <span className="block text-[11px] font-bold text-foreground">{coin.price}</span>
              <span className={coin.tone === "up" ? "block text-[10px] font-bold text-positive" : "block text-[10px] font-bold text-negative"}>{coin.change}</span>
            </span>
          </CoinLink>
        ))}
      </div>
    </div>
  );
}

function WatchlistTable() {
  return (
    <DataTable title="自选币种">
      <table className="w-[840px] border-separate border-spacing-0 text-left text-[12px]">
        <thead className="text-[10px] uppercase tracking-wide text-muted-foreground"><tr><StickyTh className="w-36">币种</StickyTh><th className="px-2.5 py-2">热度</th><th className="px-2.5 py-2">price</th><th className="px-2.5 py-2">market & sentiment</th><th className="px-2.5 py-2">KOLS 24h/7d</th><th className="px-2.5 py-2">popular 24h/7d</th><th className="px-2.5 py-2">communites 24h/7d</th></tr></thead>
        <tbody>{coins.map((coin) => <tr key={coin.symbol}><StickyTd><CoinLink symbol={coin.symbol} className="flex items-center gap-2 py-2"><CoinAvatar symbol={coin.symbol} tone={coin.avatar} /><span className="leading-tight"><b className="block">{coin.symbol}</b><span className="text-[10px] text-muted-foreground">{coin.name}</span></span></CoinLink></StickyTd><td className="px-2.5 py-1.5 font-black text-primary">{coin.heat}</td><td className="px-2.5 py-1.5 font-bold">{coin.price}</td><td className="px-2.5 py-1.5"><DualSparkline /></td><td className="px-2.5 py-1.5"><b>{coin.kol24}</b><span className="text-muted-foreground"> / {coin.kol7}</span></td><td className="px-2.5 py-1.5"><b>{coin.popular24}</b><span className="text-muted-foreground"> / {coin.popular7}</span></td><td className="px-2.5 py-1.5"><b>{coin.communities24}</b><span className="text-muted-foreground"> / {coin.communities7}</span></td></tr>)}</tbody>
      </table>
    </DataTable>
  );
}
