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
  member_uid: string;
  favorites_count?: number; // お気に入り数(記事詳細のみ)
  favorited?: boolean; // この端末でお気に入り登録済みか(記事詳細のみ)
};
