import { Building2 } from 'lucide-react';
import type { FC } from 'react';

interface AppLogoProps {
  collapsed?: boolean;
}

const AppLogo: FC<AppLogoProps> = ({ collapsed }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-sidebar text-sidebar-foreground">
      <Building2 className="h-6 w-6 text-sidebar-primary" />
      {!collapsed && (
        <h1 className="text-xl font-semibold">
          Labour Lens
        </h1>
      )}
    </div>
  );
};

export default AppLogo;
