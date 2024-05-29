import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { deleteArticleAd } from '../axios/axiosArticleAd';

type Props = {
  rows: any[];
  headers: string[];
};

export default function AdTable(props: Props) {
  const { rows, headers } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow key={'header'}>
            {headers.map((header, index) => {
              return (
                <TableCell
                  key={index}
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  {header}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const tempEditUrl = '/article_ads/' + row['id'] + '/edit';
            return (
              <TableRow key={index}>
                {Object.keys(row).map((key, index) => {
                  return (
                    <TableCell
                      key={index + key}
                      onClick={() => {
                        window.location.href = tempEditUrl;
                      }}
                    >
                      {key === 'content' ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: row[key] }}
                          className="preview"
                        />
                      ) : (
                        row[key]
                      )}
                    </TableCell>
                  );
                })}
                <TableCell key={index + 'delete'}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      deleteArticleAd(
                        row['id'],
                        () => {
                          window.location.reload();
                        },
                        (res) => {
                          console.log(res);
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          if (res.response.status === 405) {
                            window.location.reload();
                          }
                        },
                      );
                    }}
                    color="error"
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
