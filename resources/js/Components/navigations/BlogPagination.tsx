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

  const start_page = current_page - gap <= 0 ? 1 : current_page - gap;
  const end_page =
    current_page + gap >= last_page ? last_page : current_page + gap;

  const pageNums: JSX.Element[] = [];
  for (let index = start_page; index <= end_page; index++) {
    pageNums.push(
      <a
        key={index}
        href={`/infomations/list?page=${index}`}
        className={`pagination-link ${
          current_page === index ? 'current-page' : ''
        }`}
        style={{
          margin: '0 5px',
          color:
            current_page === index
              ? 'rgba(0, 0, 0, 0.6)'
              : 'silver                                                                                                                                                                        ',
        }}
      >
        {index}
      </a>,
    );
  }

  return (
    <div className="pagination">
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
