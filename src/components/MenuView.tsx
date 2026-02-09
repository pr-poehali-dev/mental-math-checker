import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DifficultyLevel, TaskType, Stats, TrainingHistory, UserProfile } from '@/types/training';

interface MenuViewProps {
  stats: Stats;
  history: TrainingHistory[];
  userProfile: UserProfile | null;
  onStartTraining: (type: TaskType, level: DifficultyLevel) => void;
  onClearHistory: () => void;
  onLogout: () => void;
}

const MenuView = ({ stats, history, userProfile, onStartTraining, onClearHistory, onLogout }: MenuViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Icon name="User" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Пользователь</p>
              <p className="text-lg font-semibold text-gray-900">
                {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Гость'}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} size="sm">
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Тренажёр счёта</h1>
          <p className="text-xl text-gray-600">Развивайте математические навыки и работу с системами счисления</p>
        </div>

        <Tabs defaultValue="addition" className="w-full">
          <div className="mb-8 space-y-4">
            <div className="bg-white rounded-lg p-2 border-2 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-2 px-2">Тренировки:</p>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-transparent h-auto">
                <TabsTrigger value="addition" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="Plus" size={16} className="mr-1" />
                  Сложение и вычитание
                </TabsTrigger>
                <TabsTrigger value="multiplication" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="X" size={16} className="mr-1" />
                  Умножение
                </TabsTrigger>
                <TabsTrigger value="square" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="Square" size={16} className="mr-1" />
                  Возведение в квадрат
                </TabsTrigger>
                <TabsTrigger value="numeral" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="Binary" size={16} className="mr-1" />
                  Системы счисления
                </TabsTrigger>
                <TabsTrigger value="data" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="HardDrive" size={16} className="mr-1" />
                  Единицы данных
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-white rounded-lg p-2 border-2 shadow-sm">
              <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent h-auto">
                <TabsTrigger value="python" className="text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="Code2" size={16} className="mr-2" />
                  Python
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="BarChart3" size={16} className="mr-2" />
                  Статистика
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-white rounded-lg p-2 border-2 shadow-sm">
              <TabsList className="grid w-full grid-cols-1 gap-2 bg-transparent h-auto">
                <TabsTrigger value="history" className="text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="History" size={16} className="mr-2" />
                  История
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="numeral" className="animate-scale-in">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon name="Binary" size={32} className="text-primary" />
                  <div>
                    <CardTitle>Системы счисления</CardTitle>
                    <CardDescription>Перевод чисел между различными системами</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => onStartTraining('numeral-system', 'easy')}
                    className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <Icon name="SmilePlus" size={28} />
                    <span>Лёгкий (0-15)</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('numeral-system', 'medium')}
                    className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Icon name="Zap" size={28} />
                    <span>Средний (0-127)</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('numeral-system', 'hard')}
                    className="h-24 text-lg flex flex-col gap-2 bg-red-500 hover:bg-red-600"
                  >
                    <Icon name="Flame" size={28} />
                    <span>Сложный (0-1023)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="animate-scale-in">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon name="HardDrive" size={32} className="text-primary" />
                  <div>
                    <CardTitle>Единицы данных</CardTitle>
                    <CardDescription>Преобразование между битами, байтами, КБ, МБ, ГБ</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => onStartTraining('data-units', 'easy')}
                    className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <Icon name="SmilePlus" size={28} />
                    <span>Лёгкий</span>
                    <span className="text-sm opacity-90">биты ↔ байты</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('data-units', 'medium')}
                    className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Icon name="Zap" size={28} />
                    <span>Средний</span>
                    <span className="text-sm opacity-90">+ КБ</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('data-units', 'hard')}
                    className="h-24 text-lg flex flex-col gap-2 bg-red-500 hover:bg-red-600"
                  >
                    <Icon name="Flame" size={28} />
                    <span>Сложный</span>
                    <span className="text-sm opacity-90">+ МБ, ГБ</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addition" className="animate-scale-in">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon name="Plus" size={32} className="text-primary" />
                  <div>
                    <CardTitle>Сложение и вычитание</CardTitle>
                    <CardDescription>Тренировка навыков сложения и вычитания</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => onStartTraining('addition', 'easy')}
                    className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <Icon name="SmilePlus" size={28} />
                    <span>Лёгкий</span>
                    <span className="text-sm opacity-90">числа до 100</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('addition', 'medium')}
                    className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Icon name="Zap" size={28} />
                    <span>Средний</span>
                    <span className="text-sm opacity-90">десятичные дроби</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('addition', 'hard')}
                    className="h-24 text-lg flex flex-col gap-2 bg-red-500 hover:bg-red-600"
                  >
                    <Icon name="Flame" size={28} />
                    <span>Сложный</span>
                    <span className="text-sm opacity-90">десятичные до 100</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="multiplication" className="animate-scale-in">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon name="X" size={32} className="text-primary" />
                  <div>
                    <CardTitle>Умножение</CardTitle>
                    <CardDescription>Тренировка навыков умножения чисел</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => onStartTraining('multiplication', 'easy')}
                    className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <Icon name="SmilePlus" size={28} />
                    <span>Лёгкий</span>
                    <span className="text-sm opacity-90">таблица умножения</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('multiplication', 'medium')}
                    className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Icon name="Zap" size={28} />
                    <span>Средний</span>
                    <span className="text-sm opacity-90">числа до 25</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('multiplication', 'hard')}
                    className="h-24 text-lg flex flex-col gap-2 bg-red-500 hover:bg-red-600"
                  >
                    <Icon name="Flame" size={28} />
                    <span>Сложный</span>
                    <span className="text-sm opacity-90">десятичные дроби</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="square" className="animate-scale-in">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon name="Square" size={32} className="text-primary" />
                  <div>
                    <CardTitle>Возведение в квадрат</CardTitle>
                    <CardDescription>Тренировка навыков возведения чисел в квадрат</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => onStartTraining('square', 'easy')}
                    className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <Icon name="SmilePlus" size={28} />
                    <span>Лёгкий</span>
                    <span className="text-sm opacity-90">числа до 10</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('square', 'medium')}
                    className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Icon name="Zap" size={28} />
                    <span>Средний</span>
                    <span className="text-sm opacity-90">числа до 20</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('square', 'hard')}
                    className="h-24 text-lg flex flex-col gap-2 bg-red-500 hover:bg-red-600"
                  >
                    <Icon name="Flame" size={28} />
                    <span>Сложный</span>
                    <span className="text-sm opacity-90">числа до 100</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="python" className="animate-scale-in">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon name="Code2" size={32} className="text-primary" />
                  <div>
                    <CardTitle>Python код</CardTitle>
                    <CardDescription>Что выведет программа на Python?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => onStartTraining('python', 'easy')}
                    className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <Icon name="SmilePlus" size={28} />
                    <span>Лёгкий</span>
                    <span className="text-sm opacity-90">базовые операции</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('python', 'medium')}
                    className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Icon name="Zap" size={28} />
                    <span>Средний</span>
                    <span className="text-sm opacity-90">строки и списки</span>
                  </Button>
                  <Button 
                    onClick={() => onStartTraining('python', 'hard')}
                    className="h-24 text-lg flex flex-col gap-2 bg-red-500 hover:bg-red-600"
                  >
                    <Icon name="Flame" size={28} />
                    <span>Сложный</span>
                    <span className="text-sm opacity-90">list comprehension</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="animate-scale-in">
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
                    <Icon name="TrendingUp" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Начните тренировку, чтобы увидеть статистику</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Правильных ответов</p>
                            <p className="text-4xl font-bold text-green-600">{stats.correct}</p>
                          </div>
                          <Icon name="CheckCircle2" size={48} className="text-green-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Неправильных ответов</p>
                            <p className="text-4xl font-bold text-red-600">{stats.wrong}</p>
                          </div>
                          <Icon name="XCircle" size={48} className="text-red-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Точность</p>
                            <p className="text-4xl font-bold text-purple-600">
                              {Math.round((stats.correct / stats.total) * 100)}%
                            </p>
                          </div>
                          <Icon name="Target" size={48} className="text-purple-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Серия побед</p>
                            <p className="text-4xl font-bold text-blue-600">{stats.streak}</p>
                          </div>
                          <Icon name="Flame" size={48} className="text-blue-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Среднее время</p>
                            <p className="text-4xl font-bold text-orange-600">
                              {(stats.avgTime / 1000).toFixed(1)}с
                            </p>
                          </div>
                          <Icon name="Timer" size={48} className="text-orange-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Оценка</p>
                            <p className="text-4xl font-bold text-teal-600">
                              {(() => {
                                const accuracy = (stats.correct / stats.total) * 100;
                                if (accuracy >= 90) return '5';
                                if (accuracy >= 75) return '4';
                                if (accuracy >= 50) return '3';
                                return '2';
                              })()}
                            </p>
                          </div>
                          <Icon name="Award" size={48} className="text-teal-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-scale-in">
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
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{taskTypeLabel}</span>
                                    {record.userName && (
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        👤 {record.userName}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">{record.date}</div>
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
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="fixed bottom-2 right-2 text-sm text-gray-500 opacity-70 select-none">
        Владислав, Тимофей, Лев ©
      </div>
    </div>
  );
};

export default MenuView;