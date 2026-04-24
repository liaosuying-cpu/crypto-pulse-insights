import { createFileRoute, Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CryptOracle 加密市场数据库" },
      {
        name: "description",
        content: "黑紫专业移动端加密市场数据库，展示 CO10 AIVIX、社群情绪、KOL 讨论与 AI 洞察。",
      },
      { property: "og:title", content: "CryptOracle 加密市场数据库" },
      {
        property: "og:description",
        content: "用加密社群情绪数据辅助量化决策。",
      },
    ],
  }),
  component: Index,
});

type Coin = {
  rank: number;
  symbol: string;
  name: string;
  price: string;
  heat: string;
  momentum: string;
  mentions: string;
  kol24: string;
  kol7: string;
  popular24: string;
  popular7: string;
  communities24: string;
  communities7: string;
  change: string;
  tone: "up" | "down";
  avatar: "primary" | "signal" | "warning" | "positive" | "negative" | "secondary";
};

const coins: Coin[] = [
  { rank: 1, symbol: "BTC", name: "Bitcoin", price: "$77,970", heat: "98.7", momentum: "92.1", mentions: "184K", kol24: "915", kol7: "1,198", popular24: "17,571", popular7: "133,219", communities24: "1,080", communities7: "1,457", change: "+2.34%", tone: "up", avatar: "warning" },
  { rank: 2, symbol: "ETH", name: "Ethereum", price: "$3,521", heat: "94.2", momentum: "88.4", mentions: "142K", kol24: "842", kol7: "1,054", popular24: "15,230", popular7: "118,400", communities24: "956", communities7: "1,214", change: "-1.28%", tone: "down", avatar: "signal" },
  { rank: 3, symbol: "SOL", name: "Solana", price: "$178.5", heat: "89.5", momentum: "86.9", mentions: "121K", kol24: "756", kol7: "944", popular24: "12,890", popular7: "94,101", communities24: "811", communities7: "1,009", change: "+5.67%", tone: "up", avatar: "primary" },
  { rank: 4, symbol: "BNB", name: "BNB", price: "$612", heat: "82.1", momentum: "74.6", mentions: "78K", kol24: "534", kol7: "690", popular24: "9,876", popular7: "71,042", communities24: "632", communities7: "804", change: "-5.67%", tone: "down", avatar: "secondary" },
  { rank: 5, symbol: "XRP", name: "Ripple", price: "$0.62", heat: "76.8", momentum: "71.3", mentions: "65K", kol24: "423", kol7: "588", popular24: "7,654", popular7: "60,820", communities24: "501", communities7: "755", change: "+12.11%", tone: "up", avatar: "positive" },
];

const latest = [
  { rank: 1, symbol: "WIF", name: "dogwifhat", price: "$2.85", change: "+12.45%", tone: "up" as const, avatar: "negative" as const },
  { rank: 2, symbol: "JUP", name: "Jupiter", price: "$1.23", change: "-3.21%", tone: "down" as const, avatar: "positive" as const },
  { rank: 3, symbol: "STRK", name: "Starknet", price: "$1.87", change: "+8.92%", tone: "up" as const, avatar: "primary" as const },
];

const kolRows = [
  { rank: 1, name: "Arthur", followers: "1.2M", heat: "98.4", coins: "BTC / ETH", trend: "+18.2%", tone: "up" as const },
  { rank: 2, name: "CL207", followers: "846K", heat: "93.1", coins: "SOL / JUP", trend: "+11.6%", tone: "up" as const },
  { rank: 3, name: "CryptoNova", followers: "612K", heat: "88.7", coins: "BNB / XRP", trend: "-6.4%", tone: "down" as const },
  { rank: 4, name: "ChainLens", followers: "508K", heat: "84.0", coins: "ETH / STRK", trend: "+4.9%", tone: "up" as const },
  { rank: 5, name: "MKT Pulse", followers: "476K", heat: "79.5", coins: "BTC / WIF", trend: "-3.7%", tone: "down" as const },
];

const articles = [
  ["观点", "社交恐慌回落后，BTC 波动率正在重新定价", "CO Research", "2小时前"],
  ["案例", "SOL 生态热度反转如何领先价格 36 小时", "Alpha Desk", "4小时前"],
  ["观点", "KOL 分歧扩大：Layer2 交易拥挤度的量化信号", "ChainScope", "6小时前"],
];

