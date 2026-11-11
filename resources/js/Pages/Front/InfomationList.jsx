import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import BlogPagination from '@/Components/navigations/BlogPagination';
import { readableTextColor } from '@/Components/common/contrast';
import {
  Typography,
  List,
  ListItemText,
  Box,
  Divider,
  Breadcrumbs,
  Link,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';

export default function InfomationList({ infomations_pagenation }) {
  const infomations = infomations_pagenation.data;
  return (
    <>
      <Helmet>
        <meta property="og:type" content="article" />
        <meta name="keywords" content={'INFO BOX,INFO BOX お知らせ一覧'} />
        <meta
          name="description"
          content={`お知らせ一覧 ${infomations_pagenation.current_page}ページ目 | INFO BOX`}
        />
        <link
          rel="canonical"
          href="https://info-space-box.net/infomations/list"
        />
      </Helmet>
      <Head
        title={`お知らせ一覧 ${infomations_pagenation.current_page}ページ目`}
      />
      <Front />
      <Breadcrumbs aria-label="breadcrumb" style={{ margin: '10px 15px' }}>
        <Link underline="hover" color="inherit" href="/">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Top 記事一覧
        </Link>
        <Typography color="text.primary">
          <InfoIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          お知らせ一覧
        </Typography>
      </Breadcrumbs>
      <MainFront
        element={
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={'bold'}
            >
              お知らせ一覧
            </Typography>
            <List>
              {infomations.map((infomation) => {
                return (
                  <React.Fragment key={infomation.id}>
                    {/* お知らせの詳細へのリンク(新しいタブで開ける・Tab キーで選べる) */}
                    {/* 押せることが分かるよう、右端に矢印を出す(マウスを乗せると背景色が変わり、矢印が少し動く) */}
                    <ListItemButton
                      component="a"
                      href={`/infomations/${infomation.id}`}
                      sx={{
                        '&:hover .info-arrow': { transform: 'translateX(3px)' },
                      }}
                    >
                      <ListItemText
                        primary={
                          <>
                            <Box
                              // 色が未設定のカテゴリは濃いグレーにする(白文字で 7.46:1)
                              bgcolor={infomation.color || '#555'}
                              color={readableTextColor(
                                infomation.color || '#555',
                              )}
                              fontWeight={'bold'}
                              style={{
                                display: 'inline-block',
                                margin: '0 10px 0 0',
                                padding: '0 10px',
                              }}
                            >
                              {infomation.category_name}
                            </Box>
                            {infomation.title}
                          </>
                        }
                        secondary={infomation.publish_at}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                      <ListItemIcon
                        className="info-arrow"
                        sx={{
                          minWidth: 0,
                          ml: 1,
                          transition: 'transform 0.15s',
                        }}
                        aria-hidden="true"
                      >
                        <ChevronRightIcon />
                      </ListItemIcon>
                    </ListItemButton>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
            <BlogPagination paginator={infomations_pagenation} />
          </>
        }
      />
      <FrontFooter />
    </>
  );
}

InfomationList.propTypes = {
  infomations_pagenation: PropTypes.object.isRequired,
};
