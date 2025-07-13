export type Paginated<E> = {
  data: E[];
  nextCursor?: string;
};
