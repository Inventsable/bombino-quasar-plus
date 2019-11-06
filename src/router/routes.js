const routes = [
  {
    path: "/",
    component: () => import("layouts/Panel.vue"),
    children: [
      { path: "", name: "home", component: () => import("pages/Index.vue") },
      {
        path: "/tab2",
        name: "Tab2",
        component: () => import("pages/Tab2.vue")
      },
      {
        path: "/tab3",
        name: "Tab3",
        component: () => import("pages/Tab3.vue")
      }
    ]
  },
  {
    path: "/modal",
    name: "Modal",
    component: () => import("layouts/Modal.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/ModalScreen.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
