import { Box, Paper } from '@mui/material';
import React from 'react';
import { isMobile } from 'react-device-detect';
type Props = {
  element: JSX.Element;
};
export default function Front(props: Props) {
  const { element } = props;
  const makeOuterStyle = () => {
    if (isMobile) {
      return {
        width: '90vw',
        margin: '0 auto',
        minHeight: '66vh',
        marginTop: '25px',
      };
    } else {
      return { margin: '50px auto', width: '50vw', minHeight: '65vh' };
    }
  };
  return (
    <>
      <Box id="main" style={makeOuterStyle()} component={Paper}>
        <div
          style={isMobile ? { padding: '10px 15px' } : { padding: '32px 56px' }}
        >
          {element}
        </div>
      </Box>
    </>
  );
}
Front.defaultProps = {};
