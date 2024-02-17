import { Box, Grid } from '@mui/material'
import React, { useState, useEffect } from 'react'
type Props = {
}
export default function FrontFooter(props: Props) {
    return(
        <>
          <div id="footer">
            <Grid container id="footer__outer">
              <Grid item md={3}>
                <Box id="logo">INFO BOX</Box>
                <span>情報の玉手箱(成長中)</span>
                <p id="copyright">© 2024 INFO BOX</p>
              </Grid>
              <Grid item md={9}>
                <Box id="nav">
                  <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                  </ul>
                </Box>
              </Grid>
            </Grid>
          </div>
        </>
    )
}
FrontFooter.defaultProps = {
}