import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { PageShell, CoinAvatar, FooterBrand, coins, latest } from "@/components/shell";

const searchSchema = z.object({
  list: z.string().optional(),
  idx: z.coerce.number().optional(),
  tab: z.enum(["data", "news"]).optional(),
});

export const Route = createFileRoute("/coin/$symbol")({
  validateSearch: (s) => searchSchema.parse(s),
  head: ({ params }) => ({
    meta: [
      { title: `${params.symbol} 单币种分析 — CryptOracle` },
      { name: "description", content: `${params.symbol} 的市场、情绪、KOL 与因子趋势分析。` },
      { property: "og:title", content: `${params.symbol} 单币种分析 — CryptOracle` },
      { property: "og:description", content: "查看单币种市场、情绪与社群数据。" },
    ],
  }),
  component: CoinPage,
});

/* ===== Meta ===== */
type Tone = "primary" | "signal" | "warning" | "positive" | "negative" | "secondary";
const coinMeta: Record<string, { name: string; price: string; change: string; tone: "up" | "down"; avatar: Tone; mcap: string; vol: string; dom: string; supply: string }> = {
  BTC: { name: "Bitcoin", price: "$77,970", change: "+2.34%", tone: "up", avatar: "warning", mcap: "$1.52T", vol: "$48.2B", dom: "52.6%", supply: "19.6M / 21M" },
  ETH: { name: "Ethereum", price: "$3,521", change: "-1.28%", tone: "down", avatar: "signal", mcap: "$424B", vol: "$22.1B", dom: "14.7%", supply: "120.4M" },
  SOL: { name: "Solana", price: "$178.5", change: "+5.67%", tone: "up", avatar: "primary", mcap: "$82.3B", vol: "$5.6B", dom: "2.85%", supply: "461.2M" },
  BNB: { name: "BNB", price: "$612", change: "-5.67%", tone: "down", avatar: "secondary", mcap: "$89.1B", vol: "$1.9B", dom: "3.09%", supply: "145.8M" },
  XRP: { name: "Ripple", price: "$0.62", change: "+12.11%", tone: "up", avatar: "positive", mcap: "$34.6B", vol: "$2.4B", dom: "1.20%", supply: "55.8B" },
  WIF: { name: "dogwifhat", price: "$2.85", change: "+12.45%", tone: "up", avatar: "negative", mcap: "$2.85B", vol: "$420M", dom: "0.10%", supply: "998M" },
  JUP: { name: "Jupiter", price: "$1.23", change: "-3.21%", tone: "down", avatar: "positive", mcap: "$1.65B", vol: "$210M", dom: "0.06%", supply: "1.34B" },
  STRK: { name: "Starknet", price: "$1.87", change: "+8.92%", tone: "up", avatar: "primary", mcap: "$1.10B", vol: "$180M", dom: "0.04%", supply: "588M" },
};

const DEFAULT_ORDER = [...coins.map((c) => c.symbol), ...latest.map((c) => c.symbol)];

function CoinPage() {
  const { symbol } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const meta = coinMeta[symbol] ?? { name: symbol, price: "$--", change: "+0.00%", tone: "up" as const, avatar: "primary" as Tone, mcap: "—", vol: "—", dom: "—", supply: "—" };

  const order = useMemo(() => (search.list ? search.list.split(",").filter(Boolean) : DEFAULT_ORDER), [search.list]);
  const idx = order.indexOf(symbol);
  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;

  // swipe gesture
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0 && next) navigate({ to: "/coin/$symbol", params: { symbol: next }, search });
    else if (dx > 0 && prev) navigate({ to: "/coin/$symbol", params: { symbol: prev }, search });
  };

  return (
    <PageShell>
      {/* 顶部固定币种选择器（嵌在 PageShell 内部，常驻在 TopBar 下方区域顶部） */}
      <CoinSwitcher symbol={symbol} order={order} prev={prev} next={next} search={search} />

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative space-y-3">
        {/* 顶部市场总览 */}
        <OverviewCard symbol={symbol} meta={meta} />

        <DataPanel symbol={symbol} />

        <FooterBrand />
      </div>

      {/* AI 报告悬浮按钮 */}
      <AiReportFab />
    </PageShell>
  );
}

