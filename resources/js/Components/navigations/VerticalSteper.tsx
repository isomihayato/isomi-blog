import React, { useEffect, useState } from 'react';
import {
  Stepper,
  Step,
  StepButton,
  StepConnector,
  styled,
} from '@mui/material';
import type { ArticleHeading } from '../common/articleHeadings';

// ステップコネクタのスタイルをカスタマイズ
const ColorlibConnector = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    display: 'block',
    borderColor: 'black',
    marginLeft: '-2px',
  },
}));

// ステップアイコンのスタイルをカスタマイズ
const ColorlibStepIcon = styled('div')<{ ownerState: { active: boolean } }>(
  ({ ownerState }) => ({
    backgroundColor: ownerState.active ? '#00a968c9' : '#eaeaf0',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  }),
);

const ColorlibStepSmallIcon = styled('div')<{
  ownerState: { active: boolean };
}>(({ ownerState }) => ({
  backgroundColor: ownerState.active ? '#7600a9c9' : '#eaeaf0',
  borderRadius: '50%',
  width: 15,
  height: 15,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black',
  marginLeft: '3px',
}));

// 見出しの上端が画面上端からこの距離(px)より上に来たら、その章を「現在位置」とする
const ACTIVE_OFFSET = 100;

type Props = {
  headings: ArticleHeading[];
};

/**
 * 現在のスクロール位置で読んでいる章の番号を返す。
 * 見出しの上端が ACTIVE_OFFSET より上にある最後の見出しを現在位置とする。
 */
function findActiveIndex(headings: ArticleHeading[]): number {
  // ページの最下部まで来たら、最後の章を現在位置にする(短い最終章が上端まで届かない場合のため)
  const scrolledToBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;

  let active = 0;
  headings.forEach((heading, index) => {
    const element = document.getElementById(heading.id);
    if (element && element.getBoundingClientRect().top <= ACTIVE_OFFSET) {
      active = index;
    }
  });
  if (scrolledToBottom && headings.length > 0) {
    const last = document.getElementById(headings[headings.length - 1].id);
    if (last && last.getBoundingClientRect().top < window.innerHeight) {
      active = headings.length - 1;
    }
  }
  return active;
}

function CustomizedSteppers(props: Props) {
  const { headings } = props;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (headings.length === 0) return undefined;

    // スクロールのたびに計算しないよう、1フレームに1回だけ判定する
    let frame = 0;
    const update = () => {
      frame = 0;
      setActiveStep(findActiveIndex(headings));
    };
    const handleScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  const handleClick = (heading: ArticleHeading, index: number) => {
    const element = document.getElementById(heading.id);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 見出しへのリンクを共有できるよう、URLのハッシュも更新する(履歴は増やさない)
    window.history.replaceState(window.history.state, '', `#${heading.id}`);
    setActiveStep(index);
  };

  return (
    <Stepper
      activeStep={activeStep}
      connector={<ColorlibConnector />}
      orientation="vertical"
      nonLinear
    >
      {headings.map((heading, index) => {
        const active = index === activeStep;
        const icon =
          heading.depth <= 2 ? (
            <ColorlibStepIcon ownerState={{ active }} />
          ) : (
            <ColorlibStepSmallIcon ownerState={{ active }} />
          );
        return (
          <Step key={heading.id}>
            <StepButton
              icon={icon}
              onClick={() => handleClick(heading, index)}
              sx={{ textAlign: 'left' }}
            >
              {heading.text}
            </StepButton>
          </Step>
        );
      })}
    </Stepper>
  );
}

export default CustomizedSteppers;
