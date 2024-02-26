import * as React from 'react';
import { Box, Paper, Grid, TextareaAutosize, Avatar } from '@mui/material';
import Front from '@/Components/header/Front';
import FrontSideBar from '@/Components/sidebar/FrontSideBar';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import Tags from '@/Components/Tags';
import { isMobile } from 'react-device-detect';
import CommentCard from '@/Components/surface/CommentCard';
import CommentsCard from '@/Components/surface/CommentsCard';

export default function ArticleDetails({ auth, article }) {
  const ArticleContent = () => {
    return (
      <>
        <h1>目次</h1>
        <pre>
          <Markdown remarkPlugins={[remarkGfm]}>{article.body}</Markdown>
        </pre>
      </>
    );
  }
  const makeTitleStyle = () => {
    if (isMobile) {
      return {
        padding: '0 20px',
        fontSize: '1.8rem',
        fontWeight: 'bold'
      }
    } else {
      return {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '70px',
        marginTop: '25px',
        marginLeft: '6px'
      } 
    }
  }

  return (
    <>
      <Front />
      <Grid container spacing={3}>
        <Grid item md={3}>
          {
            isMobile ? <></> : <FrontSideBar />
          }
        </Grid>
        <Grid item md={6} xs={12}>
          <div style={makeTitleStyle()}>
            {article.title}
            <Tags tags={article.tags.split(',')} />
          </div>
          <MainFront element={<>
            <ArticleContent />
            </>} 
          />
        </Grid>
        <Grid item md={3}>
          {
            isMobile ? <></> : <FrontSideBar />
          }
        </Grid>
      </Grid>
      <Box component={Paper} style={{width: '50vw',margin: '0 auto',marginBottom: '40px'}}>
        <Box p={2}>
          <h2>コメント</h2>
          {
            article.comments.map((comment, index) => {
              return (
                <CommentsCard key={index} comment={comment} />
              );
            })
          }
          <CommentCard articleId={article.id}/>
        </Box>
      </Box>
      <FrontFooter />
    </>
  );
}