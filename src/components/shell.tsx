import { Link, useLocation } from "@tanstack/react-router";
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
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background pb-28 text-foreground shadow-2xl">
      <TopBar />
      <div className="space-y-5 px-4 pb-6 pt-28">{children}</div>
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
    { label: "登录 / 注册", desc: "管理账户与订阅状态", to: "/login" as const, icon: "↗" },
    { label: "订阅付费", desc: "解锁完整数据库与 AI 报告", to: "/pricing" as const, icon: "◆" },
    { label: "数据导出", desc: "导出币种、指标与报告数据", to: "/export" as const, icon: "⇩" },
    { label: "安全与隐私", desc: "登录安全、隐私权限与数据管理", to: "/privacy" as const, icon: "◎" },
  ];

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

          <div className="mt-auto border-t border-panel-border pt-5 text-xs font-bold text-muted-foreground">
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
    { to: "/" as const, label: "行情", icon: <PulseIcon /> },
    { to: "/coins" as const, label: "币种", icon: <CoinIcon /> },
    { to: "/insight" as const, label: "洞察", icon: <BookIcon /> },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-3 border-t border-panel-border bg-background/95 px-6 pt-3 safe-bottom backdrop-blur-xl">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link key={item.to} to={item.to} className={`grid justify-items-center gap-1 transition ${active ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
            {item.icon}
            <span className="text-sm font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DataTable({ title, action, to, id, children }: { title: string; action?: string; to?: "/" | "/coins" | "/insight"; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="overflow-hidden rounded-3xl border border-panel-border bg-panel shadow-panel">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-2xl font-black">{title}</h2>
        {action && to ? <Link className="text-sm font-bold text-primary" to={to}>{action} →</Link> : null}
      </div>
      <div className="thin-scrollbar overflow-x-auto border-t border-panel-border">{children}</div>
    </section>
  );
}

export function StickyTh({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`sticky left-0 z-10 bg-panel px-3 py-3 ${className}`}>{children}</th>;
}

export function StickyTd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`sticky left-0 z-10 border-t border-panel-border/70 bg-panel px-3 py-2 ${className}`}>{children}</td>;
}

export function CoinLink({ symbol, className, children }: { symbol: string; className?: string; children: React.ReactNode }) {
  return <Link to="/coin/$symbol" params={{ symbol }} className={className}>{children}</Link>;
}

export function CoinAvatar({ symbol, tone, small }: { symbol: string; tone: Coin["avatar"]; small?: boolean }) {
  const toneClass = { primary: "bg-primary", signal: "bg-signal", warning: "bg-warning", positive: "bg-positive", negative: "bg-negative", secondary: "bg-secondary" }[tone];
  return <span className={`grid ${small ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"} place-items-center rounded-full ${toneClass} font-black text-primary-foreground`}>{symbol[0]}</span>;
}

export function Sparkline({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 112 32" fill="none"><path d="M0 20 C14 8 24 26 38 14 S66 7 82 13 96 27 112 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
}

export function DualSparkline() {
  return <svg className="h-9 w-32" viewBox="0 0 132 36" fill="none"><path d="M0 24 C18 6 32 29 48 15 S76 10 92 18 112 31 132 9" stroke="var(--color-positive)" strokeWidth="3" strokeLinecap="round" /><path d="M0 16 C18 23 31 4 48 19 S78 30 96 13 116 7 132 20" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" /></svg>;
}

export function FooterBrand() {
  return <footer className="py-10 text-center text-muted-foreground"><div className="mb-2 inline-flex items-center gap-3 text-xl font-black lowercase text-foreground"><span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/60 bg-primary/15 text-primary">co</span>cryptoracle</div><p>Your Crypto Markets Dashboard, Optimized for Alpha</p></footer>;
}

function SearchIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>; }
function PulseIcon() { return <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h4l2-7 4 14 2-7h6" /></svg>; }
function CoinIcon() { return <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8" /></svg>; }
function BookIcon() { return <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" /><path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20" /></svg>; }
