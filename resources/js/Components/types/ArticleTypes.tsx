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
  eyecatch_path?: string | null; // アイキャッチ画像(/storage/upload/...)。未設定なら null
  og_image_url?: string; // SNSでシェアされたときの画像の絶対URL(記事詳細のみ)
  created_at: string;
  updated_at: string;
  published_at: string;
  member_uid: string;
};
