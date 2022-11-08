export const navigations = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
  { label: 'ADMIN', type: 'label' },
  {
    name: 'ADMIN',
    icon: 'folder',
    children: [
      { name: 'Icon', path: '/material/icons', iconText: 'A' },
      { name: 'Add Certificate', path: '/material/addcertificate', icon: 'border_color' },
      { name: 'Add Manager', path: '/material/addmanager', icon: 'group_add' },
      { name: 'All Certificate', path: '/material/listcertificate', icon: 'wb_cloudy' },
      { name: 'All Manager', path: '/material/listmanager', icon: 'wb_cloudy' },
    
    ],
  },
  { label: 'MANAGER', type: 'label' },
  {
    name: 'MANAGER',
    icon: 'folder',
    children: [
      { name: 'Add Certificate', path: '/material/addcertificate', icon: 'border_color' },
      { name: 'All Certificate', path: '/material/listcertificate', icon: 'wb_cloudy' },
    ],
  },
  { label: 'CLIENT', type: 'label' },
  {
    name: 'CLIENT',
    icon: 'folder',
    children: [
      { name: 'Verify Certificate', path: '/material/verifycertificate', icon: 'check_circle' },
      { name: 'Find Certificate', path: '/material/findcertificate', icon: 'search' },
    ],
  }

];