function Index() {
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background pb-28 text-foreground shadow-2xl">
      <TopBar />
      <div className="px-4 pt-28">
        <h1 className="sr-only">CryptOracle 加密市场数据库</h1>
        <section id="market" className="scroll-mt-32 space-y-5">
          <NewsTicker />
          <AivixChart />
          <MarketRankTable />
          <KolDiscussionTable />
        </section>
        <section id="coins" className="mt-8 scroll-mt-32 space-y-5">
          <CoinOverview />
          <WatchlistTable />
          <FooterBrand />
        </section>
        <section id="insight" className="mt-8 scroll-mt-32 space-y-5">
          <AiReport />
          <InsightMetrics />
          <ArticleList />
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

function TopBar() {
  return (
    <header className="fixed left-1/2 top-0 z-30 w-full max-w-[430px] -translate-x-1/2 border-b border-panel-border bg-background/95 px-4 pb-4 pt-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <UserCenterSheet />
        <label className="flex h-12 flex-1 items-center gap-2 rounded-full border border-panel-border bg-elevated px-4 text-muted-foreground focus-within:border-primary">
          <SearchIcon />
          <input className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="搜索币种 / 指标 / KOL" />
        </label>
      </div>
    </header>
  );
}

function UserCenterSheet() {
  const primaryActions = [
    { label: "登录 / 注册", desc: "同步自选与指标偏好", to: "/login" as const, icon: "↗" },
    { label: "订阅付费", desc: "解锁完整数据库与 AI 报告", to: "/pricing" as const, icon: "◆" },
    { label: "个人中心", desc: "账户、通知与数据导出", to: "/account" as const, icon: "◎" },
  ];
  const quickItems = ["自选同步", "价格预警", "报告推送", "帮助中心"];

  return (
    <Sheet>
      <SheetTrigger className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-elevated ring-2 ring-primary/70 shadow-glow" aria-label="打开个人中心">
        <span className="text-lg font-black text-primary">A</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[86%] max-w-[360px] border-panel-border bg-background p-0 text-foreground">
        <div className="flex min-h-full flex-col px-5 pb-6 pt-7">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-elevated text-2xl font-black text-primary ring-2 ring-primary/70 shadow-glow">A</span>
              <div>
                <SheetTitle className="text-2xl font-black">Alpha Researcher</SheetTitle>
                <p className="mt-1 text-sm font-bold text-muted-foreground">Pro 试用中 · 6 天后到期</p>
              </div>
            </div>
          </SheetHeader>

          <div className="mt-6 rounded-3xl border border-primary/60 bg-primary/15 p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-black text-primary">Database Credits</p><p className="mt-1 text-2xl font-black">8,420</p></div>
              <Link to="/pricing" className="rounded-full bg-primary px-4 py-2 text-sm font-black text-primary-foreground">升级</Link>
            </div>
          </div>

          <nav className="mt-5 space-y-3">
            {primaryActions.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-3 rounded-2xl border border-panel-border bg-panel p-4 shadow-panel transition hover:border-primary/70">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-elevated text-lg font-black text-primary">{item.icon}</span>
                <span className="min-w-0 flex-1"><b className="block">{item.label}</b><span className="mt-1 block text-xs font-bold text-muted-foreground">{item.desc}</span></span>
                <span className="text-primary">›</span>
              </Link>
            ))}
          </nav>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickItems.map((item) => <button key={item} className="h-12 rounded-2xl border border-panel-border bg-elevated text-sm font-bold text-muted-foreground">{item}</button>)}
          </div>

          <div className="mt-auto border-t border-panel-border pt-5 text-xs font-bold text-muted-foreground">
            CryptOracle · 加密社群情绪数据库
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NewsTicker() {
  const news = ["BTC 突破 78,000，CO10 AIVIX 15m 上行", "SOL 社区提及量 24h +28.4%", "KOL 多空分歧指数升至 0.71"];
  return (
    <div className="overflow-hidden rounded-2xl border border-panel-border bg-panel py-3 shadow-panel">
      <div className="flex items-center gap-3 px-4">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary pulse-glow" />
        <strong className="shrink-0 text-primary">资讯</strong>
        <div className="thin-scrollbar flex min-w-0 flex-1 gap-5 overflow-x-auto text-sm text-muted-foreground">
          {news.map((item) => <span key={item} className="shrink-0">{item}</span>)}
        </div>
      </div>
    </div>
  );
}

