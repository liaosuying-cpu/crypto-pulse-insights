import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type Coin = {
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

export const coins: Coin[] = [
  { rank: 1, symbol: "BTC", name: "Bitcoin", price: "$77,970", heat: "98.7", momentum: "92.1", mentions: "184K", kol24: "915", kol7: "1,198", popular24: "17,571", popular7: "133,219", communities24: "1,080", communities7: "1,457", change: "+2.34%", tone: "up", avatar: "warning" },
  { rank: 2, symbol: "ETH", name: "Ethereum", price: "$3,521", heat: "94.2", momentum: "88.4", mentions: "142K", kol24: "842", kol7: "1,054", popular24: "15,230", popular7: "118,400", communities24: "956", communities7: "1,214", change: "-1.28%", tone: "down", avatar: "signal" },
  { rank: 3, symbol: "SOL", name: "Solana", price: "$178.5", heat: "89.5", momentum: "86.9", mentions: "121K", kol24: "756", kol7: "944", popular24: "12,890", popular7: "94,101", communities24: "811", communities7: "1,009", change: "+5.67%", tone: "up", avatar: "primary" },
  { rank: 4, symbol: "BNB", name: "BNB", price: "$612", heat: "82.1", momentum: "74.6", mentions: "78K", kol24: "534", kol7: "690", popular24: "9,876", popular7: "71,042", communities24: "632", communities7: "804", change: "-5.67%", tone: "down", avatar: "secondary" },
  { rank: 5, symbol: "XRP", name: "Ripple", price: "$0.62", heat: "76.8", momentum: "71.3", mentions: "65K", kol24: "423", kol7: "588", popular24: "7,654", popular7: "60,820", communities24: "501", communities7: "755", change: "+12.11%", tone: "up", avatar: "positive" },
];

export const latest = [
  { rank: 1, symbol: "WIF", name: "dogwifhat", price: "$2.85", change: "+12.45%", tone: "up" as const, avatar: "negative" as const },
  { rank: 2, symbol: "JUP", name: "Jupiter", price: "$1.23", change: "-3.21%", tone: "down" as const, avatar: "positive" as const },
  { rank: 3, symbol: "STRK", name: "Starknet", price: "$1.87", change: "+8.92%", tone: "up" as const, avatar: "primary" as const },
];

export function PageShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background pb-24 text-foreground shadow-2xl">
      <TopBar />
      <div className={`space-y-3.5 px-3 pb-5 ${isHome ? "pt-[92px]" : "pt-[64px]"}`}>{children}</div>
      <BottomNav />
    </main>
  );
}

function TopBar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <header className="fixed left-1/2 top-0 z-30 w-full max-w-[430px] -translate-x-1/2 border-b border-panel-border bg-background/95 px-3 pb-2 pt-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <UserCenterSheet />
        <label className="flex h-9 flex-1 items-center gap-2 rounded-full border border-panel-border bg-elevated px-3 text-muted-foreground focus-within:border-primary">
          <SearchIcon />
          <input className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground" placeholder="搜索币种 / 指标 / KOL" />
        </label>
        <button type="button" aria-label="消息中心" className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-panel-border bg-elevated text-muted-foreground transition hover:border-primary/70 hover:text-primary">
          <BellIcon />
          <span className="absolute right-1.5 top-1.5 grid h-3.5 min-w-[14px] place-items-center rounded-full bg-primary px-1 text-[9px] font-black text-primary-foreground">3</span>
        </button>
      </div>
      {isHome ? <LiveStatusBar /> : null}
    </header>
  );
}

