import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background px-4 pb-12 pt-5 text-foreground shadow-2xl">
      <header className="mb-8 flex items-center justify-between">
        <Link to="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-panel-border bg-panel px-4 font-bold text-muted-foreground">‹ 返回</Link>
        <span className="rounded-full border border-primary/60 px-3 py-1 text-sm font-bold text-primary">账户</span>
      </header>
      <section className="rounded-3xl border border-panel-border bg-panel p-6 shadow-panel">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-elevated text-2xl font-black text-primary ring-2 ring-primary/60">A</span>
          <div><h1 className="text-2xl font-black">Alpha Researcher</h1><p className="mt-1 text-sm font-bold text-muted-foreground">Pro 试用中 · 6 天后到期</p></div>
        </div>
      </section>
      <section className="mt-4 space-y-3 rounded-3xl border border-panel-border bg-panel p-4 shadow-panel">
        {['订阅管理', '通知设置', '数据导出', '安全与隐私'].map((item) => <button key={item} className="flex h-12 w-full items-center justify-between rounded-2xl bg-elevated px-4 text-left font-bold"><span>{item}</span><span className="text-primary">›</span></button>)}
      </section>
    </main>
  );
}
