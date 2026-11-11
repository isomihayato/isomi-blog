import React, { useEffect } from 'react';
import { getShowByBar } from '../axios/axiosInfomation';
import { Alert, Link } from '@mui/material';
import { InfomationDTO } from '../types/InfomationTypes';

// 閉じたお知らせのID。同じお知らせはもう出さず、新しいお知らせが来たらまた出す
const CLOSED_KEY = 'infoBarClosedId';

function loadClosedId(): number | null {
  try {
    const value = localStorage.getItem(CLOSED_KEY);
    return value ? Number(value) : null;
  } catch {
    return null;
  }
}

// お知らせバー。本文が押し下げられないよう、最新の1件だけを表示し、閉じられるようにする
export default function InfoAlert() {
  const [latest, setLatest] = React.useState<InfomationDTO | null>(null);
  useEffect(() => {
    getShowByBar(
      (res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const infomations: InfomationDTO[] = res.data.infomations ?? [];
        const newest = [...infomations].sort((a, b) =>
          (b.publish_at ?? '').localeCompare(a.publish_at ?? ''),
        )[0];
        if (newest && newest.id !== loadClosedId()) setLatest(newest);
      },
      (res) => {
        console.log(res);
      },
    );
  }, []);

  if (!latest) return null;

  const close = () => {
    try {
      localStorage.setItem(CLOSED_KEY, String(latest.id));
    } catch {
      // 保存できなくても、この画面では閉じる
    }
    setLatest(null);
  };

  return (
    <Alert severity="info" onClose={close} sx={{ alignItems: 'center' }}>
      <Link href={`/infomations/${latest.id}`} color="inherit">
        {latest.title}
      </Link>
    </Alert>
  );
}
