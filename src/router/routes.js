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
      {
        path: '',
        name: 'Cuidades',
        component: () => import('pages/Zone.vue'),
        meta: { permissions: ['zone.list'] },
      },
    ],
  },
  {
    path: '/yard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Sectores',
        component: () => import('pages/Yard.vue'),
        meta: { permissions: ['yard.list'] },
      },
    ],
  },
  {
    path: '/role',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Roles',
        component: () => import('pages/Role.vue'),
        meta: { permissions: ['role.list'] },
      },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Usuarios',
        component: () => import('pages/User.vue'),
        meta: { permissions: ['user.list'] },
      },
    ],
  },
  {
    path: '/new',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Recolección de direcciones',
        component: () => import('pages/New.vue'),
        meta: { permissions: ['new.list'] },
      },
    ],
  },
  {
    path: '/review',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Agendar nuevos',
        component: () => import('pages/Review.vue'),
        meta: { permissions: ['review.list'] },
      },
    ],
  },
  {
    path: '/my-diary',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Mi agenda',
        component: () => import('pages/MyDiary.vue'),
        meta: { permissions: ['diary.getMyDiary'] },
      },
    ],
  },
  {
    path: '/users-diary',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Agenda de asesores',
        component: () => import('pages/UsersDiary.vue'),
        meta: { permissions: ['diary.getUsersDiary'] },
      },
    ],
  },
  {
    path: '/visit/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Visita',
        component: () => import('pages/Visit.vue'),
        meta: { permissions: [] },
      },
    ],
  },
  {
    path: '/list-visit',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Listar Visitas',
        component: () => import('pages/ListVisit.vue'),
        meta: { permissions: ['visit.list'] },
      },
    ],
  },
  {
    path: '/list-new-rejects',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Listar nuevos rechazados',
        component: () => import('pages/NewReject.vue'),
        meta: { permissions: ['new.listReject'] },
      },
    ],
  },
  {
    path: '/review-visit/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Revisar Visita',
        component: () => import('pages/ReviewVisit.vue'),
        meta: { permissions: ['visit.review'] },
      },
    ],
  },
  {
    path: '/zip',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Exportar comprimidos',
        component: () => import('pages/Zip.vue'),
        meta: { permissions: ['zip.list'] },
      },
    ],
  },
  {
    path: '/param',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Parametros',
        component: () => import('pages/Configuration.vue'),
        meta: { permissions: ['parameter.list'] },
      },
    ],
  },
  {
    path: '/listing',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Rutas',
        component: () => import('pages/Listing.vue'),
        meta: { permissions: ['list.list'] },
      },
    ],
  },
  {
    path: '/lending',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Lista de prestamos',
        component: () => import('pages/Lending.vue'),
        meta: { permissions: ['lending.list'] },
      },
    ],
  },
  {
    path: '/district',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Lista de barrios',
        component: () => import('pages/District.vue'),
        meta: { permissions: ['district.list'] },
      },
    ],
  },
  {
    path: '/report-dinamic',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Reportes Dinamicos',
        component: () => import('pages/ReportDinamic.vue'),
        meta: { permissions: ['reportsDinamic.list'] },
      },
    ],
  },
  {
    path: '/payment-voucher',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Revisar vouchers de pagos',
        component: () => import('pages/Payment.vue'),
        meta: { permissions: ['payment.list'] },
      },
    ],
  },
  {
    path: '/payment-whatsapp',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Certificar pagos en app WhatsApp',
        component: () => import('src/pages/PaymentWhatsapp.vue'),
        meta: { permissions: ['paymentWhatsapp.list'] },
      },
    ],
  },
  {
    path: '/payment-app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Revisar pagos en app nequi',
        component: () => import('pages/PaymentApp.vue'),
        meta: { permissions: ['paymentApp.list'] },
      },
    ],
  },
  {
    path: '/expense-list-new',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Agregar voucher a nuevos aprobados',
        component: () => import('pages/NewsApproved.vue'),
        meta: { permissions: ['expense.listNewApproved'] },
      },
    ],
  },
  {
    path: '/my-expenses',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Mis movimientos',
        component: () => import('pages/MyExpense.vue'),
      },
    ],
  },
  {
    path: '/expense',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Gestionar Egresos',
        component: () => import('pages/Expense.vue'),
        meta: { permissions: ['expense.list'] },
      },
    ],
  },
  {
    path: '/expense-renovated',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Agregar voucher a renovaciones',
        component: () => import('pages/ExpenseRenovated.vue'),
        meta: { permissions: ['expense.listRenovated'] },
      },
    ],
  },
  {
    path: '/users-location',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Ubicación de usuarios',
        component: () => import('pages/UsersLocation.vue'),
        meta: { permissions: ['report.usersLocation'] },
      },
    ],
  },
  {
    path: '/list-questions-nequi',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Solicitudes al grupo nequi',
        component: () => import('pages/QuestionNequi.vue'),
        meta: { permissions: ['question.listGroupNequi'] },
      },
    ],
  },
  {
    path: '/list-questions-news-olds',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Solicitudes de nuevos antiguos',
        component: () => import('pages/QuestionNewOld.vue'),
        meta: { permissions: ['question.listNewsOlds'] },
      },
    ],
  },
  {
    path: '/report-deliveries',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Reporte de entregas por fecha',
        component: () => import('pages/ReportDeliveries.vue'),
        meta: { permissions: ['report.Deliveries'] },
      },
    ],
  },
  {
    path: '/list-reds',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Listar direcciones de rojos',
        component: () => import('pages/Reds.vue'),
        meta: { permissions: ['red.list'] },
      },
    ],
  },
  {
    path: '/supervise-reds',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Supervisar rojos',
        component: () => import('pages/SuperviseReds.vue'),
        meta: { permissions: ['red.supervise'] },
      },
    ],
  },
  {
    path: '/control-reds',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Control de rojos',
        component: () => import('pages/ControlReds.vue'),
        meta: { permissions: ['red.control'] },
      },
    ],
  },
  {
    path: '/visit-reds',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Visita a dirección de rojo',
        component: () => import('pages/VisitReds.vue'),
        meta: { permissions: ['red.visit'] },
      },
    ],
  },
  {
    path: '/cv-client/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Hoja de vida de cliente',
        component: () => import('pages/Cv.vue'),
        meta: { permissions: ['reportsDinamic.viewCv'] },
      },
    ],
  },
  {
    path: '/upload-news',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Migración de nuevos',
        component: () => import('pages/UploadNews.vue'),
        meta: { permissions: ['news.migration'] },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
  {
    path: '/unauthorized',
    component: () => import('pages/Error401.vue'),
  },
];

export default routes;
