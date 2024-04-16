import React, { useEffect } from 'react';
import { Stepper, Step, StepLabel, StepConnector, styled } from '@mui/material';

// ステップコネクタのスタイルをカスタマイズ
const ColorlibConnector = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    display: 'block',
    borderColor: 'black',
  },
}));

// ステップアイコンのスタイルをカスタマイズ
const ColorlibStepIcon = styled('div')<{ ownerState: { active: boolean } }>(
  ({ ownerState }) => ({
    backgroundColor: ownerState.active ? '#00a968c9' : '#eaeaf0',
    borderRadius: '50%',
    width: 25,
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  }),
);

type Props = {
  chapters: Array<string>;
};

function CustomizedSteppers(props: Props) {
  const { chapters } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const handleScroll = () => {
    chapters.forEach((chapter, index) => {
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
        // 条件に応じてStepコンポーネントをdivタグで囲む
        const stepComponent = (
          <Step key={label}>
            <StepLabel
              StepIconComponent={() => (
                <ColorlibStepIcon
                  ownerState={{ active: index === activeStep }}
                />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        );
        return stepComponent;
      })}
    </Stepper>
  );
}

export default CustomizedSteppers;
