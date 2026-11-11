export type ArticleImageType = {
  url: string;
};

export type ArticleType = {
  id: number;
  title: string;
  describe?: string | null; // 記事の概要
  body?: string; // 一覧取得時は含まれない
  visible: boolean;
  tags: string;
  genre: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  member_uid: string;
  favorites_count?: number; // お気に入り数(記事詳細のみ)
};
