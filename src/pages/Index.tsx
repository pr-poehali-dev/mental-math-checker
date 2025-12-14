import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
    const units = ['биты', 'байты', 'КБ', 'МБ', 'ГБ'];
    const multipliers = [1, 8, 8192, 8388608, 8589934592];
    
    const fromIndex = level === 'easy' ? Math.floor(Math.random() * 2) : 
                    level === 'medium' ? Math.floor(Math.random() * 3) :
                    Math.floor(Math.random() * 4);
    const toIndex = fromIndex + 1 + Math.floor(Math.random() * (units.length - fromIndex - 1));

    const baseValue = level === 'easy' ? Math.floor(Math.random() * 8) + 1 :
                      level === 'medium' ? Math.floor(Math.random() * 64) + 1 :
                      Math.floor(Math.random() * 512) + 1;

    const bitsValue = baseValue * multipliers[fromIndex];
    const answer = Math.floor(bitsValue / multipliers[toIndex]);

    return {
      question: `Сколько ${units[toIndex]} в ${baseValue} ${units[fromIndex]}?`,
      answer: answer,
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

  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Тренажер устного счета</h1>
            <p className="text-xl text-gray-600">Развивайте навыки работы с системами счисления и единицами данных</p>
          </div>

          <Tabs defaultValue="numeral" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="numeral">Системы счисления</TabsTrigger>
              <TabsTrigger value="data">Единицы данных</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
            </TabsList>

            <TabsContent value="numeral" className="animate-scale-in">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon name="Binary" size={32} className="text-primary" />
                    <div>
                      <CardTitle>Системы счисления</CardTitle>
                      <CardDescription>Тренируйте перевод между двоичной, восьмеричной, десятичной и шестнадцатеричной системами</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => startTraining('numeral-system', 'easy')}
                      className="h-24 flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <Icon name="Smile" size={24} />
                      <span className="text-lg font-semibold">Легкий</span>
                      <span className="text-xs opacity-90">Числа до 15</span>
                    </Button>
                    <Button 
                      onClick={() => startTraining('numeral-system', 'medium')}
                      className="h-24 flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Icon name="Meh" size={24} />
                      <span className="text-lg font-semibold">Средний</span>
                      <span className="text-xs opacity-90">Числа до 127</span>
                    </Button>
                    <Button 
                      onClick={() => startTraining('numeral-system', 'hard')}
                      className="h-24 flex flex-col gap-2 bg-red-500 hover:bg-red-600"
                    >
                      <Icon name="Frown" size={24} />
                      <span className="text-lg font-semibold">Сложный</span>
                      <span className="text-xs opacity-90">Числа до 1023</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="animate-scale-in">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon name="HardDrive" size={32} className="text-secondary" />
                    <div>
                      <CardTitle>Единицы данных</CardTitle>
                      <CardDescription>Практикуйте перевод между битами, байтами, килобайтами, мегабайтами и гигабайтами</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => startTraining('data-units', 'easy')}
                      className="h-24 flex flex-col gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <Icon name="Smile" size={24} />
                      <span className="text-lg font-semibold">Легкий</span>
                      <span className="text-xs opacity-90">Биты ↔ Байты</span>
                    </Button>
                    <Button 
                      onClick={() => startTraining('data-units', 'medium')}
                      className="h-24 flex flex-col gap-2 bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Icon name="Meh" size={24} />
                      <span className="text-lg font-semibold">Средний</span>
                      <span className="text-xs opacity-90">До КБ</span>
                    </Button>
                    <Button 
                      onClick={() => startTraining('data-units', 'hard')}
                      className="h-24 flex flex-col gap-2 bg-red-500 hover:bg-red-600"
                    >
                      <Icon name="Frown" size={24} />
                      <span className="text-lg font-semibold">Сложный</span>
                      <span className="text-xs opacity-90">До ГБ</span>
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
                      <CardTitle>Ваша статистика</CardTitle>
                      <CardDescription>Отслеживайте свой прогресс в реальном времени</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <Icon name="Target" size={32} className="mx-auto mb-2 text-primary" />
                      <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                      <div className="text-sm text-gray-600">Всего задач</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <Icon name="CheckCircle" size={32} className="mx-auto mb-2 text-green-600" />
                      <div className="text-3xl font-bold text-gray-900">{stats.correct}</div>
                      <div className="text-sm text-gray-600">Правильно</div>
                    </div>
                    <div className="text-center p-6 bg-red-50 rounded-lg">
                      <Icon name="XCircle" size={32} className="mx-auto mb-2 text-red-600" />
                      <div className="text-3xl font-bold text-gray-900">{stats.wrong}</div>
                      <div className="text-sm text-gray-600">Неправильно</div>
                    </div>
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <Icon name="Zap" size={32} className="mx-auto mb-2 text-yellow-600" />
                      <div className="text-3xl font-bold text-gray-900">{stats.streak}</div>
                      <div className="text-sm text-gray-600">Серия побед</div>
                    </div>
                  </div>
                  
                  {stats.total > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="text-center p-6 bg-purple-50 rounded-lg">
                        <Icon name="Clock" size={32} className="mx-auto mb-2 text-purple-600" />
                        <div className="text-3xl font-bold text-gray-900">{(stats.avgTime / 1000).toFixed(1)}с</div>
                        <div className="text-sm text-gray-600">Среднее время</div>
                      </div>
                      <div className="text-center p-6 bg-indigo-50 rounded-lg">
                        <Icon name="Timer" size={32} className="mx-auto mb-2 text-indigo-600" />
                        <div className="text-3xl font-bold text-gray-900">{(stats.totalTime / 1000).toFixed(1)}с</div>
                        <div className="text-sm text-gray-600">Общее время</div>
                      </div>
                    </div>
                  )}
                  
                  {stats.total > 0 && (
                    <div className="mt-8 space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Точность</span>
                        <span className="font-semibold">{Math.round((stats.correct / stats.total) * 100)}%</span>
                      </div>
                      <Progress value={(stats.correct / stats.total) * 100} className="h-3" />
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
            onClick={() => setCurrentView('menu')}
            className="flex items-center gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад в меню
          </Button>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {difficulty === 'easy' ? '🟢 Легкий' : difficulty === 'medium' ? '🟡 Средний' : '🔴 Сложный'}
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-gray-600">Задач</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
            <div className="text-xs text-gray-600">Верно</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-red-600">{stats.wrong}</div>
            <div className="text-xs text-gray-600">Ошибок</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.streak}</div>
            <div className="text-xs text-gray-600">Серия</div>
          </Card>
        </div>

        {currentTask && (
          <Card className={`border-2 transition-all animate-scale-in ${
            feedback === 'correct' ? 'border-green-500 bg-green-50' : 
            feedback === 'wrong' ? 'border-red-500 bg-red-50' : ''
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <Icon name="Clock" size={20} />
                  <span className="text-lg font-mono font-semibold">
                    {(timer / 1000).toFixed(2)}с
                  </span>
                </div>
                {stats.avgTime > 0 && (
                  <div className="text-sm text-gray-500">
                    Средн: {(stats.avgTime / 1000).toFixed(1)}с
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl text-center">{currentTask.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите ответ..."
                  className="w-full text-3xl text-center p-6 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={feedback !== null}
                  autoFocus
                />
                
                {feedback === 'correct' && (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-semibold animate-scale-in">
                    <Icon name="CheckCircle" size={24} />
                    Правильно! 🎉
                  </div>
                )}
                
                {feedback === 'wrong' && (
                  <div className="flex flex-col items-center gap-2 text-red-600 font-semibold animate-scale-in">
                    <div className="flex items-center gap-2">
                      <Icon name="XCircle" size={24} />
                      Неправильно
                    </div>
                    <div className="text-sm">Правильный ответ: {currentTask.answer.toString(currentTask.type === 'numeral-system' ? 16 : 10).toUpperCase()}</div>
                  </div>
                )}
              </div>

              <Button 
                onClick={checkAnswer} 
                className="w-full h-14 text-lg"
                disabled={feedback !== null || userInput.trim() === ''}
              >
                <Icon name="Send" size={20} className="mr-2" />
                Проверить
              </Button>

              {currentTask.type === 'numeral-system' && (
                <div className="text-sm text-center text-gray-500 bg-gray-50 p-3 rounded">
                  💡 Подсказка: Для шестнадцатеричных чисел используйте A-F
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;