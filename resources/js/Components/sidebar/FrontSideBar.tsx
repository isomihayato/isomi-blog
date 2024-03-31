import { Stack, styled } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { isMobile } from 'react-device-detect';
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
    width: '280px',
    border: '1px solid #000',
    margin: '0 auto',
  }));

  return (
    <>
      <Stack
        spacing={2}
        padding={'10px 30px'}
        justifyContent="center"
        alignItems="center"
        style={isMobile ? {} : { marginTop: '20px' }}
      >
        {advertisements.map((ad) => (
          <Item key={ad.arrangement_name}>
            <div dangerouslySetInnerHTML={{ __html: ad.content }} />
          </Item>
        ))}
      </Stack>
    </>
  );
}
FrontSideBar.defaultProps = {};
