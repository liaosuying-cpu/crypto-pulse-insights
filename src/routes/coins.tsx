import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, DataTable, StickyTh, StickyTd, CoinLink, CoinAvatar, DualSparkline, FooterBrand, coins, latest, type Coin } from "@/components/shell";

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
    <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-black">币种</h2>
        <Link to="/" className="rounded-full border border-primary/60 px-4 py-2 text-sm font-bold text-primary">显示更多</Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MiniCoinTable title="热门币种" data={coins.slice(0, 3)} />
        <MiniCoinTable title="最新上线" data={latest} />
      </div>
    </section>
  );
}

function MiniCoinTable({ title, data }: { title: string; data: Array<{ rank: number; symbol: string; name?: string; price: string; change: string; tone: "up" | "down"; avatar: Coin["avatar"] }> }) {
  return (
    <div className="rounded-2xl border border-panel-border bg-background/45 p-3">
      <h3 className="mb-3 font-black text-muted-foreground">{title}</h3>
      <div className="space-y-3">
        {data.map((coin) => (
          <CoinLink key={coin.symbol} symbol={coin.symbol} className="grid grid-cols-[1rem_1.75rem_1fr] items-center gap-2">
            <span className="text-xs text-muted-foreground">{coin.rank}</span>
            <CoinAvatar symbol={coin.symbol} tone={coin.avatar} small />
            <span className="min-w-0 text-right">
              <b className="block truncate text-sm">{coin.symbol}</b>
              <span className="block text-xs font-bold text-foreground">{coin.price}</span>
              <span className={coin.tone === "up" ? "block text-xs font-bold text-positive" : "block text-xs font-bold text-negative"}>{coin.change}</span>
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
      <table className="w-[940px] border-separate border-spacing-0 text-left text-sm">
        <thead className="text-xs text-muted-foreground"><tr><StickyTh className="w-40">#币种</StickyTh><th className="px-3 py-3">#热度</th><th className="px-3 py-3">#price</th><th className="px-3 py-3">#market & sentiment</th><th className="px-3 py-3">#KOLS 24h/7d</th><th className="px-3 py-3">#popular 24h/7d</th><th className="px-3 py-3">#communites 24h/7d</th></tr></thead>
        <tbody>{coins.map((coin) => <tr key={coin.symbol}><StickyTd><CoinLink symbol={coin.symbol} className="flex items-center gap-3 py-3"><CoinAvatar symbol={coin.symbol} tone={coin.avatar} /><span><b className="block">{coin.symbol}</b><span className="text-xs text-muted-foreground">{coin.name}</span></span></CoinLink></StickyTd><td className="px-3 py-3 font-black text-primary">{coin.heat}</td><td className="px-3 py-3 font-bold">{coin.price}</td><td className="px-3 py-3"><DualSparkline /></td><td className="px-3 py-3"><b>{coin.kol24}</b><span className="text-muted-foreground"> / {coin.kol7}</span></td><td className="px-3 py-3"><b>{coin.popular24}</b><span className="text-muted-foreground"> / {coin.popular7}</span></td><td className="px-3 py-3"><b>{coin.communities24}</b><span className="text-muted-foreground"> / {coin.communities7}</span></td></tr>)}</tbody>
      </table>
    </DataTable>
  );
}
