export interface CreateReplyModel {
  thread_id: number;
  user_id: number;
  content?: string;
  image?: string;
  created_by: number;
  updated_by: number;
}

export interface GetRepliesModel {}
