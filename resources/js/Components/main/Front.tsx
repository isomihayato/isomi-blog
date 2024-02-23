import { Box, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react'
type Props = {
    element: JSX.Element
}
export default function Front(props: Props) {
    const { element } = props;
    return(
        <>
          <Box id="main" style={{margin: '50px auto',width: '50vw', minHeight: '65vh'}} component={Paper}>
            <div style={{padding: "32px 56px"}}>
              {element}
            </div>
          </Box>
        </>
    )
}
Front.defaultProps = {
}