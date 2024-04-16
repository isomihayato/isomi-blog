import React, { useState, useEffect } from 'react';
import { AdvertiseDTO } from '../types/AdvertiseTypes';
import FrontSideBar from './FrontSideBar';

type Props = {
  elementRef: React.MutableRefObject<null>;
  advertisements: AdvertiseDTO[];
};
function LeftSideBar(props: Props) {
  const { elementRef, advertisements } = props;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // entriesは監視している要素の配列です
        const [entry] = entries;
        // isIntersectingは要素がビューポートに入っているかどうかを示します
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2, // 10%の部分が見えたらトリガーする
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div
        className={isVisible ? 'visible-element' : 'hidden-element'}
        style={{
          position: 'fixed',
          left: window.innerWidth < 1500 ? '15px' : '8vw',
          top: '10px',
        }}
      >
        <FrontSideBar advertisements={advertisements} />
      </div>
    </div>
  );
}

export default LeftSideBar;