/* ============== 顶部币种选择器 ============== */
function CoinSwitcher({
  symbol, order, prev, next, search,
}: {
  symbol: string;
  order: string[];
  prev: string | null;
  next: string | null;
  search: { list?: string; idx?: number; tab?: "data" | "news" };
}) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-sym="${symbol}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [symbol]);

  return (
    <div className="sticky top-[88px] z-30 -mx-3 -mt-1 mb-1 border-b border-panel-border bg-background/95 px-2 py-1.5 backdrop-blur">
      <div className="flex items-center gap-1.5">
        <Link
          to="/coin/$symbol"
          params={{ symbol: prev ?? symbol }}
          search={search}
          disabled={!prev}
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-panel-border text-[13px] font-black ${
            prev ? "text-primary hover:bg-primary/10" : "text-muted-foreground/40"
          }`}
          aria-label="上一个币种"
        >‹</Link>

        <div ref={scroller} className="thin-scrollbar flex flex-1 gap-1 overflow-x-auto">
          {order.map((s) => {
            const m = coinMeta[s];
            const active = s === symbol;
            return (
              <Link
                key={s}
                to="/coin/$symbol"
                params={{ symbol: s }}
                search={search}
                data-sym={s}
                className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold transition ${
                  active ? "bg-primary text-primary-foreground" : "border border-panel-border bg-background/60 text-muted-foreground"
                }`}
              >
                {m && <CoinAvatar symbol={s} tone={m.avatar} small />}
                <span className={active ? "" : "text-foreground"}>{s}</span>
              </Link>
            );
          })}
        </div>

        <Link
          to="/coin/$symbol"
          params={{ symbol: next ?? symbol }}
          search={search}
          disabled={!next}
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-panel-border text-[13px] font-black ${
            next ? "text-primary hover:bg-primary/10" : "text-muted-foreground/40"
          }`}
          aria-label="下一个币种"
        >›</Link>
      </div>
    </div>
  );
}

/* ============== 总览卡片 ============== */
function OverviewCard({ symbol, meta }: { symbol: string; meta: typeof coinMeta[string] }) {
  const up = meta.tone === "up";
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3 shadow-panel">
      <div className="flex items-start gap-3">
        <CoinAvatar symbol={symbol} tone={meta.avatar} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <h1 className="text-[15px] font-black leading-none">{meta.name}</h1>
            <span className="text-[10px] font-bold text-muted-foreground">{symbol}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="font-mono text-xl font-black leading-none">{meta.price}</p>
            <p className={`font-mono text-[11.5px] font-black ${up ? "text-positive" : "text-negative"}`}>{meta.change}</p>
          </div>
        </div>
        <button className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-panel-border bg-elevated text-[12px] text-warning" aria-label="加入自选">★</button>
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-1.5">
        {[
          { l: "市值", v: meta.mcap }, { l: "24h 量", v: meta.vol }, { l: "占比", v: meta.dom }, { l: "流通", v: meta.supply },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-panel-border bg-background/50 px-1.5 py-1 text-center">
            <div className="text-[8.5px] font-bold uppercase text-muted-foreground">{s.l}</div>
            <div className="mt-0.5 font-mono text-[10.5px] font-black">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== 数据 Panel ============== */
const FACTORS = [
  { key: "social", label: "Social Vol", color: "oklch(0.78 0.17 60)" },
  { key: "kol", label: "KOL", color: "oklch(0.72 0.14 230)" },
  { key: "sentiment", label: "Sentiment", color: "oklch(0.74 0.18 150)" },
  { key: "whale", label: "Whale", color: "oklch(0.72 0.18 280)" },
  { key: "dev", label: "Dev", color: "oklch(0.78 0.19 25)" },
] as const;
type FactorKey = typeof FACTORS[number]["key"];

const CO_LABELS = ["Community Scale", "Participation", "Peak Times", "Sentiment Shift", "Whale Flow"];

function DataPanel({ symbol }: { symbol: string }) {
  const seed = symbol.charCodeAt(0);
  const series = useMemo(() => makeSeries(seed), [seed]);
  const [labelFilters, setLabelFilters] = useState<string[]>([]);
  const [overlay, setOverlay] = useState<FactorKey[]>(["social", "sentiment"]);
  const toggleLabel = (l: string) => setLabelFilters((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);
  const toggleOverlay = (k: FactorKey) => setOverlay((p) => p.includes(k) ? p.filter((x) => x !== k) : [...p, k]);

  return (
    <div className="space-y-3">
      {/* Factor Trend */}
      <Card title="Factor Trend" sub="多因子相对强度 · 24h">
        <FactorTable series={series} />
      </Card>

      {/* Sentiment / Market */}
      <Card title="Sentiment / Market" sub="情绪曲线 vs 价格">
        <DualChart positive={series.sentiment} primary={series.market} />
        <LabelBar labels={CO_LABELS} active={labelFilters} onToggle={toggleLabel} />
      </Card>

      {/* 自定义叠加 */}
      <Card title="自定义叠加" sub="选择以上指标曲线进行叠加绘图">
        <div className="mb-2 flex flex-wrap gap-1">
          {FACTORS.map((f) => {
            const on = overlay.includes(f.key);
            return (
              <button
                key={f.key}
                onClick={() => toggleOverlay(f.key)}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition ${
                  on ? "text-primary-foreground" : "border border-panel-border bg-background/60 text-muted-foreground"
                }`}
                style={on ? { backgroundColor: f.color } : undefined}
              >
                {on ? "✓ " : ""}{f.label}
              </button>
            );
          })}
        </div>
        <OverlayChart factorData={series} active={overlay} />
        <LabelBar labels={CO_LABELS} active={labelFilters} onToggle={toggleLabel} />
      </Card>
    </div>
  );
}

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3 shadow-panel">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-[12.5px] font-black tracking-tight">{title}</h2>
        {sub && <span className="text-[9.5px] font-bold text-muted-foreground">{sub}</span>}
      </div>
      {children}
    </section>
  );
}

