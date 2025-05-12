"use client";

import { useEffect, useState } from 'react';
import ReportCard from '@/components/ReportCard';
import { mockReports } from '@/data/mock';
import type { Report as ReportType, ReportType as TReportType } from '@/types';
import { reportTypes } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, ListFilter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function ViewReportsPage() {
  const { t, language } = useLanguage();
  const [allReports, setAllReports] = useState<ReportType[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TReportType | 'all'>('all');
  // Location filter can be a text input for simplicity
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    // Simulate fetching all reports
    setTimeout(() => {
      setAllReports(mockReports);
      setFilteredReports(mockReports);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let reports = [...allReports];

    if (searchTerm) {
      reports = reports.filter(report =>
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      reports = reports.filter(report => report.typeOfIncidence === selectedType);
    }

    if (locationFilter) {
      reports = reports.filter(report =>
        report.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredReports(reports);
  }, [searchTerm, selectedType, locationFilter, allReports]);

  const getTranslatedReportType = (typeKey: TReportType) => {
    const keyMap = {
      'Wage Theft': 'wageTheft',
      'Safety Violation': 'safetyViolation',
      'Unfair Wages': 'unfairWages',
      'Unsafe Working Conditions': 'unsafeWorkingConditions',
      'Other': 'other',
    } as const;
    return t(keyMap[typeKey] as keyof import('@/types').Translations);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">{t('viewReportsTitle')}</h1>
      </header>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-muted-foreground mb-1">
              <Search className="inline h-4 w-4 mr-1" />
              Search Reports
            </label>
            <Input
              id="searchTerm"
              placeholder="Search by keyword or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-muted-foreground mb-1">
              <Filter className="inline h-4 w-4 mr-1" />
              {t('filterByType')}
            </label>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as TReportType | 'all')}>
              <SelectTrigger id="typeFilter">
                <SelectValue placeholder={t('allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                {reportTypes.map(type => (
                  <SelectItem key={type} value={type}>{getTranslatedReportType(type)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="locationFilter" className="block text-sm font-medium text-muted-foreground mb-1">
              <ListFilter className="inline h-4 w-4 mr-1" />
              {t('filterByLocation')}
            </label>
            <Input
              id="locationFilter"
              placeholder="Enter city or area..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[...Array(6)].map((_, i) => (
           <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md">
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-4 w-1/2" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-10 w-full mt-2" />
           </div>
         ))}
       </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">{t('noReportsFound')}</p>
      )}
    </div>
  );
}
