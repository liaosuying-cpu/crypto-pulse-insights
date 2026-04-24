import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CryptOracle 加密市场数据库" },
      {
        name: "description",
        content: "加密社群情绪数据移动端仪表盘，覆盖行情、自选、AI 洞察与单币种分析。",
      },
      { property: "og:title", content: "CryptOracle 加密市场数据库" },
      {
        property: "og:description",
        content: "用社群情绪、KOL 热度与市场数据辅助加密量化决策。",
      },
    ],
  }),
  component: Index,
});

const coins = [
  { rank: 1, symbol: "BTC", name: "Bitcoin", price: "$77,970", heat: "98.7", kol: "915", popular: "17,571", change: "+2.34%", tone: "up", color: "bg-warning" },
  { rank: 2, symbol: "ETH", name: "Ethereum", price: "$3,521", heat: "94.2", kol: "842", popular: "15,230", change: "-1.28%", tone: "down", color: "bg-blue-500" },
  { rank: 3, symbol: "SOL", name: "Solana", price: "$178.5", heat: "89.5", kol: "756", popular: "12,890", change: "+5.67%", tone: "up", color: "bg-primary" },
  { rank: 4, symbol: "BNB", name: "BNB", price: "$612", heat: "82.1", kol: "534", popular: "9,876", change: "-5.67%", tone: "down", color: "bg-yellow-400" },
  { rank: 5, symbol: "XRP", name: "Ripple", price: "$0.62", heat: "76.8", kol: "423", popular: "7,654", change: "+12.11%", tone: "up", color: "bg-slate-600" },
];

const latest = [
  { symbol: "WIF", price: "$2.85", change: "+12.45%", color: "bg-orange-600" },
  { symbol: "JUP", price: "$1.23", change: "-3.21%", color: "bg-emerald-400" },
  { symbol: "STRK", price: "$1.87", change: "+8.92%", color: "bg-red-400" },
];

const articles = [
  ["BTC 突破 78K：牛市延续还是短期反弹？", "CryptInsight", "2小时前"],
  ["DeFi 锁仓量创新高的背后逻辑", "DeFiPulse", "4小时前"],
  ["Layer2 竞争格局深度解析", "ChainScope", "6小时前"],
];

function Index() {
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background pb-28 text-foreground shadow-2xl">
      <TopBar title="CryptOracle" />
      <div className="px-5 pt-36">
        <h1 className="mb-6 text-3xl font-black tracking-normal">加密市场数据库</h1>
        <section id="market" className="scroll-mt-36 space-y-6">
          <NewsTicker />
          <IndexCard />
          <MarketRanks />
        </section>
        <section id="watchlist" className="mt-8 scroll-mt-36 space-y-6">
          <WatchlistTable />
          <FooterBrand />
        </section>
        <section id="insight" className="mt-8 scroll-mt-36 space-y-6">
          <InsightPanel />
          <ArticleList />
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

function TopBar({ title }: { title: string }) {
  return (
    <header className="fixed left-1/2 top-0 z-30 w-full max-w-[430px] -translate-x-1/2 border-b border-panel-border bg-background/95 px-5 pb-4 pt-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-black shadow-glow">A</div>
        <label className="flex h-12 flex-1 items-center gap-2 rounded-full border border-panel-border bg-elevated px-4 text-muted-foreground focus-within:border-primary">
          <SearchIcon />
          <input className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="搜索币种 / 指标 / KOL" />
        </label>
        <button className="relative grid h-12 w-12 place-items-center rounded-full border border-panel-border bg-elevated text-muted-foreground transition hover:scale-105 hover:text-foreground" aria-label="通知">
          <BellIcon />
          <span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-negative" />
        </button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Alex，欢迎回来 👋</p>
      <div className="mt-3 text-2xl font-black">{title}</div>
    </header>
  );
}

function NewsTicker() {
  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-panel-border bg-panel px-4 py-3 shadow-panel">
      <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
      <strong className="text-warning">快讯</strong>
      <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">BTC 突破 78,000 关口，市场情绪高涨</p>
      <span className="text-sm text-muted-foreground">2分钟前</span>
    </div>
  );
}

