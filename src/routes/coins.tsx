import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, DataTable, StickyTh, StickyTd, CoinLink, CoinAvatar, DualSparkline, FooterBrand, coins, latest, type Coin } from "@/components/shell";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/coins")({
  head: () => ({
    meta: [
      { title: "币种 · CryptOracle 加密市场数据库" },
      { name: "description", content: "热门币种、最新上线与自选币种总览，含情绪、KOL、社区指标。" },
      { property: "og:title", content: "币种 · CryptOracle" },
      { property: "og:description", content: "自选币种与最新上线代币的多维数据面板。" },
    ],
  }),
  component: CoinsPage,
});

function CoinsPage() {
  return (
    <PageShell>
      <h1 className="sr-only">币种</h1>
      <CoinOverview />
      <WatchlistTable />
      <FooterBrand />
    </PageShell>
  );
}

function CoinOverview() {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-black tracking-tight">币种</h2>
        <Link to="/" className="rounded-full border border-primary/60 px-3 py-1 text-[11px] font-bold text-primary">显示更多</Link>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <MiniCoinTable title="热门币种" data={coins.slice(0, 3)} />
        <MiniCoinTable title="最新上线" data={latest} />
      </div>
    </section>
  );
}

function MiniCoinTable({ title, data }: { title: string; data: Array<{ rank: number; symbol: string; name?: string; price: string; change: string; tone: "up" | "down"; avatar: Coin["avatar"] }> }) {
  return (
    <div className="rounded-xl border border-panel-border bg-background/45 p-2.5">
      <h3 className="mb-2 text-[11px] font-black uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="space-y-2">
        {data.map((coin) => (
          <CoinLink key={coin.symbol} symbol={coin.symbol} className="grid grid-cols-[0.75rem_1.5rem_1fr] items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{coin.rank}</span>
            <CoinAvatar symbol={coin.symbol} tone={coin.avatar} small />
            <span className="min-w-0 text-right leading-tight">
              <b className="block truncate text-[12px]">{coin.symbol}</b>
              <span className="block text-[11px] font-bold text-foreground">{coin.price}</span>
              <span className={coin.tone === "up" ? "block text-[10px] font-bold text-positive" : "block text-[10px] font-bold text-negative"}>{coin.change}</span>
            </span>
          </CoinLink>
        ))}
      </div>
    </div>
  );
}

function WatchlistTable() {
  return (
    <DataTable title="自选币种">
      <table className="w-[840px] border-separate border-spacing-0 text-left text-[12px]">
        <thead className="text-[10px] uppercase tracking-wide text-muted-foreground"><tr><StickyTh className="w-36">币种</StickyTh><th className="px-2.5 py-2">热度</th><th className="px-2.5 py-2">price</th><th className="px-2.5 py-2">market & sentiment</th><th className="px-2.5 py-2">KOLS 24h/7d</th><th className="px-2.5 py-2">popular 24h/7d</th><th className="px-2.5 py-2">communites 24h/7d</th></tr></thead>
        <tbody>{coins.map((coin) => <tr key={coin.symbol}><StickyTd><CoinLink symbol={coin.symbol} className="flex items-center gap-2 py-2"><CoinAvatar symbol={coin.symbol} tone={coin.avatar} /><span className="leading-tight"><b className="block">{coin.symbol}</b><span className="text-[10px] text-muted-foreground">{coin.name}</span></span></CoinLink></StickyTd><td className="px-2.5 py-1.5 font-black text-primary">{coin.heat}</td><td className="px-2.5 py-1.5 font-bold">{coin.price}</td><td className="px-2.5 py-1.5"><DualSparkline /></td><td className="px-2.5 py-1.5"><b>{coin.kol24}</b><span className="text-muted-foreground"> / {coin.kol7}</span></td><td className="px-2.5 py-1.5"><b>{coin.popular24}</b><span className="text-muted-foreground"> / {coin.popular7}</span></td><td className="px-2.5 py-1.5"><b>{coin.communities24}</b><span className="text-muted-foreground"> / {coin.communities7}</span></td></tr>)}</tbody>
      </table>
    </DataTable>
  );
}
