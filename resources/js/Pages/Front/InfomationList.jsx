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
} from '@mui/material';

export default function InfomationList({ infomations_pagenation }) {
  console.log(infomations_pagenation);

  const infomations = infomations_pagenation.data;
  return (
    <>
      <Front />
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