function IndexCard() {
  const bars = [64, 70, 66, 58, 36, 28, 22, 20, 32, 54, 66, 72, 68, 64, 46, 34, 26, 30, 42, 58, 68, 66, 50, 36, 34];
  return (
    <article className="pulse-glow rounded-3xl border border-panel-border bg-panel p-6 shadow-panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">CO10 AIVIX</h2>
        <div className="flex gap-3 text-sm text-muted-foreground"><span>— AIVIX</span><span className="text-primary">■ Social</span><span className="text-signal">— CO10</span></div>
      </div>
      <div className="mb-5 flex items-center gap-4 text-lg font-bold text-muted-foreground"><span>15m</span><span>30m</span><span>1h</span><span>4h</span><span className="rounded-xl bg-primary px-4 py-2 text-primary-foreground">1d</span><span>7d</span></div>
      <div className="flex h-44 items-end gap-1.5 overflow-hidden">
        {bars.map((height, index) => <div key={index} className="w-full rounded-t bg-primary/75" style={{ height: `${height}%` }} />)}
      </div>
      <Sparkline className="mt-4 h-20 w-full text-signal" variant="wave" />
    </article>
  );
}

function MarketRanks() {
  return (
    <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-black"><span className="mr-2 text-primary">•</span>币种排行</h2><a className="text-primary" href="#watchlist">更多 →</a></div>
      <div className="grid grid-cols-2 gap-4">
        <MiniRank title="热门币种" data={coins.slice(0, 3)} />
        <MiniRank title="最新上线" data={latest} />
      </div>
    </section>
  );
}

function MiniRank({ title, data }: { title: string; data: Array<{ symbol: string; price: string; change: string; color: string }> }) {
  return (
    <div className="rounded-2xl border border-panel-border bg-background/45 p-4">
      <h3 className="mb-3 text-lg font-black"><span className="mr-2 text-positive">•</span>{title}</h3>
      <div className="space-y-4">{data.map((coin, index) => <CoinLink key={coin.symbol} symbol={coin.symbol} className="grid grid-cols-[1rem_2rem_1fr] items-center gap-2"><span className="text-muted-foreground">{index + 1}</span><CoinAvatar symbol={coin.symbol} color={coin.color} /><div className="text-right"><div className="font-bold">{coin.price}</div><div className={coin.change.startsWith("+") ? "text-sm font-bold text-positive" : "text-sm font-bold text-negative"}>{coin.change}</div></div></CoinLink>)}</div>
    </div>
  );
}

function WatchlistTable() {
  return (
    <section className="overflow-hidden rounded-3xl border border-panel-border bg-panel shadow-panel">
      <div className="p-5"><h2 className="text-2xl font-black"><span className="mr-2 text-warning">★</span>自选币种</h2></div>
      <div className="thin-scrollbar overflow-x-auto">
        <table className="w-[720px] text-left text-sm">
          <thead className="text-muted-foreground"><tr className="border-b border-panel-border"><th className="px-5 py-3">币种</th><th>热度</th><th>Price</th><th>Market&Sentiment</th><th>KOLS</th><th>Popular</th></tr></thead>
          <tbody>{coins.map((coin) => <tr key={coin.symbol} className="border-b border-panel-border/60 transition hover:bg-elevated"><td className="px-5 py-4"><CoinLink symbol={coin.symbol} className="flex items-center gap-3"><CoinAvatar symbol={coin.symbol} color={coin.color} /><span><b className="block text-base">{coin.symbol}</b><span className="text-muted-foreground">{coin.name}</span></span></CoinLink></td><td className="font-black text-primary">{coin.heat}</td><td className="font-bold">{coin.price}</td><td><Sparkline className="h-8 w-28 text-positive" variant="mini" /></td><td><b>{coin.kol}</b> <span className={coin.tone === "up" ? "text-positive" : "text-negative"}>{coin.change}</span><br /><span className="text-muted-foreground">1,198</span></td><td><b>{coin.popular}</b></td></tr>)}</tbody>
        </table>
      </div>
      <div className="mx-24 mb-5 mt-1 h-3 rounded-full bg-primary" />
    </section>
  );
}

