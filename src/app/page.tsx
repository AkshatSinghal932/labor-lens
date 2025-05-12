"use client";

import { useEffect, useState } from 'react';
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
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

export default function DashboardPage() {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const { t } = useLanguage();
  const { location: userLocation, error: locationError, loading: locationLoading } = useUserLocation();

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoadingReports(true);
      try {
        if (!db) {
          console.error("Firestore not initialized");
          setReports([]);
          setIsLoadingReports(false);
          return;
        }
        // Fetch recent reports, ordered by submission date, limited to 3
        // In a real app, you'd filter by userLocation if available
        const reportsQuery = query(collection(db, 'reports'), orderBy('submittedAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(reportsQuery);
        const fetchedReports = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            submittedAt: (data.submittedAt as Timestamp).toDate().toISOString(),
            dateOfIncidence: data.dateOfIncidence, // Should be already a string
          } as ReportType;
        });
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        // Potentially set an error state to display to user
      } finally {
        setIsLoadingReports(false);
      }
    };

    const fetchAchievements = async () => {
      setIsLoadingAchievements(true);
      try {
        if (!db) {
          console.error("Firestore not initialized");
          setAchievements([]);
          setIsLoadingAchievements(false);
          return;
        }
        const achievementsQuery = query(collection(db, 'achievements'), orderBy('title')); // Example ordering
        const querySnapshot = await getDocs(achievementsQuery);
        const fetchedAchievements = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as AchievementType));
        setAchievements(fetchedAchievements);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setIsLoadingAchievements(false);
      }
    };
    
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      fetchReports();
      fetchAchievements();
    } else {
      setIsLoadingReports(false);
      setIsLoadingAchievements(false);
      console.warn("Firebase Project ID not set. Skipping data fetching for dashboard.");
    }

  }, []); // Run once on mount

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
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No achievements to display.</p>
        )
        }
      </section>
    </div>
  );
}
