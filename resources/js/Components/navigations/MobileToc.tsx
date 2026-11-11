import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerticalStepper from './VerticalSteper';
import type { ArticleHeading } from '../common/articleHeadings';

type Props = {
  headings: ArticleHeading[];
  // 開閉の状態は親で持つ(本文の再描画で閉じてしまわないように)
  open: boolean;
  onChange: (open: boolean) => void;
};

// スマホ用: 本文の先頭に置く、折りたためる目次
export default function MobileToc(props: Props) {
  const { headings, open, onChange } = props;
  if (headings.length === 0) return null;

  return (
    <Accordion
      expanded={open}
      onChange={(_, expanded) => onChange(expanded)}
      disableGutters
      variant="outlined"
      sx={{ mb: 2, borderRadius: '6px', '&:before': { display: 'none' } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="mobile-toc-content"
        id="mobile-toc-header"
      >
        <Typography sx={{ fontWeight: 'bold' }}>目次</Typography>
      </AccordionSummary>
      <AccordionDetails id="mobile-toc-content" sx={{ pt: 0 }}>
        <VerticalStepper headings={headings} />
      </AccordionDetails>
    </Accordion>
  );
}
