import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background px-4 pb-12 pt-5 text-foreground shadow-2xl">
      <header className="mb-8 flex items-center justify-between">
        <Link to="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-panel-border bg-panel px-4 font-bold text-muted-foreground">‹ 返回</Link>
        <span className="rounded-full border border-primary/60 px-3 py-1 text-sm font-bold text-primary">安全</span>
      </header>
      <section className="rounded-3xl border border-panel-border bg-panel p-6 shadow-panel">
        <h1 className="text-3xl font-black">安全与隐私</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-muted-foreground">集中管理登录保护、数据权限与历史记录保留方式。</p>
        <div className="mt-6 space-y-3">
          {["双重验证", "登录设备", "数据使用授权", "清除历史记录"].map((item) => (
            <button key={item} className="flex h-13 w-full items-center justify-between rounded-2xl border border-panel-border bg-elevated px-4 text-left font-bold">
              <span>{item}</span><span className="text-primary">›</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
