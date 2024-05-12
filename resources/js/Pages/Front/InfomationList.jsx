import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import BlogPagination from '@/Components/navigations/BlogPagination';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Breadcrumbs,
  Link,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';
import ResponsibleHeader from '@/Components/header/ResponsibleHeader';

export default function InfomationList({ infomations_pagenation }) {
  const infomations = infomations_pagenation.data;
  return (
    <>
      <Helmet>
        <meta property="og:type" content="article" />
        <meta
          name="keywords"
          content={'MIE Fishing,MIE Fishing お知らせ一覧'}
        />
        <meta
          name="description"
          content="お知らせ一覧 ${infomations_pagenation.current_page}ページ目 | MIE Fishing"
        />
        <link
          rel="canonical"
          href="https://mie-fishing.info/infomations/list"
        />
      </Helmet>
      <Head
        title={`お知らせ一覧 ${infomations_pagenation.current_page}ページ目`}
      />
      <ResponsibleHeader
        breadcrumbsLink={
          <>
            <Breadcrumbs
              aria-label="breadcrumb"
              style={{ margin: '10px 15px' }}
            >
              <Link underline="hover" color="inherit" href="/">
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Top 記事一覧
              </Link>
              <Typography color="text.primary">
                <InfoIcon sx={{ fontSize: '1rem' }} fontSize="inherit" />
                お知らせ一覧
              </Typography>
            </Breadcrumbs>
          </>
        }
      />
      <MainFront
        element={
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              お知らせ一覧
            </Typography>
            <List>
              {infomations.map((infomation) => {
                return (
                  <>
                    <ListItem
                      key={infomation.id}
                      onClick={() =>
                        (window.location.href = `/infomations/${infomation.id}`)
                      }
                    >
                      <ListItemText
                        primary={
                          <>
                            <Box
                              bgcolor={infomation.color}
                              color="white"
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
                    </ListItem>
                    <Divider />
                  </>
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
