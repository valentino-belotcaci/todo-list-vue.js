import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UserRegister from "@/components/UserRegister";
import UserLogin from "@/components/UserLogin";
import TodoListPage from "@/components/TodoListPage";
import TodoNew from "@/components/TodoNew";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/register",
    name: "register",
    component: UserRegister,
  },
  {
    path: "/login",
    name: "login",
    component: UserLogin,
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
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
