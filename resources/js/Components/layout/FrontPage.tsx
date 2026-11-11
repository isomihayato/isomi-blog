import React, { ReactNode } from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';

export type Crumb = {
  label: string;
  // 省略すると、表示中のページ(リンクなし)として出す
  href?: string;
  icon?: ReactNode;
};

const iconSx = { mr: 0.5, verticalAlign: '-0.125em' };

/**
 * パンくずリスト。先頭の「Top 記事一覧」は自動で付ける。
 * items が空のときは、トップページ(「Top 記事一覧」が表示中のページ)として出す。
 */
export function PageBreadcrumbs({ items }: { items: Crumb[] }) {
  const home: Crumb = {
    label: 'Top 記事一覧',
    href: items.length > 0 ? '/' : undefined,
    icon: <HomeIcon sx={iconSx} fontSize="inherit" />,
  };
  const crumbs = [home, ...items];
  return (
    <Breadcrumbs aria-label="パンくずリスト" sx={{ mx: 2, my: 1.25 }}>
      {crumbs.map((crumb) =>
        crumb.href ? (
          <Link
            key={crumb.label}
            underline="hover"
            color="inherit"
            href={crumb.href}
          >
            {crumb.icon}
            {crumb.label}
          </Link>
        ) : (
          <Typography
            key={crumb.label}
            color="text.primary"
            aria-current="page"
          >
            {crumb.icon}
            {crumb.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
}

/** ページの見出し(h1)。全画面で同じ見た目にする */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="h4"
      component="h1"
      gutterBottom
      sx={{
        fontWeight: 'bold',
        // basic.css の h1 の下線と文字・本文の間をあける
        pb: 0.5,
        mb: 2,
        // 長い見出しでもスマホで折り返しすぎないよう、小さい画面では文字を小さくする
        fontSize: { xs: '1.5rem', sm: '2.125rem' },
      }}
    >
      {children}
    </Typography>
  );
}

type Props = {
  breadcrumbs: Crumb[];
  // 省略すると h1 を出さない(ページ側で独自の見出しを出すとき)
  title?: ReactNode;
  // 本文を白い枠(Paper)で囲むか
  paper?: boolean;
  children: ReactNode;
};

/**
 * 公開側の画面の枠: ヘッダー + パンくずリスト + 見出し(h1) + 本文の枠 + フッター。
 */
export default function FrontPage({
  breadcrumbs,
  title,
  paper = true,
  children,
}: Props) {
  return (
    <>
      <Front />
      <PageBreadcrumbs items={breadcrumbs} />
      <MainFront
        paper={paper}
        element={
          <>
            {title ? <PageTitle>{title}</PageTitle> : null}
            {children}
          </>
        }
      />
      <FrontFooter />
    </>
  );
}
