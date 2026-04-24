import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "登录 — CryptOracle" },
      { name: "description", content: "登录 CryptOracle 加密市场数据库，管理订阅与个人数据。" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-background px-4 pb-12 pt-5 text-foreground shadow-2xl">
      <header className="mb-8 flex items-center justify-between">
        <Link to="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-panel-border bg-panel px-4 font-bold text-muted-foreground">‹ 返回</Link>
        <span className="rounded-full border border-primary/60 px-3 py-1 text-sm font-bold text-primary">登录</span>
      </header>
      <section className="rounded-3xl border border-panel-border bg-panel p-6 shadow-panel">
        <h1 className="text-3xl font-black">欢迎回来</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-muted-foreground">登录后可同步自选币种、订阅状态与个人指标偏好。</p>
        <div className="mt-8 space-y-3">
          <label className="block rounded-2xl border border-panel-border bg-elevated px-4 py-3 text-sm text-muted-foreground">邮箱<input className="mt-2 w-full bg-transparent text-base font-bold text-foreground outline-none" placeholder="name@example.com" /></label>
          <label className="block rounded-2xl border border-panel-border bg-elevated px-4 py-3 text-sm text-muted-foreground">密码<input className="mt-2 w-full bg-transparent text-base font-bold text-foreground outline-none" placeholder="••••••••" type="password" /></label>
          <button className="h-12 w-full rounded-2xl bg-primary font-black text-primary-foreground">登录 / 注册</button>
        </div>
      </section>
    </main>
  );
}