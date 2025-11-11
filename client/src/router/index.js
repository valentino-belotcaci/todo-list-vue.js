import { createRouter, createWebHistory } from "vue-router";
import UserRegister from "@/components/UserRegister";
import UserLogin from "@/components/UserLogin";
import TodoListPage from "@/components/TodoListPage";
import TodoNew from "@/components/TodoNew";
import TodoView from "@/components/TodoView";

const routes = [
  {
    path: "/",
    name: "login",
    component: UserLogin,
  },
  {
    path: "/register",
    name: "register",
    component: UserRegister,
  },
  {
    path: "/todos",
    name: "Todos",
    component: TodoListPage,
  },
  {
    path: "/todos/new",
    name: "addTodo",
    component: TodoNew,
  },
  {
    path: "/todos/:id",
    name: "ViewTodo",
    component: TodoView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
