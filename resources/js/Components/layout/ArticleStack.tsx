import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Avatar, Grid } from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { ChipPropsColorOverrides } from '@mui/material/Chip';
import { OverridableStringUnion } from '@mui/types';
import Tags from '@/Components/Tags';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Props = {
    articles: any;
};
type Color = {
  color: OverridableStringUnion<
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
  ChipPropsColorOverrides>;
}
export default function ArticleStack(props: Props) {
  const { articles } = props;

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {
            articles.map((article: any) => (
                <Item 
                  key={article.id} 
                  onClick={()=>{window.location.href="/articles/details/"+article.id}}
                  style={{padding: '16px 24px'}}
                >
                    <div >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={1.3}>
                                <div id="icon" style={{float: 'right'}}>
                                    <Avatar alt="ブログアバター" sx={{width: '60px', height: '60px'}}>
                                        <ImageNotSupportedIcon />
                                    </Avatar>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={10.7}>
                                <div id="item--header" style={{height: '60px',textAlign:'left'}}>
                                    <div id="item--title" style={{fontSize: '.8rem',overflow: 'hidden'}}>
                                    {"written by 磯海隼人"}
                                    </div>
                                    <div id="item--date" style={{fontSize: '.8rem',overflow: 'hidden'}}>
                                    {article.created_at.slice(0,10)}
                                    </div>
                                </div>
                                <div id="item--content" style={{ fontSize:'1.8rem',textAlign:'left',fontWeight: '600',overflow: 'hidden'}}>
                                {article.title}
                                </div>
                                <div id="item--tags" style={{textAlign: 'left'}}>
                                  <Tags tags={article.tags.split(',')} />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Item>
            ))
        }
      </Stack>
    </Box>
  );
}
