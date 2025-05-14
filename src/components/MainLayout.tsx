
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AppLogo from '@/components/AppLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Home, FilePlus, ListFilter, Award } from 'lucide-react'; // Added Award icon
import { useLanguage } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import { useAnonymousId } from '@/hooks/useAnonymousId'; // Initialize anonymous ID

interface NavItem {
  href: string;
  labelKey: keyof import('@/types').Translations;
  icon: React.ElementType;
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  useAnonymousId(); // Ensures anonymous ID is generated/retrieved on client mount

  const navItems: NavItem[] = [
    { href: '/', labelKey: 'navDashboard', icon: Home },
    { href: '/submit-report', labelKey: 'navSubmitReport', icon: FilePlus },
    { href: '/reports', labelKey: 'navViewReports', icon: ListFilter },
    { href: '/achievements', labelKey: 'navAchievements', icon: Award }, // Added Achievements nav item
  ];

  return (
    <SidebarProvider defaultOpen={false}> {/* Default to collapsed */}
      <Sidebar>
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={t(item.labelKey)}
                  >
                    <a>
                      <item.icon />
                      <span>{t(item.labelKey)}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-2">
           <div className="flex items-center justify-between">
             <p className="text-xs text-sidebar-foreground/70">© Labour Lens</p>
             <LanguageSwitcher />
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 md:hidden">
          <SidebarTrigger className="md:hidden" />
          <div className="font-semibold text-lg">{t('appName')}</div>
          <LanguageSwitcher />
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
