import type { Achievement } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const IconComponent = achievement.icon;
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {achievement.imageUrl && (
        <div className="relative h-40 w-full">
          <Image
            src={achievement.imageUrl}
            alt={achievement.title}
            layout="fill"
            objectFit="cover"
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
