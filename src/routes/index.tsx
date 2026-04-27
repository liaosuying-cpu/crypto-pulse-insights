import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Info } from "lucide-react";
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
      <IndexIntro />
      <LiveSentimentTicker />
      <AivixChart />
      <MarketRankTable />
      <KolDiscussionTable />
    </PageShell>
  );
}

function IndexIntro() {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3 shadow-panel">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5">
            <Info className="h-3 w-3 text-primary" />
            <h2 className="text-[12px] font-black tracking-tight">指数简介</h2>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <b className="text-foreground">CO10 index</b> 针对加密市场高波动特征提出的市值加权基准指数；
            <b className="text-foreground"> CO10 AIVIX</b> 专注私域数据，捕捉深层社群情绪波动，提供先导性预警。
          </p>
        </div>
        <Link to="/index-detail" className="shrink-0 rounded-full border border-primary/60 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">详情 →</Link>
      </div>
    </section>
  );
}

function useTicking(initial: number, range: number) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => {
        const delta = (Math.random() - 0.5) * range;
        const next = prev + delta;
        return Math.max(0, Math.min(100, next));
      });
    }, 1500);
    return () => clearInterval(id);
  }, [range]);
  return v;
}

function LiveSentimentTicker() {
  const fearGreed = useTicking(62, 1.8);
  const aivix = useTicking(74.3, 1.2);
  const social = useTicking(48, 2.4);
  const dominance = useTicking(55.1, 0.6);
  const items = [
    { label: "Fear & Greed", value: fearGreed, suffix: "", tone: "primary" as const },
    { label: "AIVIX", value: aivix, suffix: "", tone: "signal" as const },
    { label: "Social Vol", value: social, suffix: "%", tone: "positive" as const },
    { label: "BTC.D", value: dominance, suffix: "%", tone: "warning" as const },
  ];
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3 shadow-panel">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-positive pulse-glow" />
        <h2 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">宏观情绪 · 实时</h2>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {items.map((it) => (
          <div key={it.label} className="rounded-lg border border-panel-border/70 bg-background/40 p-2">
            <div className="text-[9px] uppercase tracking-wide text-muted-foreground">{it.label}</div>
            <div className={`mt-0.5 font-mono text-[14px] font-black tabular-nums ${
              it.tone === "primary" ? "text-primary" : it.tone === "signal" ? "text-signal" : it.tone === "positive" ? "text-positive" : "text-warning"
            }`}>
              {it.value.toFixed(1)}{it.suffix}
            </div>
          </div>
        ))}
      </div>
    </section>
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
  const isAnomaly = (v: number) => v > 85 || v < 36;
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
              {bars.map((height, index) => {
                const anomaly = isAnomaly(height);
                const hour = (index % 24).toString().padStart(2, "0") + ":00";
                const aivix = (60 + (height - 50) * 0.6).toFixed(1);
                const social = (height * 12.4).toFixed(0);
                return (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <button className="relative w-4 cursor-pointer p-0">
                        <div
                          className={`w-full rounded-t transition-opacity hover:opacity-100 ${anomaly ? "bg-warning" : "bg-primary/70 hover:bg-primary"}`}
                          style={{ height: `${height * 1.12}px` }}
                        />
                        {anomaly && (
                          <AlertTriangle className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 text-warning animate-pulse" />
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-52 p-2.5 text-[11px]">
                      <div className="mb-1.5 flex items-center justify-between">
                        <b className="text-[12px]">{hour}</b>
                        {anomaly && <span className="rounded bg-warning/20 px-1.5 py-0.5 text-[9px] font-black text-warning">异常</span>}
                      </div>
                      <div className="space-y-1 font-mono tabular-nums">
                        <Row label="AIVIX" value={aivix} />
                        <Row label="Social Vol" value={social} />
                        <Row label="CO10 index" value={(1240 + height * 3.2).toFixed(2)} />
                      </div>
                      {anomaly && (
                        <div className="mt-2 rounded border border-warning/40 bg-warning/10 p-1.5 text-[10px] leading-snug">
                          <b className="text-warning">预测分析：</b>
                          <span className="text-muted-foreground">
                            {height > 85
                              ? "情绪过热，未来 4-8h 出现回调概率 68%，关注衍生品资金费率。"
                              : "情绪超卖，私域 KOL 看多比例回升至 54%，存在反弹窗口。"}
                          </span>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
            <svg className="pointer-events-none absolute inset-0 h-full w-full text-foreground" viewBox="0 0 620 190" fill="none" preserveAspectRatio="none">
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <b>{value}</b>
    </div>
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