function InsightPanel() {
  return (
    <section className="rounded-3xl border border-panel-border bg-panel p-6 shadow-panel">
      <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">AI 智能分析</h2><span className="font-black text-signal">置信度 85%</span></div>
      <p className="text-lg font-bold leading-8 text-muted-foreground">当前市场整体偏多，BTC 主导地位持续增强。社交媒体讨论热度上升 12.3%，KOL 看多比例达 62%。建议关注 SOL 生态及 Layer2 赛道的短期机会。</p>
      <ul className="mt-5 space-y-3 text-muted-foreground"><li>• BTC 突破关键阻力位，短期目标 80,000</li><li>• ETH 质押量创新高，长期基本面稳健</li><li>• 市场恐慌贪婪指数 72，处于贪婪区间</li></ul>
      <div className="mt-6 flex items-center justify-between border-t border-panel-border pt-5"><span className="text-muted-foreground">风险等级 <b className="rounded-full bg-warning/20 px-3 py-1 text-warning">中等</b></span><span className="h-3 w-28 rounded-full bg-gradient-to-r from-primary to-signal" /></div>
    </section>
  );
}

function ArticleList() {
  return (
    <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
      <h2 className="mb-4 text-2xl font-black"><span className="mr-2 text-signal">•</span>精选文章</h2>
      <div className="mb-4 flex gap-5 text-lg font-black"><span className="rounded-xl bg-primary px-5 py-3 text-primary-foreground">洞察</span><span className="px-3 py-3 text-muted-foreground">案例</span></div>
      <div className="space-y-3">{articles.map(([title, source, time], index) => <div key={title} className="flex items-center gap-4 bg-elevated p-4"><div className="grid h-14 w-14 place-items-center bg-gradient-to-br from-primary to-signal font-black">▧</div><div className="min-w-0 flex-1"><h3 className="truncate font-black">{title}</h3><p className="text-sm text-muted-foreground"><span className="text-primary">{source}</span> · {time}</p></div><span className="text-2xl text-muted-foreground">›</span></div>)}</div>
    </section>
  );
}

function FooterBrand() {
  return <footer className="py-8 text-center text-muted-foreground"><div className="mb-2 inline-flex items-center gap-3 text-xl font-black text-foreground"><span className="grid h-10 w-10 place-items-center bg-gradient-to-br from-primary to-signal">C</span>CryptOracle</div><p>AI-Powered Crypto Intelligence</p><p className="mt-2">© 2026 CryptOracle. All rights reserved.</p></footer>;
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-3 border-t border-panel-border bg-background/95 px-6 pt-3 safe-bottom backdrop-blur-xl">
      <a href="#market" className="grid justify-items-center gap-1 text-primary"><PulseIcon /><span className="text-sm font-bold">行情</span></a>
      <a href="#watchlist" className="grid justify-items-center gap-1 text-muted-foreground transition hover:text-primary"><PlusIcon /><span className="text-sm font-bold">自选</span></a>
      <a href="#insight" className="grid justify-items-center gap-1 text-muted-foreground transition hover:text-primary"><BookIcon /><span className="text-sm font-bold">洞察</span></a>
    </nav>
  );
}

function CoinLink({ symbol, className, children }: { symbol: string; className?: string; children: React.ReactNode }) {
  return <Link to="/coin/$symbol" params={{ symbol }} className={className}>{children}</Link>;
}

function CoinAvatar({ symbol, color }: { symbol: string; color: string }) {
  return <span className={`grid h-9 w-9 place-items-center rounded-full ${color} text-sm font-black text-primary-foreground`}>{symbol[0]}</span>;
}

function Sparkline({ className, variant }: { className: string; variant: "wave" | "mini" }) {
  const d = variant === "wave" ? "M0 55 C30 20 56 82 88 45 S142 20 176 55 238 80 300 28 370 52 430 20" : "M0 18 C14 12 24 20 38 12 S66 8 82 12 110 2";
  return <svg className={className} viewBox={variant === "wave" ? "0 0 430 100" : "0 0 112 32"} fill="none"><path d={d} stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><path d={d} stroke="currentColor" strokeOpacity="0.18" strokeWidth="16" strokeLinecap="round" /></svg>;
}

function SearchIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>; }
function BellIcon() { return <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>; }
function PulseIcon() { return <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h4l2-7 4 14 2-7h6" /></svg>; }
function PlusIcon() { return <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /></svg>; }
function BookIcon() { return <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" /><path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20" /></svg>; }