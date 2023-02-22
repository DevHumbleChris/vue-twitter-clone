import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { auth } from "@/firebaseConfig"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '/tweet/:tagName/:tweetID',
          component: () => import("../views/TweetPost.vue")
        },
        {
          path: '/home',
          component: () => import("../components/HomeTweets.vue")
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser
  if (requiresAuth && !isAuthenticated) next({ name: "login" });
  else next();
});

export default router;
