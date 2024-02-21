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

export default function ArrayTable(props: Props) {
  const { rows, headers } = props;
  const { clickHndlr } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow key={"header"}>
            {
              headers.map((header, index) => {
                return <TableCell key={index}>{header}</TableCell>
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.map((row, index) => {
              const tempEditUrl = "/article_ad_templates/" + row[0] + "/edit";
              return (
                <TableRow key={index}>
                  {
                    row.map((cell, index) => {
                      return <TableCell onClick={()=>{window.location.href=tempEditUrl}}>{cell}</TableCell>
                    })
                  }
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
