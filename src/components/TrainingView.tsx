import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Task, Stats, DifficultyLevel } from '@/hooks/useTraining';

interface TrainingViewProps {
  difficulty: DifficultyLevel;
  currentTask: Task | null;
  userInput: string;
  feedback: 'correct' | 'wrong' | null;
  timer: number;
  stats: Stats;
  onInputChange: (value: string) => void;
  onCheckAnswer: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onBackToMenu: () => void;
}

const TrainingView = ({
  difficulty,
  currentTask,
  userInput,
  feedback,
  timer,
  stats,
  onInputChange,
  onCheckAnswer,
  onKeyPress,
  onBackToMenu
}: TrainingViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBackToMenu}
            className="flex items-center gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад в меню
          </Button>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {difficulty === 'easy' ? '🟢 Легкий' : difficulty === 'medium' ? '🟡 Средний' : '🔴 Сложный'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Icon name="Target" size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-600">Точность</p>
                <p className="text-2xl font-bold">
                  {stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Icon name="Flame" size={24} className="mx-auto mb-2 text-orange-500" />
                <p className="text-sm text-gray-600">Серия</p>
                <p className="text-2xl font-bold">{stats.streak}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Icon name="Timer" size={24} className="mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-gray-600">Среднее время</p>
                <p className="text-2xl font-bold">
                  {stats.total === 0 ? '0.0' : (stats.avgTime / 1000).toFixed(1)}с
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border-2 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Задача #{stats.total + 1}</CardTitle>
              <div className="text-3xl font-mono tabular-nums text-primary">
                {(timer / 1000).toFixed(2)}с
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <p className="text-2xl text-center font-medium text-gray-800">
                {currentTask?.question}
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={onKeyPress}
                disabled={feedback !== null}
                placeholder="Введите ответ..."
                className="w-full px-6 py-4 text-2xl text-center border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 transition-all"
                autoFocus
              />

              <Button
                onClick={onCheckAnswer}
                disabled={feedback !== null || userInput.trim() === ''}
                className="w-full py-6 text-xl"
                size="lg"
              >
                {feedback === null ? (
                  <>
                    <Icon name="Send" size={24} className="mr-2" />
                    Проверить ответ
                  </>
                ) : feedback === 'correct' ? (
                  <>
                    <Icon name="CheckCircle2" size={24} className="mr-2" />
                    Правильно!
                  </>
                ) : (
                  <>
                    <Icon name="XCircle" size={24} className="mr-2" />
                    Неправильно
                  </>
                )}
              </Button>

              {feedback && (
                <div className={`p-4 rounded-lg text-center animate-scale-in ${
                  feedback === 'correct' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {feedback === 'wrong' && (
                    <p className="text-lg">
                      Правильный ответ: <span className="font-bold">{currentTask?.answer}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Прогресс</span>
              <span className="text-sm text-gray-600">
                {stats.correct} правильных / {stats.total} всего
              </span>
            </div>
            <Progress 
              value={stats.total === 0 ? 0 : (stats.correct / stats.total) * 100} 
              className="h-3"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingView;
