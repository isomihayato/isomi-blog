import { Paper, Stack, styled } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useState, useEffect } from 'react'

type Props = {
}
export default function FrontSideBar(props: Props) {
    const Item = styled(Box)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        width: '280px',
        border: '1px solid #000',
        margin: '0 auto',
      }));
      
    return(
        <>
            <Stack spacing={2} padding={"10px 30px"} justifyContent="center" alignItems="center">
                <Item>
                    <Box>広告</Box>
                </Item>
                <Item>
                    <Box>広告</Box>
                </Item>
                <Item>
                    <Box>広告</Box>
                </Item>
            </Stack>
        </>
    )
}
FrontSideBar.defaultProps = {
}