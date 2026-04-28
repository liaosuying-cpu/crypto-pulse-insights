import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
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

function MarketPage() {
  return (
    <PageShell>
      <h1 className="sr-only">行情</h1>
      <NewsTicker />
      <KolQuotes />
      <AivixChart />
      <RankingTabs />
      <NewsTabs />
    </PageShell>
  );
}

/* ────────────── 社群 KOL 热门发言（左右滑动） ────────────── */
const kolQuotes = [
  { name: "Arthur", handle: "@Arthur_0x", avatar: "primary" as const, time: "5m", text: "BTC 这波拉升是空头回补,现货并没有跟上,短线谨慎。", coin: "BTC", tone: "bear" as const },
  { name: "CL207", handle: "@CL207", avatar: "signal" as const, time: "12m", text: "SOL 生态的 meme 轮动还没结束,JUP 的交易量上来了。", coin: "SOL", tone: "bull" as const },
  { name: "CryptoNova", handle: "@cryptonova", avatar: "warning" as const, time: "23m", text: "ETH/BTC 汇率跌破关键位,ETH 可能还要再等一轮。", coin: "ETH", tone: "bear" as const },
  { name: "ChainLens", handle: "@chainlens", avatar: "positive" as const, time: "41m", text: "链上大额地址在过去 4 小时吸筹 STRK,值得关注。", coin: "STRK", tone: "bull" as const },
  { name: "MKT Pulse", handle: "@mktpulse", avatar: "negative" as const, time: "1h", text: "WIF 社群情绪异常亢奋,历史上这种情况往往对应短期顶。", coin: "WIF", tone: "bear" as const },
  { name: "DeFi Dad", handle: "@DeFi_Dad", avatar: "secondary" as const, time: "1h", text: "RWA 赛道真实收益仍在上升,是这轮被低估的板块。", coin: "RWA", tone: "bull" as const },
];

