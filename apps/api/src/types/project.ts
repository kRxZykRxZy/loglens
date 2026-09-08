export type Project = {
  id: string;
  userId: string;
  name: string;
  slug: string | null;
  description: string | null;
  archivedAt: string | null;
  createdAt: Date;
};
