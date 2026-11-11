// 外部スクリプトを、まだ読み込んでいなければ非同期で読み込む(同じURLは1回だけ)
export function loadScriptOnce(src: string): void {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.charset = 'utf-8';
  document.body.appendChild(script);
}
