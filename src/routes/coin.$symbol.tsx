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

const coinMeta: Record<string, { name: string; price: string; change: string; color: string }> = {
  BTC: { name: "Bitcoin", price: "$77,970", change: "+2.34%", color: "bg-warning" },
  ETH: { name: "Ethereum", price: "$3,521", change: "-1.28%", color: "bg-blue-500" },
  SOL: { name: "Solana", price: "$178.5", change: "+5.67%", color: "bg-primary" },
  BNB: { name: "BNB", price: "$612", change: "-5.67%", color: "bg-yellow-400" },
  XRP: { name: "Ripple", price: "$0.62", change: "+12.11%", color: "bg-slate-600" },
  WIF: { name: "dogwifhat", price: "$2.85", change: "+12.45%", color: "bg-orange-600" },
  JUP: { name: "Jupiter", price: "$1.23", change: "-3.21%", color: "bg-emerald-400" },
  STRK: { name: "Starknet", price: "$1.87", change: "+8.92%", color: "bg-red-400" },
};

function CoinPage() {
  const { symbol } = Route.useParams();
  const coin = coinMeta[symbol] ?? { name: symbol, price: "$--", change: "+0.00%", color: "bg-primary" };
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background px-5 pb-28 pt-5 text-foreground shadow-2xl">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-xl font-bold text-muted-foreground">‹ 返回</Link>
      <section className="rounded-3xl border border-panel-border bg-panel p-6 shadow-panel">
        <div className="flex items-center gap-5">
          <span className={`grid h-20 w-20 place-items-center rounded-full ${coin.color} text-3xl font-black text-primary-foreground`}>{symbol[0]}</span>
          <div className="min-w-0 flex-1"><h1 className="text-3xl font-black">{coin.name} <span className="text-xl text-muted-foreground">{symbol}</span></h1><p className="mt-2 text-4xl font-black">{coin.price} <span className={coin.change.startsWith("+") ? "text-2xl text-positive" : "text-2xl text-negative"}>↑ {coin.change}</span></p></div>
          <span className="text-4xl text-muted-foreground">★</span>
        </div>
      </section>
      <section className="mt-5 grid grid-cols-3 gap-3">
        <Metric title="KOLs" main="915" sub="7d: 1,198" good="+75.96%" />
        <Metric title="项目热度" main="17,571" sub="7d: 133,219" good="-31.41%" danger />
        <Metric title="社区增长" main="1,080" sub="7d: 1,457" good="+59.53%" />
      </section>
      <ChartCard title="Market" />
      <ChartCard title="Mentions / Sentiment" compact />
      <section className="mt-5 rounded-3xl border border-panel-border bg-panel p-6 shadow-panel">
        <h2 className="mb-5 text-2xl font-black"><span className="mr-2 text-primary">•</span>CO Labels</h2>
        <LabelGroup title="Community Scale" labels={["Large", "Medium", "🔒 Locked"]} />
        <LabelGroup title="Participation Distribution" labels={["User-Dominated Group", "Retail Investor Discussion Group", "🔒 Locked"]} green />
        <LabelGroup title="Peak Times" labels={["14:00–16:00 UTC", "20:00–22:00 UTC"]} blue />
      </section>
      <BottomNav />
    </main>
  );
}

function Metric({ title, main, sub, good, danger }: { title: string; main: string; sub: string; good: string; danger?: boolean }) {
  return <div className="rounded-2xl border border-panel-border bg-panel p-4"><p className="text-sm text-muted-foreground">{title}</p><b className="mt-4 block text-2xl">{main}</b><p className={danger ? "font-bold text-negative" : "font-bold text-positive"}>{good}</p><p className="mt-1 text-sm text-muted-foreground">{sub}</p></div>;
}

function ChartCard({ title, compact }: { title: string; compact?: boolean }) {
  const bars = [32, 70, 46, 28, 60, 42, 72, 84, 64, 35, 50, 74, 80, 66, 44, 58, 82, 76, 48, 34, 52, 62];
  return <section className="mt-5 rounded-3xl border border-panel-border bg-panel p-6 shadow-panel"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">{title}</h2><div className="flex gap-4 text-sm text-muted-foreground"><span>15Min</span><span>30Min</span><span>1H</span><span>4H</span><span className="rounded-lg bg-primary px-2 py-1 text-primary-foreground">1D</span></div></div><div className={compact ? "h-44" : "h-64"}><svg className="h-full w-full text-primary" viewBox="0 0 360 210" fill="none"><path d="M0 120 C28 55 48 178 82 78 S132 36 168 122 224 190 252 116 308 82 360 52" stroke="currentColor" strokeWidth="3"/><path d="M0 150 C40 70 76 165 116 120 S178 72 218 128 292 175 360 95" stroke="var(--color-positive)" strokeWidth="3"/><g>{bars.map((bar, i) => <rect key={i} x={i * 16} y={190 - bar} width="6" height={bar} rx="2" fill="currentColor" opacity="0.72" />)}</g></svg></div></section>;
}

function LabelGroup({ title, labels, green, blue }: { title: string; labels: string[]; green?: boolean; blue?: boolean }) {
  const cls = green ? "border-positive/50 bg-positive/15 text-positive" : blue ? "border-signal/50 bg-signal/15 text-blue-300" : "border-primary/50 bg-primary/20 text-purple-200";
  return <div className="mb-5"><p className="mb-3 text-lg text-muted-foreground">{title}</p><div className="flex flex-wrap gap-3">{labels.map((label) => <span key={label} className={`rounded-full border px-4 py-2 font-bold ${cls}`}>{label}</span>)}</div></div>;
}

function BottomNav() {
  return <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-3 border-t border-panel-border bg-background/95 px-6 pt-3 safe-bottom backdrop-blur-xl"><Link to="/" hash="market" className="grid justify-items-center gap-1 text-muted-foreground"><span className="text-3xl">⌁</span><span className="text-sm font-bold">行情</span></Link><Link to="/" hash="watchlist" className="grid justify-items-center gap-1 text-muted-foreground"><span className="text-3xl">⊕</span><span className="text-sm font-bold">自选</span></Link><Link to="/" hash="insight" className="grid justify-items-center gap-1 text-primary"><span className="text-3xl">▱</span><span className="text-sm font-bold">洞察</span></Link></nav>;
}