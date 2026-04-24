import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "订阅付费 — CryptOracle" },
      { name: "description", content: "选择 CryptOracle 加密社群情绪数据订阅方案。" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background px-4 pb-12 pt-5 text-foreground shadow-2xl">
      <header className="mb-8 flex items-center justify-between">
        <Link to="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-panel-border bg-panel px-4 font-bold text-muted-foreground">‹ 返回</Link>
        <span className="rounded-full border border-primary/60 px-3 py-1 text-sm font-bold text-primary">订阅</span>
      </header>
      <section className="rounded-3xl border border-primary/70 bg-panel p-6 shadow-glow">
        <p className="text-sm font-black text-primary">PRO</p>
        <h1 className="mt-2 text-3xl font-black">量化决策会员</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-muted-foreground">解锁完整 CO Labels、KOL 历史数据、AI 深度报告与导出能力。</p>
        <div className="mt-6 text-4xl font-black">¥199<span className="text-base text-muted-foreground"> / 月</span></div>
        <button className="mt-6 h-12 w-full rounded-2xl bg-primary font-black text-primary-foreground">立即开通</button>
      </section>
      <section className="mt-4 rounded-3xl border border-panel-border bg-panel p-5 shadow-panel">
        <h2 className="mb-4 text-xl font-black">包含功能</h2>
        <div className="space-y-3 text-sm font-bold text-muted-foreground"><p>完整社群情绪数据库</p><p>KOL 影响力与讨论链路</p><p>多周期指标预警与报告</p></div>
      </section>
    </main>
  );
}