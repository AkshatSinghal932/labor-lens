"use client";

import { useEffect, useState } from 'react';
import { mockReports, mockAchievements } from '@/data/mock';
import type { Report as ReportType, Achievement as AchievementType } from '@/types';
import ReportCard from '@/components/ReportCard';
import AchievementCard from '@/components/AchievementCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserLocation } from '@/hooks/useUserLocation';
import { MapPin, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const { t } = useLanguage();
  const { location: userLocation, error: locationError, loading: locationLoading } = useUserLocation();

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      // For now, just use all mock reports as "nearby"
      // In a real app, you'd filter based on userLocation
      setReports(mockReports.slice(0, 3)); // Show 3 nearby reports
      setIsLoadingReports(false);
    }, 1000);

    setTimeout(() => {
      setAchievements(mockAchievements);
      setIsLoadingAchievements(false);
    }, 500);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">{t('appName')}</h1>
        <p className="text-lg text-muted-foreground">{t('dashboardTitle')}</p>
      </header>

      {/* Nearby Recent Reports Section */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-semibold">{t('nearbyReportsTitle')}</h2>
        </div>
        {locationLoading && <p>{t('loading')} User location...</p>}
        {locationError && <p className="text-destructive">Error fetching location: {locationError}. Displaying general recent reports.</p>}
        
        {isLoadingReports ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">{t('noNearbyReports')}</p>
        )}
      </section>

      {/* App Achievements Showcase Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-semibold">{t('achievementsTitle')}</h2>
        </div>
        {isLoadingAchievements ? (
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md">
               <Skeleton className="h-32 w-full" />
               <Skeleton className="h-6 w-3/4 mt-2" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-2/3" />
             </div>
           ))}
         </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
