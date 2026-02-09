import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { Stats, UserProfile } from '@/types/training';

interface StatsSectionProps {
  stats: Stats;
  userProfile: UserProfile | null;
}

const StatsSection = ({ stats, userProfile }: StatsSectionProps) => {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  let grade = 2;
  if (accuracy >= 90) grade = 5;
  else if (accuracy >= 75) grade = 4;
  else if (accuracy >= 50) grade = 3;

  const gradeColor = grade === 5 ? 'from-green-50 to-green-100 text-green-600' :
                     grade === 4 ? 'from-blue-50 to-blue-100 text-blue-600' :
                     grade === 3 ? 'from-yellow-50 to-yellow-100 text-yellow-600' :
                     'from-red-50 to-red-100 text-red-600';

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="BarChart3" size={32} className="text-primary" />
            <div>
              <CardTitle>Статистика текущей сессии</CardTitle>
              <CardDescription>
                {userProfile ? `Результаты ${userProfile.firstName} ${userProfile.lastName}` : 'Ваши результаты за время тренировки'}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {stats.total === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Icon name="FileQuestion" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Пока нет статистики</p>
            <p className="text-sm">Начните тренировку, чтобы увидеть свои результаты</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={`bg-gradient-to-br ${gradeColor} col-span-1 md:col-span-3`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="Award" size={48} className="mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Текущая оценка</p>
                  <p className="text-6xl font-bold mb-2">{grade}</p>
                  <p className="text-xs text-gray-500">
                    {grade === 5 ? 'Отлично!' : grade === 4 ? 'Хорошо!' : grade === 3 ? 'Удовлетворительно' : 'Нужно больше практики'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="Target" size={32} className="mx-auto mb-3 text-blue-600" />
                  <p className="text-sm text-gray-600 mb-1">Точность</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {Math.round((stats.correct / stats.total) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {stats.correct} из {stats.total}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-br ${stats.streak >= 5 ? 'from-orange-50 to-orange-100' : 'from-yellow-50 to-yellow-100'}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="Flame" size={32} className={`mx-auto mb-3 ${stats.streak >= 5 ? 'text-orange-600' : 'text-orange-500'}`} />
                  <p className="text-sm text-gray-600 mb-1">Серия</p>
                  <p className={`text-4xl font-bold ${stats.streak >= 5 ? 'text-orange-600' : 'text-orange-500'}`}>
                    {stats.streak} {stats.streak >= 10 ? '🔥' : stats.streak >= 5 ? '✨' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">подряд правильных</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="Timer" size={32} className="mx-auto mb-3 text-green-600" />
                  <p className="text-sm text-gray-600 mb-1">Среднее время</p>
                  <p className="text-4xl font-bold text-green-600">
                    {(stats.avgTime / 1000).toFixed(1)}с
                  </p>
                  <p className="text-xs text-gray-500 mt-2">на задачу</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="CheckCircle2" size={32} className="mx-auto mb-3 text-purple-600" />
                  <p className="text-sm text-gray-600 mb-1">Правильных</p>
                  <p className="text-4xl font-bold text-purple-600">{stats.correct}</p>
                  <p className="text-xs text-gray-500 mt-2">ответов</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="XCircle" size={32} className="mx-auto mb-3 text-red-600" />
                  <p className="text-sm text-gray-600 mb-1">Ошибок</p>
                  <p className="text-4xl font-bold text-red-600">{stats.wrong}</p>
                  <p className="text-xs text-gray-500 mt-2">неверных</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="Award" size={32} className="mx-auto mb-3 text-teal-600" />
                  <p className="text-sm text-gray-600 mb-1">Всего задач</p>
                  <p className="text-4xl font-bold text-teal-600">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-2">решено</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsSection;