import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DifficultyLevel = 'easy' | 'medium' | 'hard';
type TaskType = 'numeral-system' | 'data-units' | 'mixed';

interface Task {
  question: string;
  answer: number;
  userAnswer: string;
  type: TaskType;
}

interface Stats {
  total: number;
  correct: number;
  wrong: number;
  streak: number;
  totalTime: number;
  avgTime: number;
}

interface TrainingHistory {
  id: string;
  date: string;
  taskType: TaskType;
  difficulty: DifficultyLevel;
  total: number;
  correct: number;
  accuracy: number;
  grade: number;
  totalTime: number;
  avgTime: number;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'menu' | 'training'>('menu');
  const [taskType, setTaskType] = useState<TaskType>('numeral-system');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [userInput, setUserInput] = useState('');
  const [stats, setStats] = useState<Stats>({ total: 0, correct: 0, wrong: 0, streak: 0, totalTime: 0, avgTime: 0 });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [history, setHistory] = useState<TrainingHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('trainingHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = () => {
    if (stats.total === 0) return;

    const accuracy = Math.round((stats.correct / stats.total) * 100);
    let grade = 2;
    if (accuracy >= 90) grade = 5;
    else if (accuracy >= 75) grade = 4;
    else if (accuracy >= 50) grade = 3;

    const newRecord: TrainingHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ru-RU'),
      taskType,
      difficulty,
      total: stats.total,
      correct: stats.correct,
      accuracy,
      grade,
      totalTime: stats.totalTime,
      avgTime: stats.avgTime
    };

    const updatedHistory = [newRecord, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('trainingHistory', JSON.stringify(updatedHistory));
  };

  const generateNumeralSystemTask = (level: DifficultyLevel): Task => {
    const systems = [2, 8, 10, 16];
    const fromBase = systems[Math.floor(Math.random() * systems.length)];
    let toBase = systems[Math.floor(Math.random() * systems.length)];
    while (toBase === fromBase) {
      toBase = systems[Math.floor(Math.random() * systems.length)];
    }

    const maxNumber = level === 'easy' ? 15 : level === 'medium' ? 127 : 1023;
    const decimalNumber = Math.floor(Math.random() * maxNumber) + 1;
    
    const fromNumber = decimalNumber.toString(fromBase).toUpperCase();
    const answer = parseInt(decimalNumber.toString(toBase), 10);

    const baseNames: { [key: number]: string } = {
      2: 'двоичной',
      8: 'восьмеричной',
      10: 'десятичной',
      16: 'шестнадцатеричной'
    };

    return {
      question: `Переведите ${fromNumber} из ${baseNames[fromBase]} системы в ${baseNames[toBase]} (основание ${toBase})`,
      answer: parseInt(decimalNumber.toString(toBase), 16),
      userAnswer: '',
      type: 'numeral-system'
    };
  };

  const generateDataUnitsTask = (level: DifficultyLevel): Task => {
    const conversions = [
      { from: 'бит', fromPlural: 'бит', fromGenitive: 'битах', to: 'байт', toPlural: 'байт', toGenitive: 'байтах', multiplier: 8 },
      { from: 'байт', fromPlural: 'байт', fromGenitive: 'байтах', to: 'КБ', toPlural: 'КБ', toGenitive: 'КБ', multiplier: 1024 },
      { from: 'КБ', fromPlural: 'КБ', fromGenitive: 'КБ', to: 'МБ', toPlural: 'МБ', toGenitive: 'МБ', multiplier: 1024 },
      { from: 'МБ', fromPlural: 'МБ', fromGenitive: 'МБ', to: 'ГБ', toPlural: 'ГБ', toGenitive: 'ГБ', multiplier: 1024 }
    ];

    let availableConversions = conversions;
    if (level === 'easy') {
      availableConversions = conversions.slice(0, 2);
    } else if (level === 'medium') {
      availableConversions = conversions.slice(0, 3);
    }

    const conversion = availableConversions[Math.floor(Math.random() * availableConversions.length)];
    const direction = Math.random() > 0.5;

    let baseValue: number;
    let answer: number;
    let question: string;

    if (direction) {
      if (level === 'easy') {
        baseValue = (Math.floor(Math.random() * 16) + 1) * conversion.multiplier;
      } else if (level === 'medium') {
        baseValue = (Math.floor(Math.random() * 8) + 1) * conversion.multiplier;
      } else {
        baseValue = (Math.floor(Math.random() * 10) + 1) * conversion.multiplier;
      }
      answer = baseValue / conversion.multiplier;
      question = `Сколько ${conversion.toPlural} в ${baseValue} ${conversion.fromGenitive}?`;
    } else {
      baseValue = level === 'easy' ? Math.floor(Math.random() * 16) + 1 :
                  level === 'medium' ? Math.floor(Math.random() * 64) + 1 :
                  Math.floor(Math.random() * 256) + 1;
      answer = baseValue * conversion.multiplier;
      question = `Сколько ${conversion.fromPlural} в ${baseValue} ${conversion.toGenitive}?`;
    }

    return {
      question: question,
      answer: Math.round(answer),
      userAnswer: '',
      type: 'data-units'
    };
  };

