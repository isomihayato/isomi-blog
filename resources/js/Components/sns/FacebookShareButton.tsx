import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const FacebookShareButton = ({ url }) => {
  useEffect(() => {
    // Facebook SDKの読み込みを確認する関数
    const loadFbSdk = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.fbAsyncInit = function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        window.FB.init({
          appId: '1437461986868001', // アプリIDを設定
          xfbml: true,
          version: 'v3.0',
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        window.FB.XFBML.parse(); // ページ内のXFBMLタグを解析してウィジェットを再レンダリング
      };

      (function (d, s, id) {
        // eslint-disable-next-line no-var
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    };

    // Facebook SDKがすでに読み込まれているか確認
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (!window.FB) {
      loadFbSdk();
    } else {
      // SDKがすでに読み込まれている場合は、ウィジェットを再レンダリング
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div>
      <div id="fb-root"></div>
      <div
        className="fb-share-button"
        data-href={url}
        data-layout="button_count"
      ></div>
    </div>
  );
};

export default FacebookShareButton;

FacebookShareButton.propTypes = {
  url: PropTypes.string.isRequired,
};
