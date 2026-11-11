import React from 'react';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
type Proops = {
  paginator: {
    first_page_url: string;
    last_page_url: string;
    next_page_url: string;
    prev_page_url: string;
    current_page: number;
    last_page: number;
  };
};
export default function Pagination(props: Proops) {
  const { paginator } = props;
  const showMaxPage = 5;
  const gap = (showMaxPage - 1) / 2;
  const {
    first_page_url,
    last_page_url,
    next_page_url,
    prev_page_url,
    current_page,
    last_page,
  } = paginator;

  // ページ番号のリンク先は、表示中の一覧のURL(first_page_url)の page だけを差し替えて作る
  const pageUrl = (page: number): string => {
    const url = new URL(first_page_url, window.location.origin);
    url.searchParams.set('page', String(page));
    return url.toString();
  };

  const start_page = current_page - gap <= 0 ? 1 : current_page - gap;
  const end_page =
    current_page + gap >= last_page ? last_page : current_page + gap;

  const pageNums: JSX.Element[] = [];
  for (let index = start_page; index <= end_page; index++) {
    pageNums.push(
      <a
        key={index}
        href={pageUrl(index)}
        className={`pagination-link ${
          current_page === index ? 'current-page' : ''
        }`}
        aria-current={current_page === index ? 'page' : undefined}
        style={
          current_page === index
            ? {
                // 現在のページは背景色と太字で示す(白文字 × #1e7d0c = 5.26:1)
                margin: '0 5px',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#1e7d0c',
                color: '#fff',
                fontWeight: 'bold',
              }
            : {
                // それ以外のページ(#555 × ページ背景 #dddddd = 5.49:1)
                margin: '0 5px',
                padding: '2px 8px',
                color: '#555',
              }
        }
      >
        {index}
      </a>,
    );
  }

  return (
    <div className="pagination" style={{ marginTop: '15px' }}>
      <a
        href={first_page_url}
        className="pagination-link"
        style={{ display: current_page === 1 ? 'none' : 'span' }}
      >
        <FirstPageIcon style={{ color: 'rgba(0, 0, 0, 0.6)' }} />
      </a>

      <a
        href={prev_page_url}
        className="pagination-link"
        style={{ display: !prev_page_url ? 'none' : 'span' }}
      >
        <NavigateBeforeIcon style={{ color: 'rgba(0, 0, 0, 0.6)' }} />
      </a>
      {last_page !== 1 ? pageNums : null}

      <a
        href={next_page_url}
        className="pagination-link"
        style={{ display: !next_page_url ? 'none' : 'span' }}
      >
        <NavigateNextIcon style={{ color: 'rgba(0, 0, 0, 0.6)' }} />
      </a>

      <a
        href={last_page_url}
        className="pagination-link"
        style={{ display: current_page === last_page ? 'none' : 'span' }}
      >
        <LastPageIcon style={{ color: 'rgba(0, 0, 0, 0.6)' }} />
      </a>
    </div>
  );
}
