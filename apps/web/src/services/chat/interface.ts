export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  content: unknown;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
