import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle } from "lucide-react";
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
      <IndexIntroCards />
      <AivixChart />
      <MarketRankTable />
      <KolDiscussionTable />
    </PageShell>
  );
}

function useTicking(initial: number, range: number) {
  const [v, setV] = useState(initial);
  const prevRef = useRef(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => {
        prevRef.current = prev;
        const delta = (Math.random() - 0.5) * range;
        return prev + delta;
      });
    }, 1500);
    return () => clearInterval(id);
  }, [range]);
  return { value: v, prev: prevRef.current };
}

function IndexIntroCards() {
  const co10 = useTicking(1284.62, 6);
  const aivix = useTicking(74.3, 1.6);
  const social = useTicking(58420, 320);
  const cards = [
    {
      key: "CO10",
      title: "CO10",
      desc: "市值加权基准指数",
      value: co10.value.toFixed(2),
      delta: co10.value - 1280,
      pct: ((co10.value - 1280) / 1280) * 100,
    },
    {
      key: "CO10 AIVIX",
      title: "CO10 AIVIX",
      desc: "社群情绪波动",
      value: aivix.value.toFixed(2),
      delta: aivix.value - 72,
      pct: ((aivix.value - 72) / 72) * 100,
    },
    {
      key: "CO10 SOCIAL",
      title: "CO10 AIVIX 声量",
      desc: "社群讨论声量",
      value: Math.round(social.value).toLocaleString(),
      delta: social.value - 57000,
      pct: ((social.value - 57000) / 57000) * 100,
    },
  ];
  return (
    <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {cards.map((c) => {
        const up = c.delta >= 0;
        return (
          <div key={c.key} className="rounded-2xl border border-panel-border bg-panel p-3 shadow-panel">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[12px] font-black tracking-tight">{c.title}</div>
                <div className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{c.desc}</div>
              </div>
              <Link to="/index-detail" className="shrink-0 rounded-full border border-primary/60 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">​</Link>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className={`font-mono text-[18px] font-black tabular-nums ${up ? "text-positive" : "text-negative"}`}>{c.value}</div>
            </div>
            <div className={`mt-0.5 flex items-center gap-1.5 font-mono text-[11px] tabular-nums ${up ? "text-positive" : "text-negative"}`}>
              <span>{up ? "▲" : "▼"} {Math.abs(c.delta).toFixed(2)}</span>
              <span>({up ? "+" : "-"}{Math.abs(c.pct).toFixed(2)}%)</span>
            </div>
          </div>
        );
      })}
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

  // Pan/zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0); // px translateX
  const dragRef = useRef<{ x: number; pan: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const baseWidth = 560;
  const innerWidth = baseWidth * zoom;

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, pan };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const containerW = containerRef.current?.clientWidth ?? baseWidth;
    const minPan = Math.min(0, containerW - innerWidth);
    setPan(Math.max(minPan, Math.min(0, dragRef.current.pan + dx)));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 2) return;
    setZoom((z) => Math.max(0.6, Math.min(3, z - e.deltaY * 0.002)));
  };

  // Y-axis ticks (0-100 scale for AIVIX)
  const yTicks = [100, 75, 50, 25, 0];
  // X-axis ticks (24h)
  const xTicks = ["00:00", "06:00", "12:00", "18:00", "24:00"];

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
        <div className="flex shrink-0 items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} className="grid h-6 w-6 place-items-center rounded-md border border-panel-border text-[12px] font-black">−</button>
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{zoom.toFixed(1)}x</span>
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.2))} className="grid h-6 w-6 place-items-center rounded-md border border-panel-border text-[12px] font-black">+</button>
          <button onClick={() => { setZoom(1); setPan(0); }} className="ml-1 rounded-md border border-panel-border px-1.5 py-0.5 text-[10px] font-bold">重置</button>
        </div>
      </div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto text-[11px] font-bold text-muted-foreground">
        {["15m", "30m", "1h", "4h", "1d", "7d"].map((t) => (
          <button key={t} className={t === "1d" ? "rounded-md bg-primary px-2.5 py-1 text-primary-foreground" : "rounded-md border border-panel-border px-2.5 py-1"}>{t}</button>
        ))}
      </div>

      {/* Chart with Y-axis */}
      <div className="flex gap-1.5">
        {/* Y axis */}
        <div className="relative flex w-7 shrink-0 flex-col justify-between py-0 text-right text-[9px] text-muted-foreground" style={{ height: "144px" }}>
          {yTicks.map((t) => <span key={t} className="tabular-nums">{t}</span>)}
        </div>

        {/* Plot area */}
        <div ref={containerRef} className="relative flex-1 overflow-hidden rounded-md border border-panel-border/60 bg-background/30 select-none" onWheel={onWheel}>
          <div
            className="relative cursor-grab active:cursor-grabbing"
            style={{ width: `${innerWidth}px`, transform: `translateX(${pan}px)` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Grid lines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" style={{ height: "144px" }}>
              {yTicks.map((t) => <div key={t} className="h-px w-full bg-panel-border/40" />)}
            </div>
            <div className="relative" style={{ height: "144px" }}>
              <div className="absolute inset-x-0 bottom-0 flex h-[140px] items-end gap-1.5 px-1">
                {bars.map((height, index) => {
                  const anomaly = isAnomaly(height);
                  const hour = (index % 24).toString().padStart(2, "0") + ":00";
                  const aivix = (60 + (height - 50) * 0.6).toFixed(1);
                  const social = (height * 12.4).toFixed(0);
                  return (
                    <Popover key={index}>
                      <PopoverTrigger asChild>
                        <button className="relative w-4 cursor-pointer p-0" onPointerDown={(e) => e.stopPropagation()}>
                          <div
                            className={`w-full rounded-t transition-opacity hover:opacity-100 ${anomaly ? "bg-warning" : "bg-primary/70 hover:bg-primary"}`}
                            style={{ height: `${height * 1.3}px` }}
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
              <svg className="pointer-events-none absolute inset-0 h-full w-full text-foreground" viewBox="0 0 620 144" fill="none" preserveAspectRatio="none">
                <path d="M0 90 C34 60 54 120 91 70 S151 30 192 74 268 116 318 60 396 32 448 56 532 108 620 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <svg className="pointer-events-none absolute inset-0 h-full w-full text-signal opacity-80" viewBox="0 0 620 144" fill="none" preserveAspectRatio="none">
                <path d="M0 100 C44 50 82 110 126 72 S206 56 258 82 334 120 388 76 498 38 620 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
              </svg>
            </div>
            {/* X axis */}
            <div className="flex justify-between border-t border-panel-border/60 px-1 pt-1 text-[9px] text-muted-foreground">
              {xTicks.map((t) => <span key={t} className="tabular-nums">{t}</span>)}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-[9px] text-muted-foreground">提示：拖动平移 · 滚轮 / ± 按钮缩放 · 点击柱体查看详情</p>
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