function AivixChart() {
  const bars = [52, 66, 58, 72, 84, 64, 48, 40, 34, 42, 61, 78, 88, 73, 69, 55, 47, 60, 77, 81, 67, 58];
  return (
    <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">CO10 AIVIX</h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span><i className="mr-1 inline-block h-0.5 w-5 align-middle bg-foreground" />CO10 AIVIX</span>
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-primary" />CO10 Social Volume Index</span>
            <span><i className="mr-1 inline-block h-0.5 w-5 align-middle bg-signal" />CO10 index</span>
          </div>
        </div>
      </div>
      <TimeSelector />
      <div className="thin-scrollbar overflow-x-auto pb-1">
        <div className="w-[620px]">
          <div className="relative h-48 border-b border-panel-border/80">
            <div className="absolute inset-x-0 bottom-0 flex h-36 items-end gap-2 px-1">
              {bars.map((height, index) => <div key={index} className="w-5 rounded-t bg-primary/70" style={{ height: `${height}%` }} />)}
            </div>
            <svg className="absolute inset-0 h-full w-full text-foreground" viewBox="0 0 620 190" fill="none">
              <path d="M0 116 C34 82 54 152 91 92 S151 45 192 96 268 146 318 82 396 48 448 76 532 136 620 54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="h-28 pt-3">
            <svg className="h-full w-full text-signal" viewBox="0 0 620 100" fill="none">
              <path d="M0 70 C44 24 82 78 126 45 S206 28 258 55 334 88 388 50 498 18 620 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M0 70 C44 24 82 78 126 45 S206 28 258 55 334 88 388 50 498 18 620 38" stroke="currentColor" strokeOpacity="0.15" strokeWidth="16" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex justify-between px-1 text-xs text-muted-foreground"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
        </div>
      </div>
    </section>
  );
}

function TimeSelector() {
  return <div className="mb-4 flex gap-2 overflow-x-auto text-sm font-bold text-muted-foreground">{["15m", "30m", "1h", "4h", "1d", "7d"].map((t) => <button key={t} className={t === "1d" ? "rounded-lg bg-primary px-3 py-1.5 text-primary-foreground" : "rounded-lg border border-panel-border px-3 py-1.5"}>{t}</button>)}</div>;
}

function MarketRankTable() {
  return (
    <DataTable title="币种排行" action="查看更多" href="#coins">
      <table className="w-[760px] border-separate border-spacing-0 text-left text-sm">
        <thead className="text-xs text-muted-foreground"><tr><StickyTh className="w-12">#排名</StickyTh><StickyTh className="left-12 w-36">#币种</StickyTh><th className="px-3 py-3">热度 ▾</th><th className="px-3 py-3">情绪动量</th><th className="px-3 py-3">提及量</th><th className="px-3 py-3">#价格</th><th className="px-3 py-3">#趋势</th></tr></thead>
        <tbody>{coins.map((coin) => <tr key={coin.symbol} className="border-t border-panel-border/70"><StickyTd>{coin.rank}</StickyTd><StickyTd className="left-12"><CoinLink symbol={coin.symbol} className="flex items-center gap-2 py-3"><CoinAvatar symbol={coin.symbol} tone={coin.avatar} /><span><b className="block">{coin.symbol}</b><span className="text-xs text-muted-foreground">{coin.name}</span></span></CoinLink></StickyTd><td className="px-3 py-3 font-black text-primary">{coin.heat}</td><td className="px-3 py-3">{coin.momentum}</td><td className="px-3 py-3">{coin.mentions}</td><td className="px-3 py-3 font-bold">{coin.price}</td><td className="px-3 py-3"><Sparkline className="h-8 w-24 text-positive" /></td></tr>)}</tbody>
      </table>
    </DataTable>
  );
}

function KolDiscussionTable() {
  return (
    <DataTable title="KOL 讨论区表 · 24h" action="查看更多" href="#insight">
      <table className="w-[720px] border-separate border-spacing-0 text-left text-sm">
        <thead className="text-xs text-muted-foreground"><tr><StickyTh className="w-12">#排名</StickyTh><StickyTh className="left-12 w-40">#KOL</StickyTh><th className="px-3 py-3">#粉丝</th><th className="px-3 py-3">#热度</th><th className="px-3 py-3">#讨论币种</th><th className="px-3 py-3">#趋势</th></tr></thead>
        <tbody>{kolRows.map((kol) => <tr key={kol.name}><StickyTd>{kol.rank}</StickyTd><StickyTd className="left-12"><div className="flex items-center gap-2 py-3"><span className="grid h-9 w-9 rounded-full bg-elevated place-items-center text-primary">{kol.name[0]}</span><b>{kol.name}</b></div></StickyTd><td className="px-3 py-3">{kol.followers}</td><td className="px-3 py-3 font-black text-primary">{kol.heat}</td><td className="px-3 py-3">{kol.coins}</td><td className={kol.tone === "up" ? "px-3 py-3 font-bold text-positive" : "px-3 py-3 font-bold text-negative"}>{kol.trend}</td></tr>)}</tbody>
      </table>
    </DataTable>
  );
}