  const startTraining = (type: TaskType, level: DifficultyLevel) => {
    setTaskType(type);
    setDifficulty(level);
    setStats({ total: 0, correct: 0, wrong: 0, streak: 0, totalTime: 0, avgTime: 0 });
    generateNewTask(type, level);
    setCurrentView('training');
  };

  const generateNewTask = (type: TaskType, level: DifficultyLevel) => {
    setUserInput('');
    setFeedback(null);
    setTimer(0);
    setTimerActive(true);
    
    const task = type === 'numeral-system' 
      ? generateNumeralSystemTask(level)
      : generateDataUnitsTask(level);
    
    setCurrentTask(task);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive && feedback === null) {
      interval = setInterval(() => {
        setTimer(prev => prev + 10);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, feedback]);

  const checkAnswer = () => {
    if (!currentTask || userInput.trim() === '') return;

    setTimerActive(false);
    const userAnswerNum = parseInt(userInput.trim(), currentTask.type === 'numeral-system' ? 16 : 10);
    const isCorrect = userAnswerNum === currentTask.answer;

    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    setStats(prev => {
      const newTotal = prev.total + 1;
      const newTotalTime = prev.totalTime + timer;
      return {
        total: newTotal,
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
        streak: isCorrect ? prev.streak + 1 : 0,
        totalTime: newTotalTime,
        avgTime: Math.round(newTotalTime / newTotal)
      };
    });

    setTimeout(() => {
      generateNewTask(taskType, difficulty);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('trainingHistory');
  };

  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Тренажёр устного счёта</h1>
            <p className="text-xl text-gray-600">Развивайте навыки работы с системами счисления и единицами данных</p>
          </div>

          <Tabs defaultValue="numeral" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="numeral">Системы счисления</TabsTrigger>
              <TabsTrigger value="data">Единицы данных</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
            </TabsList>

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
                      onClick={() => startTraining('numeral-system', 'easy')}
                      className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <Icon name="SmilePlus" size={28} />
                      <span>Лёгкий (0-15)</span>
                    </Button>
                    <Button 
                      onClick={() => startTraining('numeral-system', 'medium')}
                      className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Icon name="Zap" size={28} />
                      <span>Средний (0-127)</span>
                    </Button>
                    <Button 
                      onClick={() => startTraining('numeral-system', 'hard')}
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
                      onClick={() => startTraining('data-units', 'easy')}
                      className="h-24 text-lg flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <Icon name="SmilePlus" size={28} />
                      <span>Лёгкий</span>
                      <span className="text-sm opacity-90">биты ↔ байты</span>
                    </Button>
                    <Button 
                      onClick={() => startTraining('data-units', 'medium')}
                      className="h-24 text-lg flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Icon name="Zap" size={28} />
                      <span>Средний</span>
                      <span className="text-sm opacity-90">+ КБ</span>
                    </Button>
                    <Button 
                      onClick={() => startTraining('data-units', 'hard')}
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

            <TabsContent value="stats" className="animate-scale-in">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon name="BarChart3" size={32} className="text-primary" />
                    <div>
                      <CardTitle>Статистика текущей сессии</CardTitle>
                      <CardDescription>Ваши результаты за время тренировки</CardDescription>
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
                        onClick={clearHistory}
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
                                             record.taskType === 'data-units' ? 'Единицы данных' : 'Смешанная';

                        return (
                          <Card key={record.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-2xl font-bold px-3 py-1 rounded-lg ${gradeColor}`}>
                                    {record.grade}
                                  </span>
                                  <div>
                                    <div className="font-semibold text-gray-900">{taskTypeLabel}</div>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => {
              saveToHistory();
              setCurrentView('menu');
            }}
            className="flex items-center gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад в меню
          </Button>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {difficulty === 'easy' ? '🟢 Лёгкий' : difficulty === 'medium' ? '🟡 Средний' : '🔴 Сложный'}
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
              <CardTitle className="text-2xl">Задача №{stats.total + 1}</CardTitle>
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
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={feedback !== null}
                placeholder="Введите ответ..."
                className="w-full px-6 py-4 text-2xl text-center border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 transition-all"
                autoFocus
              />

              <Button
                onClick={checkAnswer}
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

export default Index;
