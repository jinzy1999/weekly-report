import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '周报生成器 - AI 驱动的周报撰写工具',
  description:
    '输入你的工作要点，一键生成专业周报。支持多种风格，免费使用。打工人必备的周报助手。',
  keywords: ['周报', '周报生成器', 'AI周报', '日报', '工作总结', '职场工具'],
  openGraph: {
    title: '周报生成器 - 一键生成专业周报',
    description: '输入工作要点，AI 帮你写出让老板满意的周报。免费、快速、好用。',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
