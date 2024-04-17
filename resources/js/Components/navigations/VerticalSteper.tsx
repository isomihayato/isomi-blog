import React, { useEffect } from 'react';
import { Stepper, Step, StepLabel, StepConnector, styled } from '@mui/material';

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

type Props = {
  chapters: Array<string>;
};

function CustomizedSteppers(props: Props) {
  const { chapters } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = chapters.map((label) =>
    label.replace(/[^0-9a-zA-Z\u3041-\u3096\u30A1-\u30FA\u4E00-\u9FA5]/g, ''),
  );

  const handleScroll = () => {
    steps.forEach((chapter, index) => {
      const element = document.getElementById(chapter);
      if (element) {
        const boundingRect = element.getBoundingClientRect();
        const position = boundingRect.top + window.scrollY;

        if (window.scrollY >= position) {
          setActiveStep(index);
        }
      }
    });
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Stepper
      activeStep={activeStep}
      connector={<ColorlibConnector />}
      orientation="vertical"
    >
      {chapters?.map((label, index) => {
        const chapter = label.replace(
          /[^0-9a-zA-Z\u3041-\u3096\u30A1-\u30FA\u4E00-\u9FA5]/g,
          '',
        );
        if (label.startsWith('## ')) {
          // 条件に応じてStepコンポーネントをdivタグで囲む
          return (
            <Step key={chapter}>
              <StepLabel
                StepIconComponent={() => (
                  <ColorlibStepIcon
                    ownerState={{ active: index === activeStep }}
                  />
                )}
              >
                {chapter}
              </StepLabel>
            </Step>
          );
        } else if (label.startsWith('### ')) {
          return (
            <Step key={chapter}>
              <StepLabel
                StepIconComponent={() => (
                  <ColorlibStepSmallIcon
                    ownerState={{ active: index === activeStep }}
                  />
                )}
              >
                {chapter}
              </StepLabel>
            </Step>
          );
        }
      })}
    </Stepper>
  );
}

export default CustomizedSteppers;
