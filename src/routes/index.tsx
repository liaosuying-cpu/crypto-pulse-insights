import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { PageShell, CoinLink, CoinAvatar, Sparkline, coins } from "@/components/shell";

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
      <ReportsSection />
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

  const r = (n: number) => Math.round(n * 100) / 100;
  const stepX = (W - PAD * 2) / (data.length - 1);
  const yA = (v: number) => r(PAD + (1 - (v - minA) / (maxA - minA || 1)) * (H1 - PAD * 2));
  const yI = (v: number) => r(PAD + (1 - (v - minI) / (maxI - minI || 1)) * (H2 - PAD * 2));
  const xAt = (i: number) => r(PAD + i * stepX);
  const barW = r(Math.max(3, stepX * 0.55));

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yA(d.aivix)}`).join(" ");
  const indexPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yI(d.index)}`).join(" ");

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

      {/* timeframe selector */}
      <div className="mb-2 grid grid-cols-6 gap-1 text-[11px] font-bold">
        {TIMEFRAMES.map((t) => (
          <button key={t} onClick={() => setTf(t)} className={t === tf ? "rounded-md bg-primary py-1 text-center text-primary-foreground" : "rounded-md border border-panel-border py-1 text-center text-muted-foreground"}>{t}</button>
        ))}
      </div>

      {/* chart 1: line + bars */}
      <div ref={topRef} onScroll={sync("top")} className="thin-scrollbar relative overflow-x-auto">
        <svg width={W} height={H1} viewBox={`0 0 ${W} ${H1}`} className="block" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          {/* grid */}
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={PAD} x2={W - PAD} y1={r(PAD + (H1 - PAD * 2) * g)} y2={r(PAD + (H1 - PAD * 2) * g)} stroke="hsl(var(--panel-border))" strokeDasharray="2 4" />
          ))}
          {/* volume bars */}
          {data.map((d, i) => {
            const h = r(((d.vol / maxV) * (H1 - PAD * 2)) * 0.65);
            return <rect key={i} x={r(xAt(i) - barW / 2)} y={r(H1 - PAD - h)} width={barW} height={h} rx={1.5} fill="var(--color-primary)" opacity={0.55} />;
          })}
          {/* aivix line (white = foreground) */}
          <path d={linePath} stroke="var(--color-foreground)" strokeWidth={2} fill="none" strokeLinecap="round" />
          {/* anomalies */}
          {data.map((d, i) => d.anomaly ? (
            <g key={i}>
              <circle cx={xAt(i)} cy={yA(d.aivix)} r={5} fill="none" stroke="var(--color-warning)" strokeWidth={2} />
              <circle cx={xAt(i)} cy={yA(d.aivix)} r={2.5} fill="var(--color-warning)" />
            </g>
          ) : null)}
          {/* hover crosshair */}
          {hover != null ? (
            <line x1={xAt(hover)} x2={xAt(hover)} y1={PAD} y2={H1 - PAD} stroke="var(--color-primary)" strokeDasharray="2 3" opacity={0.8} />
          ) : null}
        </svg>

        {/* tooltip */}
        {hoverPt ? (
          <div
            className="pointer-events-none absolute top-1 z-10 min-w-[150px] rounded-lg border border-panel-border bg-background/95 p-2 text-[10px] shadow-glow backdrop-blur"
            style={{ left: Math.min(W - 160, Math.max(4, xAt(hover ?? 0) + 8)) }}
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
          <path d={`${indexPath} L ${xAt(data.length - 1)} ${H2 - PAD} L ${PAD} ${H2 - PAD} Z`} fill="url(#idxFill)" />
          <path d={indexPath} stroke="var(--color-signal)" strokeWidth={2} fill="none" strokeLinecap="round" />
          {hover != null ? (
            <line x1={xAt(hover)} x2={xAt(hover)} y1={0} y2={H2} stroke="var(--color-signal)" strokeDasharray="2 3" opacity={0.7} />
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

/* ────────────── 行研机构报告栏 ────────────── */
type Report = {
  org: string;
  orgTone: "primary" | "signal" | "warning" | "positive" | "negative" | "secondary";
  title: string;
  summary: string;
  tag: string;
  rating: "看多" | "看空" | "中性";
  time: string;
  pages: number;
};

const REPORT_CATS = ["全部", "宏观", "板块", "项目", "链上"] as const;
type ReportCat = (typeof REPORT_CATS)[number];

const reports: (Report & { cat: ReportCat })[] = [
  { cat: "宏观", org: "Coinbase Research", orgTone: "primary", title: "Q4 加密市场展望:降息周期下的资金再配置", summary: "降息预期叠加 ETF 持续流入,BTC 或测试 9 万美元关键阻力,ETH/BTC 汇率有望企稳。", tag: "宏观策略", rating: "看多", time: "2 小时前", pages: 24 },
  { cat: "板块", org: "Messari", orgTone: "signal", title: "AI × Crypto 赛道深度:从算力到 Agent 的价值捕获", summary: "推理算力网络正在替代训练叙事,关注具备真实付费用户的协议。", tag: "AI 赛道", rating: "看多", time: "今日 09:30", pages: 38 },
  { cat: "项目", org: "Galaxy Digital", orgTone: "warning", title: "Solana 生态半年报:DEX 份额突破 45%", summary: "Solana 月活地址环比 +28%,但 MEV 与拥堵问题仍是中期隐忧。", tag: "Solana", rating: "中性", time: "昨日", pages: 32 },
  { cat: "链上", org: "Glassnode", orgTone: "positive", title: "BTC 链上数据周报:长期持有者再次进入分发期", summary: "LTH 净仓位变化指标转负,历史上对应中期回调风险上升。", tag: "链上数据", rating: "看空", time: "昨日", pages: 16 },
  { cat: "板块", org: "Delphi Digital", orgTone: "negative", title: "Meme 板块流动性研究:轮动节奏正在变快", summary: "Meme Mindshare 占比从 22% 回落至 13%,资金正在流向 RWA 与 AI。", tag: "Meme", rating: "看空", time: "2 天前", pages: 21 },
  { cat: "宏观", org: "Bitwise", orgTone: "secondary", title: "ETF 资金流向月报:机构配置比例持续抬升", summary: "10 家头部 ETF 累计净流入 132 亿美元,养老金账户占比首次突破 8%。", tag: "ETF", rating: "看多", time: "3 天前", pages: 18 },
];

function ratingBadge(r: Report["rating"]) {
  if (r === "看多") return "bg-positive/15 text-positive";
  if (r === "看空") return "bg-negative/15 text-negative";
  return "bg-elevated text-muted-foreground";
}

function ReportsSection() {
  const [cat, setCat] = useState<ReportCat>("全部");
  const list = cat === "全部" ? reports : reports.filter((r) => r.cat === cat);
  return (
    <section className="overflow-hidden rounded-2xl border border-panel-border bg-panel shadow-panel">
      <div className="flex items-center justify-between px-3.5 pb-1.5 pt-2.5">
        <div>
          <h2 className="text-[13px] font-black tracking-tight">行研机构报告</h2>
          <p className="mt-0.5 text-[10px] text-muted-foreground">来自全球头部研究机构 · 实时同步</p>
        </div>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9.5px] font-black text-primary">{reports.length} 篇</span>
      </div>
      <div className="thin-scrollbar flex gap-1 overflow-x-auto px-3 pb-2 text-[11px] font-black">
        {REPORT_CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-2.5 py-1 transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-elevated text-muted-foreground"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-panel-border/70 border-t border-panel-border">
        {list.map((r) => (
          <li key={r.title} className="px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <CoinAvatar symbol={r.org} tone={r.orgTone} small />
              <b className="truncate text-[11px] text-foreground">{r.org}</b>
              <span className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-black ${ratingBadge(r.rating)}`}>{r.rating}</span>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[12.5px] font-bold leading-snug text-foreground">{r.title}</p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{r.summary}</p>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="rounded bg-elevated px-1.5 py-0.5 font-black text-primary">{r.tag}</span>
              <span>{r.pages} 页</span>
              <span>·</span>
              <span>{r.time}</span>
              <span className="ml-auto font-black text-primary">阅读 →</span>
            </div>
          </li>
        ))}
      </ul>
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
