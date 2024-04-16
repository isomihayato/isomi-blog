import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

type Props = {
  rows: { value: string; label: string }[];
  label: string;
  value?: string;
  name: string;
};
export default function BasicSelect(props: Props) {
  const { rows, label, value, name } = props;

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={label + '-label'}>{label}</InputLabel>
        <Select
          labelId={label + '-label'}
          id={name}
          defaultValue={value}
          label={label}
          name={name}
        >
          {rows.map((row, index) => {
            return (
              <MenuItem key={index} value={row.value}>
                {row.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
