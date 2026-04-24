import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/coin/$symbol")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.symbol} 单币种分析 — CryptOracle` },
      { name: "description", content: `${params.symbol} 的价格、社群情绪、KOL 与因子趋势分析。` },
      { property: "og:title", content: `${params.symbol} 单币种分析 — CryptOracle` },
      { property: "og:description", content: "查看单币种市场、情绪与社群数据。" },
    ],
  }),
  component: CoinPage,
});

const coinMeta: Record<string, { name: string; price: string; change: string; tone: "up" | "down"; avatar: string }> = {
  BTC: { name: "Bitcoin", price: "$77,970", change: "+2.34%", tone: "up", avatar: "bg-warning" },
  ETH: { name: "Ethereum", price: "$3,521", change: "-1.28%", tone: "down", avatar: "bg-signal" },
  SOL: { name: "Solana", price: "$178.5", change: "+5.67%", tone: "up", avatar: "bg-primary" },
  BNB: { name: "BNB", price: "$612", change: "-5.67%", tone: "down", avatar: "bg-secondary" },
  XRP: { name: "Ripple", price: "$0.62", change: "+12.11%", tone: "up", avatar: "bg-positive" },
  WIF: { name: "dogwifhat", price: "$2.85", change: "+12.45%", tone: "up", avatar: "bg-negative" },
  JUP: { name: "Jupiter", price: "$1.23", change: "-3.21%", tone: "down", avatar: "bg-positive" },
  STRK: { name: "Starknet", price: "$1.87", change: "+8.92%", tone: "up", avatar: "bg-primary" },
};

