import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const JwtLogin = Loadable(lazy(() => import('./JwtLogin')));

const sessionRoutes = [
  { path: '/session/signin', element: <JwtLogin /> },
];

export default sessionRoutes;
