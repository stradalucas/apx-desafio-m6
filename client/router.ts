import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));

router.setRoutes([
   { path: "/", component: "home-page" },
   { path: "/signup", component: "signup-page" },
   { path: "/login", component: "login-page" },
   { path: "/enter_room", component: "enter-room-page" },
   { path: "/newroom", component: "newroom-page" },
   { path: "/rules", component: "rules-page" },
   { path: "/election", component: "election-page" },
   { path: "/round", component: "round-page" },
   { path: "/results", component: "results-page" },
]);
