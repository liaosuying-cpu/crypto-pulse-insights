import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, DataTable, StickyTh, StickyTd, CoinLink, CoinAvatar, Sparkline, coins } from "@/components/shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "行情 · CryptOracle 加密市场数据库" },
      { name: "description", content: "CO10 AIVIX、社群情绪与 KOL 讨论行情面板，辅助加密量化决策。" },
      { property: "og:title", content: "行情 · CryptOracle" },
      { property: "og:description", content: "CO10 AIVIX、社群情绪指数与 KOL 讨论实时面板。" },
    ],
  }),
  component: MarketPage,
});

const kolRows = [
  { rank: 1, name: "Arthur", followers: "1.2M", heat: "98.4", coins: "BTC / ETH", trend: "+18.2%", tone: "up" as const },
  { rank: 2, name: "CL207", followers: "846K", heat: "93.1", coins: "SOL / JUP", trend: "+11.6%", tone: "up" as const },
  { rank: 3, name: "CryptoNova", followers: "612K", heat: "88.7", coins: "BNB / XRP", trend: "-6.4%", tone: "down" as const },
  { rank: 4, name: "ChainLens", followers: "508K", heat: "84.0", coins: "ETH / STRK", trend: "+4.9%", tone: "up" as const },
  { rank: 5, name: "MKT Pulse", followers: "476K", heat: "79.5", coins: "BTC / WIF", trend: "-3.7%", tone: "down" as const },
];

function MarketPage() {
  return (
    <PageShell>
      <h1 className="sr-only">行情</h1>
      <NewsTicker />
      <AivixChart />
      <MarketRankTable />
      <KolDiscussionTable />
    </PageShell>
  );
}

function NewsTicker() {
  const news = ["BTC 突破 78,000，CO10 AIVIX 15m 上行", "SOL 社区提及量 24h +28.4%", "KOL 多空分歧指数升至 0.71"];
  return (
    <div className="overflow-hidden rounded-xl border border-panel-border bg-panel py-2 shadow-panel">
      <div className="flex items-center gap-2.5 px-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary pulse-glow" />
        <strong className="shrink-0 text-[11px] font-black uppercase tracking-wider text-primary">资讯</strong>
        <div className="thin-scrollbar flex min-w-0 flex-1 gap-4 overflow-x-auto text-[12px] text-muted-foreground">
          {news.map((item) => <span key={item} className="shrink-0">{item}</span>)}
        </div>
      </div>
    </div>
  );
}

function AivixChart() {
  const bars = [52, 66, 58, 72, 84, 64, 48, 40, 34, 42, 61, 78, 88, 73, 69, 55, 47, 60, 77, 81, 67, 58];
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black tracking-tight">CO10 AIVIX</h2>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span><i className="mr-1 inline-block h-0.5 w-3.5 align-middle bg-foreground" />CO10 AIVIX</span>
            <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-primary" />Social Volume</span>
            <span><i className="mr-1 inline-block h-0.5 w-3.5 align-middle bg-signal" />CO10 index</span>
          </div>
        </div>
      </div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto text-[11px] font-bold text-muted-foreground">
        {["15m", "30m", "1h", "4h", "1d", "7d"].map((t) => (
          <button key={t} className={t === "1d" ? "rounded-md bg-primary px-2.5 py-1 text-primary-foreground" : "rounded-md border border-panel-border px-2.5 py-1"}>{t}</button>
        ))}
      </div>
      <div className="thin-scrollbar overflow-x-auto pb-1">
        <div className="w-[560px]">
          <div className="relative h-36 border-b border-panel-border/80">
            <div className="absolute inset-x-0 bottom-0 flex h-28 items-end gap-1.5 px-1">
              {bars.map((height, index) => <div key={index} className="w-4 rounded-t bg-primary/70" style={{ height: `${height}%` }} />)}
            </div>
            <svg className="absolute inset-0 h-full w-full text-foreground" viewBox="0 0 620 190" fill="none" preserveAspectRatio="none">
              <path d="M0 116 C34 82 54 152 91 92 S151 45 192 96 268 146 318 82 396 48 448 76 532 136 620 54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="h-20 pt-2">
            <svg className="h-full w-full text-signal" viewBox="0 0 620 100" fill="none" preserveAspectRatio="none">
              <path d="M0 70 C44 24 82 78 126 45 S206 28 258 55 334 88 388 50 498 18 620 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex justify-between px-1 text-[10px] text-muted-foreground"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
        </div>
      </div>
    </section>
  );
}

function MarketRankTable() {
  return (
    <DataTable title="币种排行" action="查看更多" to="/coins">
      <table className="w-[680px] border-separate border-spacing-0 text-left text-[12px]">
        <thead className="text-[10px] uppercase tracking-wide text-muted-foreground"><tr><StickyTh className="w-10">#</StickyTh><StickyTh className="left-10 w-32">币种</StickyTh><th className="px-2.5 py-2">热度 ▾</th><th className="px-2.5 py-2">情绪动量</th><th className="px-2.5 py-2">提及量</th><th className="px-2.5 py-2">价格</th><th className="px-2.5 py-2">趋势</th></tr></thead>
        <tbody>{coins.map((coin) => <tr key={coin.symbol} className="border-t border-panel-border/70"><StickyTd>{coin.rank}</StickyTd><StickyTd className="left-10"><CoinLink symbol={coin.symbol} className="flex items-center gap-2 py-2"><CoinAvatar symbol={coin.symbol} tone={coin.avatar} /><span className="leading-tight"><b className="block">{coin.symbol}</b><span className="text-[10px] text-muted-foreground">{coin.name}</span></span></CoinLink></StickyTd><td className="px-2.5 py-1.5 font-black text-primary">{coin.heat}</td><td className="px-2.5 py-1.5">{coin.momentum}</td><td className="px-2.5 py-1.5">{coin.mentions}</td><td className="px-2.5 py-1.5 font-bold">{coin.price}</td><td className="px-2.5 py-1.5"><Sparkline className="h-6 w-20 text-positive" /></td></tr>)}</tbody>
      </table>
    </DataTable>
  );
}

function KolDiscussionTable() {
  return (
    <DataTable title="KOL 讨论 · 24h" action="查看更多" to="/insight">
      <table className="w-[640px] border-separate border-spacing-0 text-left text-[12px]">
        <thead className="text-[10px] uppercase tracking-wide text-muted-foreground"><tr><StickyTh className="w-10">#</StickyTh><StickyTh className="left-10 w-36">KOL</StickyTh><th className="px-2.5 py-2">粉丝</th><th className="px-2.5 py-2">热度</th><th className="px-2.5 py-2">讨论币种</th><th className="px-2.5 py-2">趋势</th></tr></thead>
        <tbody>{kolRows.map((kol) => <tr key={kol.name}><StickyTd>{kol.rank}</StickyTd><StickyTd className="left-10"><div className="flex items-center gap-2 py-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-elevated text-[11px] font-black text-primary">{kol.name[0]}</span><b>{kol.name}</b></div></StickyTd><td className="px-2.5 py-1.5">{kol.followers}</td><td className="px-2.5 py-1.5 font-black text-primary">{kol.heat}</td><td className="px-2.5 py-1.5">{kol.coins}</td><td className={kol.tone === "up" ? "px-2.5 py-1.5 font-bold text-positive" : "px-2.5 py-1.5 font-bold text-negative"}>{kol.trend}</td></tr>)}</tbody>
      </table>
    </DataTable>
  );
}

export { Link };
