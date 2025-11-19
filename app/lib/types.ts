export type SignUpData = {
  name: string;
  email: string;
  password: string;
};
export type SignInData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  parentId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskInput = {
  title: string;
  description: string | null;
}