function KolQuotes() {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3 shadow-panel">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-black tracking-tight">KOL 热门发言</h2>
          <p className="mt-0.5 text-[10px] text-muted-foreground">社群实时声音 · 左右滑动</p>
        </div>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9.5px] font-black text-primary">LIVE</span>
      </div>
      <div className="thin-scrollbar -mx-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1">
        {kolQuotes.map((q) => (
          <article key={q.handle} className="w-[240px] shrink-0 snap-start rounded-xl border border-panel-border bg-background/55 p-2.5">
            <header className="flex items-center gap-2">
              <CoinAvatar symbol={q.name} tone={q.avatar} small />
              <div className="min-w-0 flex-1 leading-tight">
                <b className="block truncate text-[11.5px]">{q.name}</b>
                <span className="block truncate text-[10px] text-muted-foreground">{q.handle} · {q.time}</span>
              </div>
              <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-black ${q.tone === "bull" ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"}`}>
                {q.tone === "bull" ? "多" : "空"} · {q.coin}
              </span>
            </header>
            <p className="mt-1.5 text-[11.5px] leading-snug text-foreground">{q.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ────────────── 资讯滚动条 ────────────── */
function NewsTicker() {
  const news = [
    "BTC 突破 78,000，CO10 AIVIX 15m 上行",
    "SOL 社区提及量 24h +28.4%",
    "KOL 多空分歧指数升至 0.71",
    "AI 板块 Mindshare 反超 Meme",
    "WIF 异常波动，预警触发",
  ];
  const loop = [...news, ...news];
  return (
    <div className="overflow-hidden rounded-xl border border-panel-border bg-panel py-2 shadow-panel">
      <div className="flex items-center gap-2.5 px-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary pulse-glow" />
        <strong className="shrink-0 text-[11px] font-black uppercase tracking-wider text-primary">资讯</strong>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="flex gap-6 whitespace-nowrap text-[12px] text-muted-foreground animate-marquee">
            {loop.map((item, i) => (
              <span key={i} className="shrink-0">· {item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────── CO10 AIVIX 图表 ────────────── */
const TIMEFRAMES = ["15m", "30m", "1h", "4h", "1d", "7d"] as const;
type Tf = (typeof TIMEFRAMES)[number];

type Pt = { t: string; aivix: number; vol: number; index: number; anomaly?: boolean };

function buildSeries(tf: Tf): Pt[] {
  const N = 36;
  const labels: Record<Tf, (i: number) => string> = {
    "15m": (i) => `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`,
    "30m": (i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${(i % 2) * 30 === 0 ? "00" : "30"}`,
    "1h": (i) => `${String(i % 24).padStart(2, "0")}:00`,
    "4h": (i) => `D${Math.floor(i / 6)} ${(i * 4) % 24}h`,
    "1d": (i) => `D${i + 1}`,
    "7d": (i) => `W${i + 1}`,
  };
  const seedA = { "15m": 0.2, "30m": 0.25, "1h": 0.3, "4h": 0.4, "1d": 0.5, "7d": 0.6 }[tf];
  return Array.from({ length: N }, (_, i) => {
    const x = (i / N) * Math.PI * 2;
    const aivix = 60 + Math.sin(x * 1.3 + seedA) * 18 + Math.cos(x * 2.1) * 6 + (i % 5) * 0.6;
    const vol = 35 + Math.abs(Math.sin(x * 1.7)) * 50 + ((i * 7) % 17);
    const index = 50 + Math.cos(x * 0.9 + seedA) * 22 + Math.sin(x * 2.4) * 5;
    const anomaly = i === 22 || i === 30;
    return { t: labels[tf](i), aivix, vol, index: anomaly ? index + 18 : index, anomaly };
  });
}

function AivixChart() {
  const [tf, setTf] = useState<Tf>("1d");
  const [zoom, setZoom] = useState(1);
  const data = useMemo(() => buildSeries(tf), [tf]);
  const baseW = 560;
  const W = Math.round(baseW * zoom);
  const H1 = 150;
  const H2 = 80;
  const PAD = 8;

  const [hover, setHover] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  const maxA = Math.max(...data.map((d) => d.aivix));
  const minA = Math.min(...data.map((d) => d.aivix));
  const maxV = Math.max(...data.map((d) => d.vol));
  const maxI = Math.max(...data.map((d) => d.index));
  const minI = Math.min(...data.map((d) => d.index));

  const stepX = (W - PAD * 2) / (data.length - 1);
  const yA = (v: number) => PAD + (1 - (v - minA) / (maxA - minA || 1)) * (H1 - PAD * 2);
  const yI = (v: number) => PAD + (1 - (v - minI) / (maxI - minI || 1)) * (H2 - PAD * 2);
  const barW = Math.max(3, stepX * 0.55);

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${PAD + i * stepX} ${yA(d.aivix)}`).join(" ");
  const indexPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${PAD + i * stepX} ${yI(d.index)}`).join(" ");

  // sync horizontal scroll
  const sync = (from: "top" | "bot") => (e: React.UIEvent<HTMLDivElement>) => {
    const x = e.currentTarget.scrollLeft;
    const other = from === "top" ? botRef.current : topRef.current;
    if (other && other.scrollLeft !== x) other.scrollLeft = x;
  };

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const i = Math.round((x - PAD) / stepX);
    if (i >= 0 && i < data.length) setHover(i);
  };

  const hoverPt = hover != null ? data[hover] : null;

  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      {/* header */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-black tracking-tight">CO10 AIVIX</h2>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span><i className="mr-1 inline-block h-0.5 w-3.5 align-middle bg-foreground" />CO10 AIVIX</span>
            <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-primary" />Social Volume</span>
            <span><i className="mr-1 inline-block h-0.5 w-3.5 align-middle bg-signal" />CO10 index</span>
          </div>
        </div>
        <Link to="/coins" className="shrink-0 rounded-full border border-primary/50 bg-primary/10 px-2.5 py-1 text-[10px] font-black text-primary">详情 →</Link>
      </div>

      {/* timeframe selector + zoom */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex gap-1 overflow-x-auto text-[11px] font-bold">
          {TIMEFRAMES.map((t) => (
            <button key={t} onClick={() => setTf(t)} className={t === tf ? "rounded-md bg-primary px-2.5 py-1 text-primary-foreground" : "rounded-md border border-panel-border px-2.5 py-1 text-muted-foreground"}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} className="grid h-6 w-6 place-items-center rounded-md border border-panel-border">−</button>
          <span className="w-8 text-center font-bold tabular-nums">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2.4, z + 0.2))} className="grid h-6 w-6 place-items-center rounded-md border border-panel-border">+</button>
        </div>
      </div>

      {/* chart 1: line + bars */}
      <div ref={topRef} onScroll={sync("top")} className="thin-scrollbar relative overflow-x-auto">
        <svg width={W} height={H1} viewBox={`0 0 ${W} ${H1}`} className="block" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          {/* grid */}
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={PAD} x2={W - PAD} y1={PAD + (H1 - PAD * 2) * g} y2={PAD + (H1 - PAD * 2) * g} stroke="hsl(var(--panel-border))" strokeDasharray="2 4" />
          ))}
          {/* volume bars */}
          {data.map((d, i) => {
            const h = ((d.vol / maxV) * (H1 - PAD * 2)) * 0.65;
            return <rect key={i} x={PAD + i * stepX - barW / 2} y={H1 - PAD - h} width={barW} height={h} rx={1.5} fill="var(--color-primary)" opacity={0.55} />;
          })}
          {/* aivix line (white = foreground) */}
          <path d={linePath} stroke="var(--color-foreground)" strokeWidth={2} fill="none" strokeLinecap="round" />
          {/* anomalies */}
          {data.map((d, i) => d.anomaly ? (
            <g key={i}>
              <circle cx={PAD + i * stepX} cy={yA(d.aivix)} r={5} fill="none" stroke="var(--color-warning)" strokeWidth={2} />
              <circle cx={PAD + i * stepX} cy={yA(d.aivix)} r={2.5} fill="var(--color-warning)" />
            </g>
          ) : null)}
          {/* hover crosshair */}
          {hover != null ? (
            <line x1={PAD + hover * stepX} x2={PAD + hover * stepX} y1={PAD} y2={H1 - PAD} stroke="var(--color-primary)" strokeDasharray="2 3" opacity={0.8} />
          ) : null}
        </svg>

        {/* tooltip */}
        {hoverPt ? (
          <div
            className="pointer-events-none absolute top-1 z-10 min-w-[150px] rounded-lg border border-panel-border bg-background/95 p-2 text-[10px] shadow-glow backdrop-blur"
            style={{ left: Math.min(W - 160, Math.max(4, PAD + (hover ?? 0) * stepX + 8)) }}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-black text-foreground">{hoverPt.t}</span>
              {hoverPt.anomaly ? <span className="rounded bg-warning/20 px-1.5 py-0.5 text-[9px] font-black text-warning">⚠ 异常</span> : null}
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 tabular-nums">
              <span className="text-muted-foreground">AIVIX</span><b className="text-right">{hoverPt.aivix.toFixed(2)}</b>
              <span className="text-muted-foreground">SocVol</span><b className="text-right text-primary">{hoverPt.vol.toFixed(0)}</b>
              <span className="text-muted-foreground">Index</span><b className="text-right text-signal">{hoverPt.index.toFixed(2)}</b>
            </div>
            {hoverPt.anomaly ? (
              <div className="mt-1.5 rounded bg-warning/10 px-1.5 py-1 text-[10px] font-bold text-warning">
                预警：偏离均值 +2.3σ，建议关注后续 30m 走势
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* chart 2: index line, shared x-axis */}
      <div ref={botRef} onScroll={sync("bot")} className="thin-scrollbar mt-1 overflow-x-auto">
        <svg width={W} height={H2} viewBox={`0 0 ${W} ${H2}`} className="block">
          <defs>
            <linearGradient id="idxFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${indexPath} L ${PAD + (data.length - 1) * stepX} ${H2 - PAD} L ${PAD} ${H2 - PAD} Z`} fill="url(#idxFill)" />
          <path d={indexPath} stroke="var(--color-signal)" strokeWidth={2} fill="none" strokeLinecap="round" />
          {hover != null ? (
            <line x1={PAD + hover * stepX} x2={PAD + hover * stepX} y1={0} y2={H2} stroke="var(--color-signal)" strokeDasharray="2 3" opacity={0.7} />
          ) : null}
        </svg>
        <div className="flex justify-between px-2 pt-1 text-[10px] text-muted-foreground" style={{ width: W }}>
          <span>{data[0].t}</span>
          <span>{data[Math.floor(data.length / 2)].t}</span>
          <span>{data[data.length - 1].t}</span>
        </div>
      </div>
    </section>
  );
}

/* ────────────── 币种 / KOL 排行（Tab + 滑动切换） ────────────── */
type Tab = "coins" | "kols";

const kolRows = [
  { rank: 1, prev: 3, name: "Arthur", followers: "1.2M", heat: "98.4", coins: "BTC / ETH", trend: "+18.2%", tone: "up" as const, avatar: "primary" as const },
  { rank: 2, prev: 1, name: "CL207", followers: "846K", heat: "93.1", coins: "SOL / JUP", trend: "+11.6%", tone: "up" as const, avatar: "signal" as const },
  { rank: 3, prev: 2, name: "CryptoNova", followers: "612K", heat: "88.7", coins: "BNB / XRP", trend: "-6.4%", tone: "down" as const, avatar: "warning" as const },
  { rank: 4, prev: 4, name: "ChainLens", followers: "508K", heat: "84.0", coins: "ETH / STRK", trend: "+4.9%", tone: "up" as const, avatar: "positive" as const },
  { rank: 5, prev: 7, name: "MKT Pulse", followers: "476K", heat: "79.5", coins: "BTC / WIF", trend: "-3.7%", tone: "down" as const, avatar: "negative" as const },
];

const coinPrev = [2, 1, 5, 3, 8];

function RankShift({ rank, prev }: { rank: number; prev: number }) {
  const diff = prev - rank;
  if (diff === 0) return <span className="text-[9px] text-muted-foreground">—</span>;
  const up = diff > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[9px] font-black tabular-nums ${up ? "text-positive" : "text-negative"}`}>
      {up ? "▲" : "▼"}{Math.abs(diff)}
    </span>
  );
}

function RankingTabs() {
  const [tab, setTab] = useState<Tab>("coins");
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) setTab(dx < 0 ? "kols" : "coins");
    startX.current = null;
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-panel-border bg-panel shadow-panel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex gap-1 rounded-full bg-elevated p-0.5 text-[11px] font-black">
          <button onClick={() => setTab("coins")} className={`rounded-full px-3 py-1 transition ${tab === "coins" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>币种排行</button>
          <button onClick={() => setTab("kols")} className={`rounded-full px-3 py-1 transition ${tab === "kols" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>KOLS 排行</button>
        </div>
        <Link to={tab === "coins" ? "/coins" : "/insight"} className="text-[11px] font-bold text-primary">查看更多 →</Link>
      </div>
      <div className="thin-scrollbar overflow-x-auto border-t border-panel-border">
        {tab === "coins" ? (
          <table className="w-[560px] border-separate border-spacing-0 text-left text-[12px]">
            <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <StickyTh className="w-14">#</StickyTh>
                <StickyTh className="left-14 w-32">币种</StickyTh>
                <th className="px-2.5 py-2">热度</th>
                <th className="px-2.5 py-2">价格</th>
                <th className="px-2.5 py-2">趋势</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((c, i) => (
                <tr key={c.symbol} className="border-t border-panel-border/70">
                  <StickyTd>
                    <span className="inline-flex items-center gap-1">
                      <b className="tabular-nums">{c.rank}</b>
                      <RankShift rank={c.rank} prev={coinPrev[i]} />
                    </span>
                  </StickyTd>
                  <StickyTd className="left-14">
                    <CoinLink symbol={c.symbol} className="flex items-center gap-2 py-2">
                      <CoinAvatar symbol={c.symbol} tone={c.avatar} />
                      <span className="leading-tight"><b className="block">{c.symbol}</b><span className="text-[10px] text-muted-foreground">{c.name}</span></span>
                    </CoinLink>
                  </StickyTd>
                  <td className="px-2.5 py-1.5 font-black text-primary tabular-nums">{c.heat}</td>
                  <td className="px-2.5 py-1.5 font-bold tabular-nums">{c.price}</td>
                  <td className="px-2.5 py-1.5"><Sparkline className={`h-6 w-20 ${c.tone === "up" ? "text-positive" : "text-negative"}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-[560px] border-separate border-spacing-0 text-left text-[12px]">
            <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <StickyTh className="w-14">#</StickyTh>
                <StickyTh className="left-14 w-36">KOL</StickyTh>
                <th className="px-2.5 py-2">粉丝</th>
                <th className="px-2.5 py-2">热度</th>
                <th className="px-2.5 py-2">讨论币种</th>
              </tr>
            </thead>
            <tbody>
              {kolRows.map((k) => (
                <tr key={k.name} className="border-t border-panel-border/70">
                  <StickyTd>
                    <span className="inline-flex items-center gap-1">
                      <b className="tabular-nums">{k.rank}</b>
                      <RankShift rank={k.rank} prev={k.prev} />
                    </span>
                  </StickyTd>
                  <StickyTd className="left-14">
                    <div className="flex items-center gap-2 py-2">
                      <CoinAvatar symbol={k.name} tone={k.avatar} />
                      <b>{k.name}</b>
                    </div>
                  </StickyTd>
                  <td className="px-2.5 py-1.5 tabular-nums">{k.followers}</td>
                  <td className="px-2.5 py-1.5 font-black text-primary tabular-nums">{k.heat}</td>
                  <td className="px-2.5 py-1.5 text-muted-foreground">{k.coins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/* ────────────── 新闻 / 公告 / 案例 / 观点 ────────────── */
const FEED_TABS = ["新闻", "公告", "案例", "观点"] as const;
type FeedTab = (typeof FEED_TABS)[number];

const feedData: Record<FeedTab, { title: string; src: string; time: string; tag?: string }[]> = {
  新闻: [
    { title: "美 SEC 推迟以太坊现货 ETF 期权审批，市场情绪短线承压", src: "Coindesk", time: "12 分钟前", tag: "宏观" },
    { title: "Solana 链上稳定币转账量周环比 +34%，机构资金持续流入", src: "The Block", time: "38 分钟前", tag: "链上" },
    { title: "BlackRock IBIT 单日净流入 4.2 亿美元，创近月新高", src: "Bloomberg", time: "1 小时前", tag: "ETF" },
  ],
  公告: [
    { title: "CryptOracle 新增 12 项 KOL 行为指标，已上线 API v2", src: "官方", time: "1 小时前", tag: "更新" },
    { title: "AIVIX 指标算法 v3.2 升级公告：引入跨平台权重", src: "官方", time: "今日 09:00", tag: "算法" },
    { title: "Pro 订阅用户限时赠送 5,000 Database Credits", src: "官方", time: "昨日", tag: "活动" },
  ],
  案例: [
    { title: "案例 · 借助 Mindshare 提前 6 小时识别 AI 板块轮动", src: "研究", time: "今日", tag: "策略" },
    { title: "案例 · KOL 多空分歧指数 0.71 后的 BTC 走势复盘", src: "研究", time: "昨日", tag: "复盘" },
    { title: "案例 · WIF 异常波动预警与回撤控制实战", src: "研究", time: "2 天前", tag: "风控" },
  ],
  观点: [
    { title: "Arthur：四季度 ETH 叙事将由 L2 重新接管", src: "@Arthur", time: "30 分钟前", tag: "看多" },
    { title: "CL207：Meme 板块情绪降温，警惕 Mindshare 下行", src: "@CL207", time: "2 小时前", tag: "看空" },
    { title: "ChainLens：STRK 解锁压力释放后或迎来 alpha 窗口", src: "@ChainLens", time: "今日", tag: "中性" },
  ],
};

function NewsTabs() {
  const [tab, setTab] = useState<FeedTab>("新闻");
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) {
      const idx = FEED_TABS.indexOf(tab);
      const next = dx < 0 ? Math.min(FEED_TABS.length - 1, idx + 1) : Math.max(0, idx - 1);
      setTab(FEED_TABS[next]);
    }
    startX.current = null;
  };

  const items = feedData[tab];
  return (
    <section className="overflow-hidden rounded-2xl border border-panel-border bg-panel shadow-panel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex items-center gap-1 overflow-x-auto px-2 pt-2 text-[12px] font-black">
        {FEED_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative shrink-0 rounded-md px-2.5 py-1.5 transition ${tab === t ? "text-foreground" : "text-muted-foreground"}`}
          >
            {t}
            {tab === t ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" /> : null}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-panel-border/70 border-t border-panel-border">
        {items.map((it) => (
          <li key={it.title} className="flex items-start gap-2.5 px-3.5 py-2.5">
            <span className="mt-1 grid h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[12.5px] font-bold leading-snug text-foreground">{it.title}</p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                {it.tag ? <span className="rounded bg-elevated px-1.5 py-0.5 font-black text-primary">{it.tag}</span> : null}
                <span>{it.src}</span>
                <span>·</span>
                <span>{it.time}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { Link };
