import { Stack, styled } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { AdvertiseDTO } from '../types/AdvertiseTypes';

type Props = {
  advertisements: AdvertiseDTO[];
};
export default function FrontSideBar(props: Props) {
  const { advertisements } = props;
  const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: window.innerWidth < 1500 ? '230px' : '280px',
    border: '1px solid #000',
    margin: '0 auto',
    fontFamily: 'Noto Sans JP, sans-serif',
    lineHeight: '1.7',
  }));

  return (
    <>
      <Stack spacing={2} justifyContent="center" alignItems="center">
        {advertisements.map((ad) => (
          <Item key={ad.article_ad.name}>
            <div dangerouslySetInnerHTML={{ __html: ad.article_ad.content }} />
          </Item>
        ))}
      </Stack>
    </>
  );
}
FrontSideBar.defaultProps = {};
