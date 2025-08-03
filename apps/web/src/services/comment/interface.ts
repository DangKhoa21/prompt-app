export interface CommentItem {
  id: string;
  content: string;
  parentId: string | null;
  promptId: string;
  creatorId: string;
  creator: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  repliesCount: number;
  createdAt: Date;
  updatedAt: Date;
}
