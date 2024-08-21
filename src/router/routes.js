const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'Iniciar Sesión', component: () => import('pages/Login.vue') },
    ],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Inicio', component: () => import('pages/Home.vue') },
    ],
  },
  {
    path: '/zone',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Cuidades', component: () => import('pages/Zone.vue') },
    ],
  },
  {
    path: '/yard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Sectores', component: () => import('pages/Yard.vue') },
    ],
  },
  {
    path: '/role',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Roles', component: () => import('pages/Role.vue') },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Usuarios', component: () => import('pages/User.vue') },
    ],
  },
  {
    path: '/new',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Recolección de datos', component: () => import('pages/New.vue') },
    ],
  },
  {
    path: '/review',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Revisión de datos', component: () => import('pages/Review.vue') },
    ],
  },
  {
    path: '/my-diary',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Mi agenda', component: () => import('pages/MyDiary.vue') },
    ],
  },
  {
    path: '/users-diary',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Agenda de usuarios', component: () => import('pages/UsersDiary.vue') },
    ],
  },
  {
    path: '/visit/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Visita', component: () => import('pages/Visit.vue') },
    ],
  },
  {
    path: '/list-visit',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Listar Visitas', component: () => import('pages/ListVisit.vue') },
    ],
  },
  {
    path: '/review-visit/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Revisar Visita', component: () => import('pages/ReviewVisit.vue') },
    ],
  },
  {
    path: '/zip',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Exportar comprimidos', component: () => import('pages/Zip.vue') },
    ],
  },
  {
    path: '/param',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Parametros', component: () => import('pages/Configuration.vue') },
    ],
  },
  {
    path: '/listing',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Rutas', component: () => import('pages/Listing.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
