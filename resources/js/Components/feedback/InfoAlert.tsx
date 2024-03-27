import React, { useEffect } from 'react';
import { getShowByBar } from '../axios/axiosInfomation';
import { Alert, Box } from '@mui/material';
import { InfomationDTO } from '../types/InfomationTypes';

export default function InfoAlert() {
  const [barInfo, setBarInfo] = React.useState([]);
  useEffect(() => {
    getShowByBar(
      (res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setBarInfo(res.data.infomations);
      },
      (res) => {
        console.log(res);
      },
    );
  }, []);
  return (
    <>
      {
        <Box>
          {barInfo.map((info: InfomationDTO) => {
            return (
              <Alert
                key={info.title}
                severity="info"
                onClick={() => {
                  window.location.href = `/infomations/${info.id}`;
                }}
              >
                {info.title}
              </Alert>
            );
          })}
        </Box>
      }
    </>
  );
}
InfoAlert.defaultProps = {};
