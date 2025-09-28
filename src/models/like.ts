export interface CreateLikeModel {
  user_id: number;
  thread_id: number;
  created_by: number;
  updated_by: number;
}

export interface DeleteLikeModel {
  id: number;
}

export interface GetLikesModel {}
