import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/export")({
  component: ExportPage,
});

function ExportPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background px-4 pb-12 pt-5 text-foreground shadow-2xl">
      <header className="mb-8 flex items-center justify-between">
        <Link to="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-panel-border bg-panel px-4 font-bold text-muted-foreground">‹ 返回</Link>
        <span className="rounded-full border border-primary/60 px-3 py-1 text-sm font-bold text-primary">导出</span>
      </header>
      <section className="rounded-3xl border border-panel-border bg-panel p-6 shadow-panel">
        <h1 className="text-3xl font-black">数据导出</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-muted-foreground">选择需要导出的数据库内容，用于量化模型回测与离线分析。</p>
        <div className="mt-6 space-y-3">
          {["币种社群情绪", "KOL 讨论记录", "CO 指标调用", "AI 报告归档"].map((item) => (
            <button key={item} className="flex h-13 w-full items-center justify-between rounded-2xl border border-panel-border bg-elevated px-4 text-left font-bold">
              <span>{item}</span><span className="text-primary">CSV</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
