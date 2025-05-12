import type { Achievement } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const IconComponent = achievement.iconName ? LucideIcons[achievement.iconName] as React.ElementType : null;
  
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {achievement.imageUrl && (
        <div className="relative h-40 w-full">
          <Image
            src={achievement.imageUrl}
            alt={achievement.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            data-ai-hint={achievement.title.toLowerCase().split(' ').slice(0,2).join(' ')}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{achievement.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