function CoinOverview() {
  return (
    <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-black">币种</h2><a href="#coins-watch" className="rounded-full border border-primary/60 px-4 py-2 text-sm font-bold text-primary">显示更多</a></div>
      <div className="grid grid-cols-2 gap-3">
        <MiniCoinTable title="热门币种" data={coins.slice(0, 3)} />
        <MiniCoinTable title="最新上线" data={latest} />
      </div>
    </section>
  );
}

function MiniCoinTable({ title, data }: { title: string; data: Array<{ rank: number; symbol: string; name?: string; price: string; change: string; tone: "up" | "down"; avatar: Coin["avatar"] }> }) {
  return <div className="rounded-2xl border border-panel-border bg-background/45 p-3"><h3 className="mb-3 font-black text-muted-foreground">{title}</h3><div className="space-y-3">{data.map((coin) => <CoinLink key={coin.symbol} symbol={coin.symbol} className="grid grid-cols-[1rem_1.75rem_1fr] items-center gap-2"><span className="text-xs text-muted-foreground">{coin.rank}</span><CoinAvatar symbol={coin.symbol} tone={coin.avatar} small /><span className="min-w-0 text-right"><b className="block truncate text-sm">{coin.symbol}</b><span className="block text-xs font-bold text-foreground">{coin.price}</span><span className={coin.tone === "up" ? "block text-xs font-bold text-positive" : "block text-xs font-bold text-negative"}>{coin.change}</span></span></CoinLink>)}</div></div>;
}

function WatchlistTable() {
  return (
    <DataTable title="自选币种" id="coins-watch">
      <table className="w-[940px] border-separate border-spacing-0 text-left text-sm">
        <thead className="text-xs text-muted-foreground"><tr><StickyTh className="w-40">#币种</StickyTh><th className="px-3 py-3">#热度</th><th className="px-3 py-3">#price</th><th className="px-3 py-3">#market & sentiment</th><th className="px-3 py-3">#KOLS 24h/7d</th><th className="px-3 py-3">#popular 24h/7d</th><th className="px-3 py-3">#communites 24h/7d</th></tr></thead>
        <tbody>{coins.map((coin) => <tr key={coin.symbol}><StickyTd><CoinLink symbol={coin.symbol} className="flex items-center gap-3 py-3"><CoinAvatar symbol={coin.symbol} tone={coin.avatar} /><span><b className="block">{coin.symbol}</b><span className="text-xs text-muted-foreground">{coin.name}</span></span></CoinLink></StickyTd><td className="px-3 py-3 font-black text-primary">{coin.heat}</td><td className="px-3 py-3 font-bold">{coin.price}</td><td className="px-3 py-3"><DualSparkline /></td><td className="px-3 py-3"><b>{coin.kol24}</b><span className="text-muted-foreground"> / {coin.kol7}</span></td><td className="px-3 py-3"><b>{coin.popular24}</b><span className="text-muted-foreground"> / {coin.popular7}</span></td><td className="px-3 py-3"><b>{coin.communities24}</b><span className="text-muted-foreground"> / {coin.communities7}</span></td></tr>)}</tbody>
      </table>
    </DataTable>
  );
}

function AiReport() {
  return <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel"><h2 className="mb-4 text-2xl font-black">AI 报告</h2><div className="mb-4 grid grid-cols-3 rounded-2xl border border-panel-border bg-background/40 p-1 text-center text-sm font-bold"><span className="rounded-xl bg-primary px-2 py-2 text-primary-foreground">市场情绪</span><span className="px-2 py-2 text-muted-foreground">社交数据</span><span className="px-2 py-2 text-muted-foreground">KOL 洞察</span></div><p className="text-base font-bold leading-7 text-muted-foreground">CO10 情绪扩散速度高于价格动量，短周期风险偏好回升。BTC 与 SOL 的社群提及量同步上升，但 KOL 观点分歧扩大，适合以波动率与热度背离作为观察因子。</p></section>;
}