function LabelBar({ labels, active, onToggle }: { labels: string[]; active: string[]; onToggle: (l: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1 border-t border-panel-border pt-2">
      <span className="self-center text-[9px] font-bold uppercase text-muted-foreground">CO Labels</span>
      {labels.map((l) => {
        const on = active.includes(l);
        return (
          <button
            key={l}
            onClick={() => onToggle(l)}
            className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-bold transition ${
              on ? "border border-primary bg-primary/15 text-primary" : "border border-panel-border bg-background/60 text-muted-foreground"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

/* === Chart helpers === */
function makeSeries(seed: number) {
  const N = 24;
  const gen = (offset: number, amp = 30, base = 50) =>
    Array.from({ length: N }, (_, i) => Math.round(base + Math.sin((i + offset + seed) * 0.5) * amp + Math.cos((i + offset) * 0.3) * (amp / 3)));
  return {
    social: gen(0, 28, 55),
    kol: gen(2, 22, 45),
    sentiment: gen(4, 24, 60),
    whale: gen(1, 18, 40),
    dev: gen(5, 14, 35),
    market: gen(3, 26, 50),
  } as Record<FactorKey | "market", number[]>;
}

function FactorTable({ series }: { series: ReturnType<typeof makeSeries> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-panel-border bg-background/45">
      <table className="w-full text-left text-[11px]">
        <thead className="text-[9px] uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-2 py-1 font-bold">因子</th>
            <th className="px-2 py-1 font-bold">现值</th>
            <th className="px-2 py-1 font-bold">24h</th>
            <th className="px-2 py-1 text-right font-bold">趋势</th>
          </tr>
        </thead>
        <tbody>
          {FACTORS.map((f) => {
            const data = series[f.key];
            const cur = data[data.length - 1];
            const prev = data[0];
            const delta = (((cur - prev) / Math.max(prev, 1)) * 100);
            const up = delta >= 0;
            return (
              <tr key={f.key} className="border-t border-panel-border/60">
                <td className="px-2 py-1 font-bold">{f.label}</td>
                <td className="px-2 py-1 font-mono">{cur}</td>
                <td className={`px-2 py-1 font-mono font-bold ${up ? "text-positive" : "text-negative"}`}>{up ? "+" : ""}{delta.toFixed(1)}%</td>
                <td className="px-2 py-1">
                  <div className="ml-auto h-4 w-16">
                    <Spark data={data} color={f.color} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Spark({ data, color }: { data: number[]; color: string }) {
  const w = 64, h = 16;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full"><polyline fill="none" stroke={color} strokeWidth="1.4" points={pts} /></svg>;
}

function DualChart({ positive, primary }: { positive: number[]; primary: number[] }) {
  return <OverlayChart factorData={{ social: [], kol: [], sentiment: positive, whale: [], dev: [], market: primary }} active={["sentiment"]} extraLine={{ data: primary, color: "oklch(0.72 0.14 230)", label: "Market" }} />;
}

function OverlayChart({
  factorData, active, extraLine,
}: {
  factorData: Record<FactorKey | "market", number[]>;
  active: FactorKey[];
  extraLine?: { data: number[]; color: string; label: string };
}) {
  const w = 320, h = 90;
  const lines: { data: number[]; color: string; label: string }[] = active.map((k) => {
    const f = FACTORS.find((x) => x.key === k)!;
    return { data: factorData[k], color: f.color as string, label: f.label as string };
  });
  if (extraLine) lines.push(extraLine);
  if (!lines.length) return <div className="grid h-[90px] place-items-center text-[10px] text-muted-foreground">请选择至少一个指标</div>;
  const allVals = lines.flatMap((l) => l.data);
  const min = Math.min(...allVals), max = Math.max(...allVals);
  const range = max - min || 1;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[100px] w-full">
        {[0.25, 0.5, 0.75].map((p) => (
          <line key={p} x1={0} x2={w} y1={h * p} y2={h * p} stroke="currentColor" className="text-panel-border" strokeWidth="0.5" />
        ))}
        {lines.map((l) => {
          const pts = l.data.map((v, i) => `${(i / (l.data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
          return <polyline key={l.label} fill="none" stroke={l.color} strokeWidth="1.6" strokeLinecap="round" points={pts} />;
        })}
      </svg>
      <div className="mt-1 flex flex-wrap gap-2">
        {lines.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1 text-[9.5px] font-bold text-muted-foreground">
            <span className="inline-block h-1.5 w-3 rounded" style={{ backgroundColor: l.color }} />{l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============== AI 报告 FAB ============== */
function AiReportFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-3 top-[180px] z-30 grid h-11 w-11 place-items-center rounded-full border border-primary/60 bg-primary text-[10px] font-black text-primary-foreground shadow-glow"
        aria-label="AI 报告"
      >
        <span className="leading-none">AI</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 px-3 pb-4" onClick={() => setOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-[400px] overflow-y-auto rounded-2xl border border-panel-border bg-panel p-4 shadow-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black">AI 单币种报告</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground">✕</button>
            </div>
            <p className="text-[12px] font-bold leading-6 text-muted-foreground">
              当前价格与社群热度同步上行，短周期 KOL 讨论密度增加。若 Social Volume Index 持续领先价格，可视为趋势延续确认信号；若 KOL 情绪转弱，需关注回撤风险。
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Stat label="趋势" v="多头" tone="pos" />
              <Stat label="风险" v="中性" />
              <Stat label="建议" v="持有" tone="pos" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, v, tone }: { label: string; v: string; tone?: "pos" | "neg" }) {
  return (
    <div className="rounded-lg border border-panel-border bg-background/60 py-2">
      <div className="text-[9px] font-bold uppercase text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-[12px] font-black ${tone === "pos" ? "text-positive" : tone === "neg" ? "text-negative" : "text-foreground"}`}>{v}</div>
    </div>
  );
}

/* ============== 资讯 Panel ============== */
const NEWS_TABS = ["推荐", "公告", "深度研报", "链上动态", "KOL 观点", "社区热议"] as const;
type NewsTab = typeof NEWS_TABS[number];
const NEWS_DATA: Record<NewsTab, { title: string; src: string; time: string; tag?: string }[]> = {
  推荐: [
    { title: "现货 ETF 单日净流入再创新高，机构买盘持续", src: "Coindesk", time: "12m", tag: "热点" },
    { title: "链上数据显示长期持有者地址数量回升", src: "Glassnode", time: "38m" },
    { title: "分析师：宏观流动性拐点已至，加密资产受益", src: "Bloomberg", time: "1h", tag: "深度" },
  ],
  公告: [
    { title: "Binance 上线该币种永续合约 50x", src: "Binance", time: "2h" },
    { title: "OKX 新增现货交易对", src: "OKX", time: "5h" },
  ],
  深度研报: [
    { title: "估值框架更新：网络价值 / 活跃地址比", src: "Messari", time: "3h", tag: "Pro" },
    { title: "竞争格局：与同赛道项目的指标对比", src: "Delphi Digital", time: "6h" },
  ],
  链上动态: [
    { title: "鲸鱼地址过去 4 小时累计买入 $12M", src: "Whale Alert", time: "32m", tag: "Whale" },
    { title: "前 100 地址持仓集中度环比 -0.3%", src: "Nansen", time: "1h" },
  ],
  "KOL 观点": [
    { title: "@CL207：技术面突破颈线，目标位上看 $XXX", src: "Twitter", time: "18m" },
    { title: "@Arthur_0x：注意短线获利了结风险", src: "Twitter", time: "44m" },
  ],
  社区热议: [
    { title: "Reddit 热帖：关于近期开发更新的讨论", src: "r/cc", time: "1h" },
    { title: "Discord 社区情绪指数 24h 升至 78", src: "CryptOracle", time: "2h" },
  ],
};

function NewsPanel({ symbol: _symbol }: { symbol: string }) {
  const [tab, setTab] = useState<NewsTab>("推荐");
  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-panel-border bg-panel p-3 shadow-panel">
        <div className="-mx-3 mb-2 overflow-x-auto px-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-1">
            {NEWS_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold transition ${
                  t === tab ? "bg-primary text-primary-foreground" : "border border-panel-border bg-background/60 text-muted-foreground"
                }`}
              >{t}</button>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-panel-border/60">
          {NEWS_DATA[tab].map((n, i) => (
            <li key={i} className="flex items-start gap-2 py-2">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-elevated text-[10px] font-black text-primary">{n.src.slice(0, 2)}</span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-[12px] font-bold text-foreground">{n.title}</p>
                <p className="mt-1 text-[9.5px] font-bold text-muted-foreground">
                  {n.src} · {n.time}{n.tag ? <> · <span className="text-primary">{n.tag}</span></> : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-panel-border bg-panel p-3 shadow-panel">
        <h3 className="mb-2 text-[12px] font-black tracking-tight">相关资讯快讯</h3>
        <div className="thin-scrollbar -mx-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1">
          {[
            { title: "宏观利率会议纪要发布", time: "刚刚", tag: "宏观" },
            { title: "ETF 持仓数据更新", time: "10m", tag: "资金" },
            { title: "网络主网升级倒计时", time: "1h", tag: "技术" },
            { title: "DeFi TVL 周环比 +3.2%", time: "2h", tag: "链上" },
          ].map((n, i) => (
            <article key={i} className="w-[200px] shrink-0 snap-start rounded-xl border border-panel-border bg-background/60 p-2.5">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-black text-primary">{n.tag}</span>
              <p className="mt-1.5 text-[11.5px] font-bold leading-snug">{n.title}</p>
              <p className="mt-1 text-[9.5px] font-bold text-muted-foreground">{n.time}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
