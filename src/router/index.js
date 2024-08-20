import Vue from 'vue';
import VueRouter from 'vue-router';
import { Notify } from 'quasar';

import routes from './routes';
import authApi from '../api/auth/authApi';

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default (/* { store, ssrContext } */) => {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  Router.beforeEach(async (to, from, next) => {
    if (to.path === '/') {
      next();
      return;
    }

    try {
      await authApi.session();
      next();
      return;
    } catch (error) {
      if (error.response.status === 401) {
        Notify.create({
          message: 'No hay una sesión activa, vuelva a iniciar sesión por favor!',
          icon: 'error',
          color: 'red',
          timeout: 2000,
          textColor: 'white',
          classes: 'glossy',
          progress: true,
          onDismiss() {
            Router.push('/');
          },
        });
      } else {
        next();
      }
    }
  });

  return Router;
};