function InsightMetrics() {
  const metrics = [["CO-A-05-01", 92], ["CO-A-04-02", 76], ["CO-B-03-01", 61], ["CO-B-05-02", 48]];
  return <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel"><div className="grid grid-cols-2 gap-4"><div><h2 className="mb-4 text-lg font-black">高频标签</h2><div className="flex flex-wrap gap-2"><span className="rounded-full border border-primary/60 bg-primary/15 px-3 py-2 text-sm font-bold text-primary">CO-B-03-01</span><span className="rounded-full border border-signal/60 bg-signal/15 px-3 py-2 text-sm font-bold text-signal">CO-B-05-02</span></div></div><div><h2 className="mb-4 text-lg font-black">关键市场指标</h2><div className="space-y-3">{metrics.map(([label, value]) => <div key={label as string}><div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{label}</span><span>{value}</span></div><div className="h-2 rounded-full bg-elevated"><div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></div></div>)}</div></div></div></section>;
}

function ArticleList() {
  return <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel"><h2 className="mb-4 text-2xl font-black">推荐文章</h2><div className="mb-4 flex gap-2 text-sm font-black"><span className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">观点</span><span className="rounded-lg border border-panel-border px-4 py-2 text-muted-foreground">案例</span></div><div className="space-y-3">{articles.map(([type, title, source, time]) => <article key={title} className="border-l-2 border-primary bg-elevated p-4"><div className="mb-2 text-xs font-bold text-primary">{type}</div><h3 className="font-black leading-6">{title}</h3><p className="mt-2 text-xs text-muted-foreground">{source} · {time}</p></article>)}</div></section>;
}

function FooterBrand() {
  return <footer className="py-10 text-center text-muted-foreground"><div className="mb-2 inline-flex items-center gap-3 text-xl font-black lowercase text-foreground"><span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/60 bg-primary/15 text-primary">co</span>cryptoracle</div><p>Your Crypto Markets Dashboard, Optimized for Alpha</p></footer>;
}

function DataTable({ title, action, href, id, children }: { title: string; action?: string; href?: string; id?: string; children: React.ReactNode }) {
  return <section id={id} className="overflow-hidden rounded-3xl border border-panel-border bg-panel shadow-panel"><div className="flex items-center justify-between p-5"><h2 className="text-2xl font-black">{title}</h2>{action && href ? <a className="text-sm font-bold text-primary" href={href}>{action} →</a> : null}</div><div className="thin-scrollbar overflow-x-auto border-t border-panel-border">{children}</div></section>;
}

function StickyTh({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`sticky left-0 z-10 bg-panel px-3 py-3 ${className}`}>{children}</th>;
}

function StickyTd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`sticky left-0 z-10 border-t border-panel-border/70 bg-panel px-3 py-2 ${className}`}>{children}</td>;
}

function BottomNav() {
  return <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-3 border-t border-panel-border bg-background/95 px-6 pt-3 safe-bottom backdrop-blur-xl"><a href="#market" className="grid justify-items-center gap-1 text-primary"><PulseIcon /><span className="text-sm font-bold">行情</span></a><a href="#coins" className="grid justify-items-center gap-1 text-muted-foreground transition hover:text-primary"><CoinIcon /><span className="text-sm font-bold">币种</span></a><a href="#insight" className="grid justify-items-center gap-1 text-muted-foreground transition hover:text-primary"><BookIcon /><span className="text-sm font-bold">洞察</span></a></nav>;
}

function CoinLink({ symbol, className, children }: { symbol: string; className?: string; children: React.ReactNode }) {
  return <Link to="/coin/$symbol" params={{ symbol }} hash="coins" className={className}>{children}</Link>;
}

function CoinAvatar({ symbol, tone, small }: { symbol: string; tone: Coin["avatar"]; small?: boolean }) {
  const toneClass = { primary: "bg-primary", signal: "bg-signal", warning: "bg-warning", positive: "bg-positive", negative: "bg-negative", secondary: "bg-secondary" }[tone];
  return <span className={`grid ${small ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"} place-items-center rounded-full ${toneClass} font-black text-primary-foreground`}>{symbol[0]}</span>;
}

function Sparkline({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 112 32" fill="none"><path d="M0 20 C14 8 24 26 38 14 S66 7 82 13 96 27 112 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
}

function DualSparkline() {
  return <svg className="h-9 w-32" viewBox="0 0 132 36" fill="none"><path d="M0 24 C18 6 32 29 48 15 S76 10 92 18 112 31 132 9" stroke="var(--color-positive)" strokeWidth="3" strokeLinecap="round" /><path d="M0 16 C18 23 31 4 48 19 S78 30 96 13 116 7 132 20" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" /></svg>;
}

function SearchIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>; }
function PulseIcon() { return <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h4l2-7 4 14 2-7h6" /></svg>; }
function CoinIcon() { return <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8" /></svg>; }
function BookIcon() { return <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" /><path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20" /></svg>; }
