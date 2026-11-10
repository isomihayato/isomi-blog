export type ArticleImageType = {
  url: string;
};

export type ArticleType = {
  id: number;
  title: string;
  body?: string; // 一覧取得時は含まれない
  visible: boolean;
  tags: string;
  genre: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  reading_minutes?: number; // 読了時間の目安(分)。記事詳細のみ
  member_uid: string;
};
