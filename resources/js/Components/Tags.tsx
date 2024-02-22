import { Chip } from '@mui/material';
import React, { useState, useEffect } from 'react'
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
                                index % 6 === 0 ? <Chip key={tag} label={tag} variant="outlined" size="small" color="primary" style={{ margin: '0 5px' }} /> : null
                            }
                            {
                                index % 6 === 1 ? <Chip key={tag} label={tag} variant="outlined" size="small" color="secondary" style={{ margin: '0 5px' }} /> : null
                            }
                            {
                                index % 6 === 2 ? <Chip key={tag} label={tag} variant="outlined" size="small" color="error" style={{ margin: '0 5px' }} /> : null
                            }
                            {
                                index % 6 === 3 ? <Chip key={tag} label={tag} variant="outlined" size="small" color="info" style={{ margin: '0 5px' }} /> : null
                            }
                            {
                                index % 6 === 4 ? <Chip key={tag} label={tag} variant="outlined" size="small" color="success" style={{ margin: '0 5px' }} /> : null
                            }
                            {
                                index % 6 === 5 ? <Chip key={tag} label={tag} variant="outlined" size="small" color="warning" style={{ margin: '0 5px' }} /> : null
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