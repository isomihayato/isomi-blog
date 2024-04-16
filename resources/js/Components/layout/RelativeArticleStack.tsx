import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Avatar, Grid } from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { isMobile } from 'react-device-detect';
import { ArticleType } from '../types/ArticleTypes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Props = {
  articles: ArticleType[];
};

export default function RelativeArticleStack(props: Props) {
  const { articles } = props;

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {articles?.map((article: ArticleType) => (
          <Item
            key={article.id}
            onClick={() => {
              window.location.href = '/articles/details/' + article.id;
            }}
            style={{ padding: '16px 24px' }}
          >
            <div>
              <Grid container spacing={2}>
                {isMobile ? null : (
                  <Grid item xs={12} md={2}>
                    <div id="icon" style={{ float: 'right' }}>
                      <Avatar
                        alt="ブログアバター"
                        sx={{ width: '40px', height: '40px' }}
                      >
                        <ImageNotSupportedIcon />
                      </Avatar>
                    </div>
                  </Grid>
                )}
                <Grid item xs={12} md={10}>
                  <div id="item--header" style={{ textAlign: 'left' }}>
                    <div
                      id="item--date"
                      style={{ fontSize: '.8rem', overflow: 'hidden' }}
                    >
                      {article.created_at.slice(0, 10)}
                    </div>
                  </div>
                  <div
                    id="item--content"
                    style={{
                      fontSize: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      overflow: 'hidden',
                    }}
                  >
                    {article.title}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Item>
        ))}
      </Stack>
    </Box>
  );
}