function CoinPage() {
  const { symbol } = Route.useParams();
  const coin = coinMeta[symbol] ?? { name: symbol, price: "$--", change: "+0.00%", tone: "up" as const, avatar: "bg-primary" };

  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background px-4 pb-28 pt-5 text-foreground shadow-2xl">
      <header className="mb-5 flex items-center justify-between">
        <Link to="/" hash="coins" className="inline-flex h-11 items-center gap-2 rounded-full border border-panel-border bg-panel px-4 font-bold text-muted-foreground">‹ 返回币种</Link>
        <span className="rounded-full border border-primary/60 px-3 py-1 text-sm font-bold text-primary">cryptoracle</span>
      </header>

      <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
        <div className="flex items-start gap-4">
          <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${coin.avatar} text-2xl font-black text-primary-foreground`}>{symbol[0]}</span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black">{coin.name} <span className="text-base text-muted-foreground">{symbol}</span></h1>
            <p className="mt-2 text-4xl font-black leading-none">{coin.price}</p>
            <p className={coin.tone === "up" ? "mt-2 text-lg font-black text-positive" : "mt-2 text-lg font-black text-negative"}>{coin.change} · 24h</p>
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-panel-border bg-elevated text-primary" aria-label="加入自选">★</button>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-3">
        <Metric title="KOLs" main="915" sub="7d 1,198" delta="+75.96%" />
        <Metric title="项目热度" main="17,571" sub="7d 133,219" delta="-31.41%" danger />
        <Metric title="社区" main="1,080" sub="7d 1,457" delta="+59.53%" />
      </section>

      <ChartCard title="Market & Sentiment" mode="dual" />
      <ChartCard title="Social Volume / KOL Mentions" mode="bars" />

      <section className="mt-4 rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
        <h2 className="mb-4 text-xl font-black">CO Labels</h2>
        <LabelGroup title="Community Scale" labels={["Large", "Medium", "🔒 Locked"]} />
        <LabelGroup title="Participation Distribution" labels={["User-Dominated", "Retail Discussion", "🔒 Locked"]} green />
        <LabelGroup title="Peak Times" labels={["14:00–16:00 UTC", "20:00–22:00 UTC"]} blue />
      </section>

      <section className="mt-4 rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
        <h2 className="mb-4 text-xl font-black">AI 单币种摘要</h2>
        <p className="text-sm font-bold leading-7 text-muted-foreground">当前 {symbol} 的市场价格与社群热度同步上行，短周期 KOL 讨论密度增加。若 Social Volume Index 继续领先价格，可作为趋势延续确认信号；若 KOL 情绪转弱，需关注回撤风险。</p>
      </section>

      <BottomNav />
    </main>
  );
}

function Metric({ title, main, sub, delta, danger }: { title: string; main: string; sub: string; delta: string; danger?: boolean }) {
  return <div className="rounded-2xl border border-panel-border bg-panel p-3"><p className="text-xs text-muted-foreground">{title}</p><b className="mt-3 block text-xl">{main}</b><p className={danger ? "text-sm font-bold text-negative" : "text-sm font-bold text-positive"}>{delta}</p><p className="mt-1 text-xs text-muted-foreground">{sub}</p></div>;
}

function ChartCard({ title, mode }: { title: string; mode: "dual" | "bars" }) {
  const bars = [32, 70, 46, 28, 60, 42, 72, 84, 64, 35, 50, 74, 80, 66, 44, 58, 82, 76, 48, 34, 52, 62];
  return <section className="mt-4 rounded-3xl border border-panel-border bg-panel p-5 shadow-panel"><div className="mb-4"><h2 className="text-xl font-black">{title}</h2><div className="mt-3 flex gap-2 overflow-x-auto text-xs font-bold text-muted-foreground"><span className="rounded-lg border border-panel-border px-2 py-1">15m</span><span className="rounded-lg border border-panel-border px-2 py-1">30m</span><span className="rounded-lg border border-panel-border px-2 py-1">1h</span><span className="rounded-lg border border-panel-border px-2 py-1">4h</span><span className="rounded-lg bg-primary px-2 py-1 text-primary-foreground">1d</span><span className="rounded-lg border border-panel-border px-2 py-1">7d</span></div></div><div className="h-56 thin-scrollbar overflow-x-auto"><svg className="h-full w-[560px] text-primary" viewBox="0 0 560 210" fill="none"><path d="M0 120 C28 55 48 178 82 78 S132 36 168 122 224 190 252 116 308 82 360 52 430 38 560 92" stroke="var(--color-positive)" strokeWidth="3" strokeLinecap="round"/><path d="M0 150 C40 70 76 165 116 120 S178 72 218 128 292 175 360 95 455 54 560 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>{mode === "bars" ? <g>{bars.map((bar, i) => <rect key={i} x={i * 24} y={190 - bar} width="8" height={bar} rx="3" fill="currentColor" opacity="0.72" />)}</g> : null}</svg></div></section>;
}

function LabelGroup({ title, labels, green, blue }: { title: string; labels: string[]; green?: boolean; blue?: boolean }) {
  const cls = green ? "border-positive/50 bg-positive/15 text-positive" : blue ? "border-signal/50 bg-signal/15 text-signal" : "border-primary/50 bg-primary/20 text-primary";
  return <div className="mb-4"><p className="mb-2 text-sm text-muted-foreground">{title}</p><div className="flex flex-wrap gap-2">{labels.map((label) => <span key={label} className={`rounded-full border px-3 py-2 text-sm font-bold ${cls}`}>{label}</span>)}</div></div>;
}

function BottomNav() {
  return <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-3 border-t border-panel-border bg-background/95 px-6 pt-3 safe-bottom backdrop-blur-xl"><Link to="/" hash="market" className="grid justify-items-center gap-1 text-muted-foreground"><span className="text-3xl">⌁</span><span className="text-sm font-bold">行情</span></Link><Link to="/" hash="coins" className="grid justify-items-center gap-1 text-primary"><span className="text-3xl">◎</span><span className="text-sm font-bold">币种</span></Link><Link to="/" hash="insight" className="grid justify-items-center gap-1 text-muted-foreground"><span className="text-3xl">▱</span><span className="text-sm font-bold">洞察</span></Link></nav>;
}
