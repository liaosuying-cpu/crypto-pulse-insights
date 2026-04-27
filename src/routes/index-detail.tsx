import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, FooterBrand } from "@/components/shell";

export const Route = createFileRoute("/index-detail")({
  head: () => ({
    meta: [
      { title: "指数详情 · CO10 AIVIX & CO10 index" },
      { name: "description", content: "CO10 index 与 CO10 AIVIX 指数方法论、覆盖范围与计算说明。" },
    ],
  }),
  component: IndexDetailPage,
});

function IndexDetailPage() {
  return (
    <PageShell>
      <div className="space-y-3">
        <Link to="/" className="inline-block text-[12px] font-bold text-primary">← 返回行情</Link>
        <Section title="CO10 index">
          针对加密资产市场高波动、高更替率的特征，提出了一种标准化的市值加权基准指数。覆盖加密市场流通市值前 10 的资产，季度调整一次成分。指数采用拉氏链式法计算，剔除分红、增发等结构性偏差，反映市场整体趋势。
        </Section>
        <Section title="CO10 AIVIX">
          专注于私域数据（Private Domain Data），捕捉深层社群（Telegram / Discord / 私群 KOL 频道）的情绪波动。通过 NLP 模型对原始讨论进行情绪打分与放大系数加权，输出 0-100 区间的情绪指数，为市场提供先导性预警。
        </Section>
        <Section title="数据更新与覆盖">
          数据每 60 秒滚动一次，覆盖 200+ 私域社群与 1,200+ KOL。历史回测显示 AIVIX 对极端行情的领先窗口约为 4-12 小时。
        </Section>
        <FooterBrand />
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel p-3.5 shadow-panel">
      <h2 className="mb-2 text-[13px] font-black tracking-tight text-primary">{title}</h2>
      <p className="text-[12px] leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
