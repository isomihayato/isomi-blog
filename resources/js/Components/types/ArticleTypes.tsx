export type ArticleImageType = {
  url: string;
};

export type ArticleType = {
  id: number;
  title: string;
  body: string;
  visible: boolean;
  tags: string;
  genre: number;
  created_at: string;
  updated_at: string;
  member_uid: string;
};
