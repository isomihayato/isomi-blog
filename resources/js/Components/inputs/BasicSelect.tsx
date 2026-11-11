import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

type Props = {
  rows: { value: string; label: string }[];
  label: string;
  name: string;
  value?: string;
  callback?: any;
  key?: string;
};
export default function BasicSelect(props: Props) {
  const { key, rows, label, value, name } = props;
  const { callback } = props;

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={label + '-label'}>{label}</InputLabel>
        <Select
          labelId={label + '-label'}
          id={name}
          key={key}
          defaultValue={value}
          label={label}
          name={name}
          onChange={(e) => {
            // callback は任意(記事作成・編集のジャンルなど、フォームの値として送るだけの場合は渡されない)
            callback?.(e.target.value);
          }}
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
