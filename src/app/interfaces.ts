interface User {
  success?: boolean;
  token?: string;
  userName?: string | null;
}

interface Task {
  _id?: string | null;
  title?: string;
  dueOn?: string;
}

interface ModalTask {
  taskData?: Task;
  isOpen: boolean;
}

export {User, Task, ModalTask};
