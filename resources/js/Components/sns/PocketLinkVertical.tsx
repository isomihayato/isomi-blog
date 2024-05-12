import React, { useEffect } from 'react';

const PocketLinkVertical: React.FC<{ lang?: string }> = ({ lang = 'en' }) => {
  useEffect(() => {
    const scriptId = 'pocket-btn-js';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://widgets.getpocket.com/v1/j/btn.js?v=1';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <a
      data-pocket-label="pocket"
      data-pocket-count="vertical"
      className="pocket-btn"
      data-lang={lang}
    ></a>
  );
};

export default PocketLinkVertical;
