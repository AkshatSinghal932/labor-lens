import type { Report } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, CalendarDays, Tag, AlertCircle, CheckCircle, ShieldAlert, HandCoins, Scale, HardHat, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportCardProps {
  report: Report;
}

const reportTypeIcons: { [key in Report['typeOfIncidence']]: React.ElementType } = {
  'Wage Theft': HandCoins,
  'Safety Violation': ShieldAlert,
  'Unfair Wages': Scale,
  'Unsafe Working Conditions': HardHat,
  'Other': FileText,
};

export default function ReportCard({ report }: ReportCardProps) {
  const { t, language } = useLanguage();

  const ReportIcon = reportTypeIcons[report.typeOfIncidence] || FileText;

  const getTranslatedReportType = (typeKey: Report['typeOfIncidence']) => {
    const keyMap = {
      'Wage Theft': 'wageTheft',
      'Safety Violation': 'safetyViolation',
      'Unfair Wages': 'unfairWages',
      'Unsafe Working Conditions': 'unsafeWorkingConditions',
      'Other': 'other',
    } as const;
    return t(keyMap[typeKey] as keyof import('@/types').Translations);
  };
  
  const getStatusVariant = (status: Report['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Reviewed': return 'secondary';
      case 'ActionTaken': return 'outline'; // Or a success-like variant if available
      default: return 'default';
    }
  };


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg mb-1 flex items-center gap-2">
            <ReportIcon className="h-6 w-6 text-primary" />
            {`${t('reportId')}: ${report.id.substring(0, 8)}...`}
          </CardTitle>
          <Badge variant={getStatusVariant(report.status)}>{report.status}</Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {t('submittedAt', 'Submitted')}: {new Date(report.submittedAt).toLocaleDateString(language)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span>{t('date')}: {new Date(report.dateOfIncidence).toLocaleDateString(language)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{t('location')}: {report.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span>{t('type')}: {getTranslatedReportType(report.typeOfIncidence)}</span>
        </div>
        <p className="text-sm line-clamp-3">{report.description}</p>
        {report.aiPrioritization && (
          <div className="mt-2 p-2 border border-dashed rounded-md bg-muted/50">
            <h4 className="text-xs font-semibold text-foreground mb-1">{t('aiPrioritization', 'AI Analysis')}</h4>
            <div className="flex items-center gap-2 text-xs">
              {report.aiPrioritization.actionable ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-orange-500" />}
              <span>{t('actionable')}: {report.aiPrioritization.actionable ? t('yes') : t('no')}</span>
            </div>
            <div className="text-xs">
              {t('severityScore')}: {report.aiPrioritization.severityScore}/10
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          {t('viewReportButton')}
        </Button>
      </CardFooter>
    </Card>
  );
}
