import React from 'react';
import { Pagination, PaginationItem } from '@mui/material';

type Props = {
  paginator: {
    first_page_url: string;
    current_page: number;
    last_page: number;
  };
};

// 一覧のページ送り。MUI の Pagination で、押せる範囲を44px四方にし、キーボードでも操作できるようにする
export default function BlogPagination(props: Props) {
  const { first_page_url, current_page, last_page } = props.paginator;

  // ページ番号のリンク先は、表示中の一覧のURL(first_page_url)の page だけを差し替えて作る
  const pageUrl = (page: number): string => {
    const url = new URL(first_page_url, window.location.origin);
    url.searchParams.set('page', String(page));
    return url.toString();
  };

  if (last_page <= 1) return null;

  return (
    <nav aria-label="ページ送り">
      <Pagination
        page={current_page}
        count={last_page}
        showFirstButton
        showLastButton
        siblingCount={1}
        getItemAriaLabel={(type, page, selected) => {
          if (type === 'page') {
            return selected ? `${page}ページ目(表示中)` : `${page}ページ目へ`;
          }
          return {
            first: '最初のページへ',
            last: '最後のページへ',
            next: '次のページへ',
            previous: '前のページへ',
          }[type];
        }}
        sx={{
          marginTop: '15px',
          '& .MuiPagination-ul': { justifyContent: 'center' },
        }}
        renderItem={(item) => (
          <PaginationItem
            component="a"
            href={item.page ? pageUrl(item.page) : undefined}
            {...item}
            sx={{
              minWidth: '44px',
              height: '44px',
              fontSize: '1rem',
              // 現在のページは背景色と太字で示す(白文字 × #1e7d0c = 5.26:1、BLOG-27)
              '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: 'var(--color-secondary)',
                color: '#fff',
                fontWeight: 'bold',
              },
            }}
          />
        )}
      />
    </nav>
  );
}
