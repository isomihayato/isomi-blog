export type CommentType = {
  id: number;
  body: string;
  fb_uid: string;
  article_id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  member: {
    id: number;
    name: string;
    photo_url: string;
    created_at: string;
    updated_at: string;
  };
};
