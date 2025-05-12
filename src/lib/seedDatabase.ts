
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { mockReports as rawMockReports, mockAchievements as rawMockAchievements } from '@/data/mock';
import type { Report, Achievement } from '@/types';

// Helper to convert mock achievement icon component to string name
const getIconName = (iconComponent: React.ElementType | undefined): keyof typeof import('lucide-react') | undefined => {
  if (!iconComponent) return undefined;
  // This is a heuristic. In a real app, you might have a map or store the name directly in mock data.
  const name = iconComponent.displayName || iconComponent.name;
  if (name && ['Award', 'ShieldCheck', 'Users', 'TrendingUp'].includes(name)) {
    return name as keyof typeof import('lucide-react');
  }
  return undefined;
};


export const seedInitialData = async () => {
  console.log("Attempting to seed initial data...");

  try {
    // Seed Reports
    const reportsCollectionRef = collection(db, 'reports');
    const reportsSnapshot = await getDocs(reportsCollectionRef);
    if (reportsSnapshot.empty) {
      const batch = writeBatch(db);
      rawMockReports.forEach((report) => {
        const docRef = doc(reportsCollectionRef, report.id); // Use mock ID for consistency if needed, or let Firestore auto-generate
        const reportDataForFirestore = {
          ...report,
          dateOfIncidence: report.dateOfIncidence, // Already a string
          submittedAt: Timestamp.fromDate(new Date(report.submittedAt)), // Convert to Firestore Timestamp
        };
        batch.set(docRef, reportDataForFirestore);
      });
      await batch.commit();
      console.log('Mock reports seeded successfully.');
    } else {
      console.log('Reports collection already contains data. Skipping seed.');
    }

    // Seed Achievements
    const achievementsCollectionRef = collection(db, 'achievements');
    const achievementsSnapshot = await getDocs(achievementsCollectionRef);
    if (achievementsSnapshot.empty) {
      const batch = writeBatch(db);
      rawMockAchievements.forEach((achievement) => {
        const docRef = doc(achievementsCollectionRef, achievement.id); // Use mock ID
        const achievementDataForFirestore: Omit<Achievement, 'icon'> & { iconName?: string } = {
          ...achievement,
          iconName: getIconName(achievement.icon),
        };
        delete (achievementDataForFirestore as any).icon; // Remove actual component
        batch.set(docRef, achievementDataForFirestore);
      });
      await batch.commit();
      console.log('Mock achievements seeded successfully.');
    } else {
      console.log('Achievements collection already contains data. Skipping seed.');
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};
