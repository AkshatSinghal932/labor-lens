import type { Achievement, Report, ReportType } from '@/types';
import { Award, ShieldCheck, Users, TrendingUp } from 'lucide-react';

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: '1000+ Reports Processed',
    description: 'Successfully processed over a thousand reports, aiding in addressing labor issues.',
    icon: TrendingUp,
    imageUrl: 'https://picsum.photos/seed/achievement1/300/200',
    // data-ai-hint="community support"
  },
  {
    id: '2',
    title: 'Safe Workplaces Initiative',
    description: 'Contributed to policy changes leading to safer working environments in 5 regions.',
    icon: ShieldCheck,
    imageUrl: 'https://picsum.photos/seed/achievement2/300/200',
    // data-ai-hint="workplace safety"
  },
  {
    id: '3',
    title: 'Fair Wage Advocacy Success',
    description: 'Helped recover $50,000 in unpaid wages for workers through highlighted reports.',
    icon: Award,
    imageUrl: 'https://picsum.photos/seed/achievement3/300/200',
    // data-ai-hint="financial justice"
  },
  {
    id: '4',
    title: 'Community Awareness Raised',
    description: 'Reached 100,000+ individuals with awareness campaigns on labor rights.',
    icon: Users,
    imageUrl: 'https://picsum.photos/seed/achievement4/300/200',
    // data-ai-hint="public awareness"
  },
];

const reportDescriptions = [
  "Workers at the construction site on Elm Street are not being provided with proper safety harnesses or helmets. Multiple near-miss incidents have occurred in the past month. Management ignores complaints.",
  "Employees at the downtown restaurant 'Quick Bites' are consistently paid less than the minimum wage. Pay slips are often inaccurate, and overtime hours are not compensated correctly.",
  "Textile factory 'WearWell Apparels' has extremely poor ventilation and excessive heat, leading to workers fainting. Emergency exits are also partially blocked with materials.",
  "Delivery drivers for 'Speedy Couriers' are forced to work 12-14 hour shifts without adequate breaks. Their per-delivery pay rate effectively puts them below minimum wage for the hours worked.",
  "Farm workers at 'Green Valley Farms' are exposed to pesticides without protective gear. Several workers have reported skin rashes and respiratory problems.",
  "Call center 'Global Connect' mandates unpaid overtime, threatening termination for those who refuse. The work environment is also highly stressful with constant surveillance."
];

const locations = [
  "123 Elm Street, Springfield",
  "456 Oak Avenue, Metropolis",
  "789 Pine Lane, Gotham City",
  "101 Maple Drive, Star City",
  "202 Birch Road, Central City",
  "303 Cedar Court, Coast City"
];

const reportTypesArray: ReportType[] = ['Wage Theft', 'Safety Violation', 'Unfair Wages', 'Unsafe Working Conditions'];

export const mockReports: Report[] = Array.from({ length: 6 }, (_, i) => {
  const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
  const reportType = reportTypesArray[i % reportTypesArray.length];
  const isActionable = Math.random() > 0.3; // 70% chance of being actionable
  const severityScore = Math.floor(Math.random() * 7) + 4; // Score between 4 and 10

  return {
    id: `report-${i + 1}`,
    anonymousUserId: `user-${(i % 3) + 1}`, // Simulating a few different users
    dateOfIncidence: randomDate.toISOString().split('T')[0],
    location: locations[i % locations.length],
    typeOfIncidence: reportType,
    description: reportDescriptions[i % reportDescriptions.length],
    submittedAt: new Date(randomDate.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
    status: (['Pending', 'Reviewed', 'ActionTaken'] as Report['status'][])[i % 3],
    aiPrioritization: {
      severityScore: severityScore,
      reasoning: `AI analysis indicates a severity of ${severityScore}/10 due to factors like potential immediate danger or systemic wage issues.`,
      actionable: isActionable,
    },
    mediaProof: i % 2 === 0 ? { name: 'evidence.jpg', type: 'image/jpeg' } : undefined,
  };
});
