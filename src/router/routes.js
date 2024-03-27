const routes = [
  {
    path: "/public",
    component: () => import("layouts/PublicLayout.vue"),
    children: [
      {
        path: "register",
        component: () => import("src/pages/UserRegister.vue"),
      },
      {
        path: "login",
        component: () => import("src/pages/UserLogin.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("src/layouts/PrivateLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "new", component: () => import("pages/NewWord.vue") },
      { path: "list", component: () => import("src/pages/WordsList.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
