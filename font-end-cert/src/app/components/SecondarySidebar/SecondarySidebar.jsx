import useSettings from 'app/hooks/useSettings';
import SecondarySidenavTheme from '../MatxTheme/SecondarySidenavTheme/SecondarySidenavTheme';


const SecondarySidebar = () => {
  const { settings } = useSettings();
  const secondarySidebarTheme = settings.themes[settings.secondarySidebar.theme];

  return (
    <SecondarySidenavTheme theme={secondarySidebarTheme}>
    </SecondarySidenavTheme>
  );
};

export default SecondarySidebar;
