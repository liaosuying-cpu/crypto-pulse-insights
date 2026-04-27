import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/shell";

export const Route = createFileRoute("/insight")({
  head: () => ({
    meta: [
      { title: "洞察 · CryptOracle 加密市场数据库" },
      { name: "description", content: "AI 报告、关键市场指标与精选研究，量化决策必读。" },
      { property: "og:title", content: "洞察 · CryptOracle" },
      { property: "og:description", content: "AI 报告与关键市场指标洞察面板。" },
    ],
  }),
  component: InsightPage,
});

const articles = [
  ["观点", "社交恐慌回落后，BTC 波动率正在重新定价", "CO Research", "2小时前"],
  ["案例", "SOL 生态热度反转如何领先价格 36 小时", "Alpha Desk", "4小时前"],
  ["观点", "KOL 分歧扩大：Layer2 交易拥挤度的量化信号", "ChainScope", "6小时前"],
];

function InsightPage() {
  return (
    <PageShell>
      <h1 className="sr-only">洞察</h1>
      <AiReport />
      <InsightMetrics />
      <ArticleList />
    </PageShell>
  );
}

function AiReport() {
  return (
    <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
      <h2 className="mb-4 text-2xl font-black">AI 报告</h2>
      <div className="mb-4 grid grid-cols-3 rounded-2xl border border-panel-border bg-background/40 p-1 text-center text-sm font-bold">
        <span className="rounded-xl bg-primary px-2 py-2 text-primary-foreground">市场情绪</span>
        <span className="px-2 py-2 text-muted-foreground">社交数据</span>
        <span className="px-2 py-2 text-muted-foreground">KOL 洞察</span>
      </div>
      <p className="text-base font-bold leading-7 text-muted-foreground">
        CO10 情绪扩散速度高于价格动量，短周期风险偏好回升。BTC 与 SOL 的社群提及量同步上升，但 KOL 观点分歧扩大，适合以波动率与热度背离作为观察因子。
      </p>
    </section>
  );
}

function InsightMetrics() {
  const metrics: Array<[string, number]> = [["CO-A-05-01", 92], ["CO-A-04-02", 76], ["CO-B-03-01", 61], ["CO-B-05-02", 48]];
  return (
    <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="mb-4 text-lg font-black">高频标签</h2>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-primary/60 bg-primary/15 px-3 py-2 text-sm font-bold text-primary">CO-B-03-01</span>
            <span className="rounded-full border border-signal/60 bg-signal/15 px-3 py-2 text-sm font-bold text-signal">CO-B-05-02</span>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-black">关键市场指标</h2>
          <div className="space-y-3">
            {metrics.map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{label}</span><span>{value}</span></div>
                <div className="h-2 rounded-full bg-elevated"><div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleList() {
  return (
    <section className="rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
      <h2 className="mb-4 text-2xl font-black">推荐文章</h2>
      <div className="mb-4 flex gap-2 text-sm font-black">
        <span className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">观点</span>
        <span className="rounded-lg border border-panel-border px-4 py-2 text-muted-foreground">案例</span>
      </div>
      <div className="space-y-3">
        {articles.map(([type, title, source, time]) => (
          <article key={title} className="border-l-2 border-primary bg-elevated p-4">
            <div className="mb-2 text-xs font-bold text-primary">{type}</div>
            <h3 className="font-black leading-6">{title}</h3>
            <p className="mt-2 text-xs text-muted-foreground">{source} · {time}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
