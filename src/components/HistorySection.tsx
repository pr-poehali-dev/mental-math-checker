import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { TrainingHistory } from '@/types/training';

interface HistorySectionProps {
  history: TrainingHistory[];
  onClearHistory: () => void;
}

const HistorySection = ({ history, onClearHistory }: HistorySectionProps) => {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="History" size={32} className="text-primary" />
            <div>
              <CardTitle>История тренировок</CardTitle>
              <CardDescription>Последние 20 тренировок с оценками</CardDescription>
            </div>
          </div>
          {history.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onClearHistory}
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Очистить
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Icon name="FileQuestion" size={48} className="mx-auto mb-4 opacity-50" />
            <p>История тренировок пуста</p>
            <p className="text-sm">Пройдите тренировку, чтобы увидеть результаты здесь</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {history.map((record) => {
              const gradeColor = record.grade === 5 ? 'bg-green-100 text-green-800' :
                                record.grade === 4 ? 'bg-blue-100 text-blue-800' :
                                record.grade === 3 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800';
              
              const difficultyEmoji = record.difficulty === 'easy' ? '🟢' : 
                                     record.difficulty === 'medium' ? '🟡' : '🔴';
              
              const taskTypeLabel = record.taskType === 'numeral-system' ? 'Системы счисления' :
                                   record.taskType === 'data-units' ? 'Единицы данных' :
                                   record.taskType === 'addition' ? 'Сложение' :
                                   record.taskType === 'multiplication' ? 'Умножение' :
                                   record.taskType === 'square' ? 'Квадрат' :
                                   record.taskType === 'python' ? 'Python' : 'Смешанная';

              return (
                <Card key={record.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-2xl font-bold px-3 py-1 rounded-lg ${gradeColor}`}>
                          {record.grade}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{taskTypeLabel}</p>
                          <p className="text-xs text-gray-500">{record.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{difficultyEmoji} {record.difficulty === 'easy' ? 'Лёгкий' : record.difficulty === 'medium' ? 'Средний' : 'Сложный'}</span>
                        <span>📊 {record.correct}/{record.total} ({record.accuracy}%)</span>
                        <span>⏱️ {(record.avgTime / 1000).toFixed(1)}с</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistorySection;
