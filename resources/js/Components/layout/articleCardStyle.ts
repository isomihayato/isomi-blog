// 記事カードの共通スタイル。
// タイトルのリンク(.article-card__link)の ::after をカード全体に広げて、カードのどこを押しても記事に移動できるようにする。
// カードの中のタグのリンクは、z-index で ::after より上に置いて押せるようにする。
export const articleCardSx = {
  position: 'relative',
  padding: '16px 24px',
  textAlign: 'left',
  color: 'text.secondary',
  border: '1px solid transparent',
  transition: 'box-shadow .2s, border-color .2s',
  '&:hover, &:focus-within': {
    boxShadow: 6,
    borderColor: 'primary.main',
  },
  '& .article-card__link': {
    color: 'text.primary',
    textDecoration: 'none',
    outline: 'none',
  },
  '& .article-card__link::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  '& .article-card__above': {
    position: 'relative',
    zIndex: 2,
  },
};

// 公開日を YYYY-MM-DD で返す(published_at は "YYYY-MM-DD HH:MM:SS" の文字列)
export function formatPublishedDate(publishedAt: string | null | undefined) {
  return publishedAt ? publishedAt.slice(0, 10) : '';
}
