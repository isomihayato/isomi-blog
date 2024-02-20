import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

type Props = {
  rows: any[],
  headers: string[],
  clickHndlr: any
}

export default function BasicTable(props: Props) {
  const { rows, headers } = props;
  const { clickHndlr } = props;
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              headers.map((header, index) => {
                return <TableCell key={index}>{header}</TableCell>
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            Object.keys(rows).map((key) => {
              return (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {rows[key][0]}
                  </TableCell>
                  <TableCell align="right">
                    {
                      rows[key][1] === null ? <span>未登録</span> : rows[key][1]
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      rows[key][2] === null ? <Button onClick={()=>clickHndlr(Number(key))}>追加する</Button> : rows[key][2]
                    }
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
