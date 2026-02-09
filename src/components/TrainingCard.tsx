import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { DifficultyLevel, TaskType } from '@/types/training';

interface TrainingCardProps {
  icon: string;
  title: string;
  description: string;
  taskType: TaskType;
  easyLabel: string;
  mediumLabel: string;
  hardLabel: string;
  onStartTraining: (type: TaskType, level: DifficultyLevel) => void;
}

const TrainingCard = ({
  icon,
  title,
  description,
  taskType,
  easyLabel,
  mediumLabel,
  hardLabel,
  onStartTraining
}: TrainingCardProps) => {
  return (
    <Card className="border-2 hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon name={icon} size={32} className="text-primary" />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => onStartTraining(taskType, 'easy')}
            className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
          >
            <Icon name="SmilePlus" size={28} />
            <span>Лёгкий</span>
            {easyLabel && <span className="text-sm opacity-90">{easyLabel}</span>}
          </Button>
          <Button 
            onClick={() => onStartTraining(taskType, 'medium')}
            className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
          >
            <Icon name="Zap" size={28} />
            <span>Средний</span>
            {mediumLabel && <span className="text-sm opacity-90">{mediumLabel}</span>}
          </Button>
          <Button 
            onClick={() => onStartTraining(taskType, 'hard')}
            className="h-24 text-lg flex flex-col gap-2 bg-red-500 hover:bg-red-600"
          >
            <Icon name="Flame" size={28} />
            <span>Сложный</span>
            {hardLabel && <span className="text-sm opacity-90">{hardLabel}</span>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingCard;
