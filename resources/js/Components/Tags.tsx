import { Chip } from '@mui/material';
import React from 'react'
type Props = {
  tags: string[];
}

export default function Tags(props: Props) {
  const { tags } = props;

  return (
    <>
      {
        tags.map((tag: string, index: number) => {
          return (
            <>
              {
                index % 6 === 0 ? <Chip key={0} label={tag} variant="outlined" size="small" color="primary" style={{ margin: '0 5px' }} /> : null
              }
              {
                index % 6 === 1 ? <Chip key={1} label={tag} variant="outlined" size="small" color="secondary" style={{ margin: '0 5px' }} /> : null
              }
              {
                index % 6 === 2 ? <Chip key={2} label={tag} variant="outlined" size="small" color="error" style={{ margin: '0 5px' }} /> : null
              }
              {
                index % 6 === 3 ? <Chip key={3} label={tag} variant="outlined" size="small" color="info" style={{ margin: '0 5px' }} /> : null
              }
              {
                index % 6 === 4 ? <Chip key={4} label={tag} variant="outlined" size="small" color="success" style={{ margin: '0 5px' }} /> : null
              }
              {
                index % 6 === 5 ? <Chip key={5} label={tag} variant="outlined" size="small" color="warning" style={{ margin: '0 5px' }} /> : null
              }
            </>
          )
        })
      }
    </>
  )
}
Tags.defaultProps = {
}