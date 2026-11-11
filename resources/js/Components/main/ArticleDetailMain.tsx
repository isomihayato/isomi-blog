import { Box, Paper, Skeleton, Typography } from '@mui/material';
import React from 'react';
import Tags from '@/Components/Tags';
import { Suspense } from 'react';
import { ArticleType } from '../types/ArticleTypes';
import SnsSideBar from '@/Components/sidebar/SnsSideBar';
import { useFavoriteClick } from '@/Components/common/favorite';
import GenreChip from '@/Components/GenreChip';
import CachedIcon from '@mui/icons-material/Cached';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatJstDate } from '../common/dateFormat';
import ShareButtons from '@/Components/sns/ShareButtons';

type Props = {
  article: ArticleType;
  articleElements: JSX.Element[];
  elements: JSX.Element[];
  action: string;
  setAction: React.Dispatch<React.SetStateAction<string>>;
};
export default function ArticleDetailMain(props: Props) {
  const { article, articleElements, elements } = props;
  // お気に入り数はページ表示時に受け取る(以前はコメントの投稿・編集のたびにも API で取り直していた)
  const [favorites, setFavorites] = React.useState<number | undefined>(
    article.favorites_count,
  );
  // この端末でお気に入り登録済みかどうか(BLOG-58。件数と同じくページ表示時に受け取る)
  const [favorited, setFavorited] = React.useState(article.favorited === true);
  const onFavorite = useFavoriteClick(
    article.id,
    setFavorites,
    favorited,
    setFavorited,
  );

  const snsNavShow = window.location.href.includes('/articles/details/')
    ? true
    : false;
  const publishedDate = formatJstDate(article.published_at);
  const updatedDate = formatJstDate(article.updated_at);
  const underTitleSpanStype = {
    fontSize: '.8rem',
    fontWeight: '600',
    color: '#666', // 白背景の上で 5.74:1
  };
  return (
    <>
      <Box
        id="main"
        className="font-style"
        sx={{
          display: 'flex',
          width: '100%',
          mx: 'auto',
          mt: { xs: '25px', md: '50px' },
          mb: { md: '50px' },
          minHeight: '65vh',
        }}
      >
        {/* SNSボタンの列。スマホ幅では画面下に固定したバーになるため、幅を取らない */}
        <Box sx={{ flexShrink: 0, width: { md: '100px' } }}>
          <SnsSideBar
            article={article}
            favorites={favorites}
            onFavorite={onFavorite}
          />
        </Box>
        {/* 本文は最大 800px にして、大きな画面でも1行が長くなりすぎないようにする */}
        <Box sx={{ flex: '1 1 auto', minWidth: 0, maxWidth: '800px' }}>
          {articleElements?.map((element, index) => (
            <Box key={index + 'main-content'} component={Paper}>
              <span
                style={{ margin: '15px 0 0 20px', display: 'inline-block' }}
              >
                <GenreChip genre={article.genre} size="medium" />
              </span>
              <Box
                sx={{
                  padding: { xs: '5px 20px', md: '0px 56px 0' },
                  fontSize: { xs: '1.65rem', md: '1.8rem' },
                  fontWeight: 'bold',
                }}
              >
                <h1> {article.title}</h1>
                <span style={underTitleSpanStype}>
                  <time dateTime={publishedDate}>{publishedDate}</time>
                  に公開
                </span>
                {/* 公開日より後に更新したときだけ、最終更新日を出す */}
                {updatedDate > publishedDate ? (
                  <span title="最終更新日">
                    <CachedIcon style={{ marginLeft: '10px', color: '#666' }} />
                    <span style={underTitleSpanStype}>
                      <time dateTime={updatedDate}>{updatedDate}</time>
                      に更新
                    </span>
                  </span>
                ) : null}
                {article.reading_minutes ? (
                  <span title="読了時間の目安">
                    <AccessTimeIcon
                      style={{ marginLeft: '10px', color: '#666' }}
                    />
                    <span style={underTitleSpanStype}>
                      約{article.reading_minutes}分で読めます
                    </span>
                  </span>
                ) : null}
                <div>
                  <Tags tags={article.tags.split(',')} />
                </div>
              </Box>

              <Suspense fallback={<Skeleton variant="rounded" height={400} />}>
                <Box sx={{ padding: { xs: '10px 15px', md: '0 56px 32px' } }}>
                  {element}
                </Box>
              </Suspense>

              {snsNavShow && (
                <>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ mt: 2 }}
                    style={{
                      fontSize: '1.2rem',
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      fontWeight: 'bold',
                      padding: '10px',
                      marginBottom: '20px',
                    }}
                  >
                    励みになります！
                  </Typography>
                  {/* 共有ボタンは本文下と左の固定表示(スマホは下部バー)の2か所にそろえる */}
                  <Box sx={{ paddingBottom: '20px' }}>
                    <ShareButtons
                      url={`https://info-space-box.net/articles/details/${article.id}`}
                      title={article.title}
                    />
                  </Box>
                </>
              )}
            </Box>
          ))}
          {elements.map((element, index) => (
            <Box
              key={index + 'main-content'}
              component={Paper}
              sx={{ marginTop: '30px' }}
            >
              <Suspense fallback={<Skeleton variant="rounded" height={400} />}>
                <Box
                  sx={{
                    padding: { xs: '1rem 0 0', md: '1.5rem 2rem' },
                  }}
                >
                  {element}
                </Box>
              </Suspense>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
ArticleDetailMain.defaultProps = {};