function LiveStatusBar() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1727018);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 9) + 1), 1500);
    return () => clearInterval(id);
  }, []);
  const stats = [
    { label: "总数据", value: "2.84亿" },
    { label: "总社群", value: "18,420" },
    { label: "总 KOL", value: "32,168" },
    { label: "指标数", value: "146" },
  ];
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-6 w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 text-[11px] font-bold text-primary transition hover:bg-primary/15"
        aria-expanded={open}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
        </span>
        <span>今日已扫描 <span className="tabular-nums text-foreground">{count.toLocaleString()}</span> 条社交动态</span>
      </button>
      {open ? (
        <div className="animate-fade-in mt-2 grid grid-cols-4 gap-1.5 rounded-xl border border-panel-border bg-elevated p-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-panel px-1.5 py-1.5 text-center">
              <div className="text-[13px] font-black text-foreground tabular-nums">{s.value}</div>
              <div className="mt-0.5 text-[10px] font-bold text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function UserCenterSheet() {
  const primaryActions = [
    { label: "登录 / 注册", desc: "管理账户与订阅状态", to: "/login" as const, icon: "↗" },
    { label: "订阅付费", desc: "解锁完整数据库与 AI 报告", to: "/pricing" as const, icon: "◆" },
    { label: "数据导出", desc: "导出币种、指标与报告数据", to: "/export" as const, icon: "⇩" },
    { label: "安全与隐私", desc: "登录安全、隐私权限与数据管理", to: "/privacy" as const, icon: "◎" },
  ];

  return (
    <Sheet>
      <SheetTrigger className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-elevated ring-2 ring-primary/70 shadow-glow" aria-label="打开个人中心">
        <span className="text-sm font-black text-primary">A</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[84%] max-w-[340px] border-panel-border bg-background p-0 text-foreground">
        <div className="flex min-h-full flex-col px-4 pb-5 pt-6">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-elevated text-lg font-black text-primary ring-2 ring-primary/70 shadow-glow">A</span>
              <div>
                <SheetTitle className="text-lg font-black">Alpha Researcher</SheetTitle>
                <p className="mt-0.5 text-xs font-bold text-muted-foreground">Pro 试用中 · 6 天后到期</p>
              </div>
            </div>
          </SheetHeader>

          <div className="mt-5 rounded-2xl border border-primary/60 bg-primary/15 p-3">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-black text-primary">Database Credits</p><p className="mt-0.5 text-xl font-black">8,420</p></div>
              <Link to="/pricing" className="rounded-full bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground">升级</Link>
            </div>
          </div>

          <nav className="mt-4 space-y-2">
            {primaryActions.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-2.5 rounded-xl border border-panel-border bg-panel p-3 shadow-panel transition hover:border-primary/70">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-elevated text-sm font-black text-primary">{item.icon}</span>
                <span className="min-w-0 flex-1"><b className="block text-[13px]">{item.label}</b><span className="mt-0.5 block text-[11px] font-bold text-muted-foreground">{item.desc}</span></span>
                <span className="text-primary">›</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-panel-border pt-4 text-[11px] font-bold text-muted-foreground">
            CryptOracle · 加密社群情绪数据库
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BottomNav() {
  const { pathname } = useLocation();
  const items = [
    { to: "/" as const, label: "首页", icon: <PulseIcon /> },
    { to: "/coins" as const, label: "自选", icon: <CoinIcon /> },
    { to: "/insight" as const, label: "行情", icon: <BookIcon /> },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-3 border-t border-panel-border bg-background/95 px-6 pt-2 safe-bottom backdrop-blur-xl">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link key={item.to} to={item.to} className={`grid justify-items-center gap-0.5 transition ${active ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
            {item.icon}
            <span className="text-[11px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DataTable({ title, action, to, id, children }: { title: string; action?: string; to?: "/" | "/coins" | "/insight"; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="overflow-hidden rounded-2xl border border-panel-border bg-panel shadow-panel">
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <h2 className="text-base font-black tracking-tight">{title}</h2>
        {action && to ? <Link className="text-[11px] font-bold text-primary" to={to}>{action} →</Link> : null}
      </div>
      <div className="thin-scrollbar overflow-x-auto border-t border-panel-border">{children}</div>
    </section>
  );
}

export function StickyTh({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`sticky left-0 z-10 bg-panel px-2.5 py-2 text-[11px] uppercase tracking-wide ${className}`}>{children}</th>;
}

export function StickyTd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`sticky left-0 z-10 border-t border-panel-border/70 bg-panel px-2.5 py-1.5 ${className}`}>{children}</td>;
}

export function CoinLink({ symbol, className, children }: { symbol: string; className?: string; children: React.ReactNode }) {
  return <Link to="/coin/$symbol" params={{ symbol }} className={className}>{children}</Link>;
}

export function CoinAvatar({ symbol, tone, small }: { symbol: string; tone: Coin["avatar"]; small?: boolean }) {
  const toneClass = { primary: "bg-primary", signal: "bg-signal", warning: "bg-warning", positive: "bg-positive", negative: "bg-negative", secondary: "bg-secondary" }[tone];
  return <span className={`grid ${small ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-[11px]"} place-items-center rounded-full ${toneClass} font-black text-primary-foreground`}>{symbol[0]}</span>;
}

export function Sparkline({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 112 32" fill="none"><path d="M0 20 C14 8 24 26 38 14 S66 7 82 13 96 27 112 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
}

export function DualSparkline() {
  return <svg className="h-9 w-32" viewBox="0 0 132 36" fill="none"><path d="M0 24 C18 6 32 29 48 15 S76 10 92 18 112 31 132 9" stroke="var(--color-positive)" strokeWidth="3" strokeLinecap="round" /><path d="M0 16 C18 23 31 4 48 19 S78 30 96 13 116 7 132 20" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" /></svg>;
}

export function FooterBrand() {
  return <footer className="py-6 text-center text-[11px] text-muted-foreground"><div className="mb-1 inline-flex items-center gap-2 text-base font-black lowercase text-foreground"><span className="grid h-7 w-7 place-items-center rounded-lg border border-primary/60 bg-primary/15 text-primary">co</span>cryptoracle</div><p>Your Crypto Markets Dashboard, Optimized for Alpha</p></footer>;
}

function SearchIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>; }
function PulseIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h4l2-7 4 14 2-7h6" /></svg>; }
function CoinIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8" /></svg>; }
function BookIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" /><path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20" /></svg>; }
function BellIcon() { return <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>; }
