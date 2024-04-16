import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type Props = {
  btnText: string;
  loading: boolean;
  success: boolean;
};
export default function BtnCircular(props: Props) {
  const { btnText, loading, success } = props;

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          type="submit"
          variant="contained"
          sx={buttonSx}
          disabled={loading}
        >
          {btnText}
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
        {success && (
          <CheckCircleIcon
            sx={{
              color: green[500],
            }}
          />
        )}
      </Box>
    </Box>
  );
}
