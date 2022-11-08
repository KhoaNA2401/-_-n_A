import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const AppTable = Loadable(lazy(() => import('./tables/AppTable')));
const AppForm = Loadable(lazy(() => import('./forms/AppForm')));
const AppFormManager = Loadable(lazy(() => import('./forms/AppFormManager')));
const AppAutoComplete = Loadable(lazy(() => import('./auto-complete/AppAutoComplete')));
const AppIcon = Loadable(lazy(() => import('./icons/AppIcon')));
const AppListManager = Loadable(lazy(() => import('./tables/AppListManager')));
const AppFindCert = Loadable(lazy(() => import('./forms/AppFindCert')));
const AppVerifyCert = Loadable(lazy(() => import('./forms/AppVerifyCert')));
const materialRoutes = [
  {
    path: '/material/listmanager',
    element: <AppListManager />
  },
  {
    path: '/material/addmanager',
    element: <AppFormManager />,
  },
  {
    path: '/material/icons',
    element: <AppIcon />,
  },
  {
    path: '/material/listcertificate',
    element: <AppTable />,
  },
  {
    path: '/material/addcertificate',
    element: <AppForm />,
  },

  {
    path: '/material/findcertificate',
    element: <AppFindCert />,
  },
  {
    path: '/material/verifycertificate',
    element: <AppVerifyCert />,
  }

  // {
  //   path: '/material/autocomplete',
  //   element: <AppAutoComplete />,
  // },

];

export default materialRoutes;
