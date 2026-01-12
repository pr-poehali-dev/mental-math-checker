import { useState, useEffect } from 'react';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TaskType = 'numeral-system' | 'data-units' | 'mixed';

export interface Task {
  question: string;
  answer: number;
  userAnswer: string;
  type: TaskType;
}

export interface Stats {
  total: number;
  correct: number;
  wrong: number;
  streak: number;
  totalTime: number;
  avgTime: number;
}

export interface TrainingHistory {
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

export const useTraining = () => {
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
      { from: 'бит', fromPlural: 'бита', to: 'байт', toPlural: 'байта', multiplier: 8 },
      { from: 'байт', fromPlural: 'байта', to: 'КБ', toPlural: 'КБ', multiplier: 1024 },
      { from: 'КБ', fromPlural: 'КБ', to: 'МБ', toPlural: 'МБ', multiplier: 1024 },
      { from: 'МБ', fromPlural: 'МБ', to: 'ГБ', toPlural: 'ГБ', multiplier: 1024 }
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
      question = `Сколько ${conversion.to} в ${baseValue} ${conversion.fromPlural}?`;
    } else {
      baseValue = level === 'easy' ? Math.floor(Math.random() * 16) + 1 :
                  level === 'medium' ? Math.floor(Math.random() * 64) + 1 :
                  Math.floor(Math.random() * 256) + 1;
      answer = baseValue * conversion.multiplier;
      question = `Сколько ${conversion.fromPlural} в ${baseValue} ${conversion.to}?`;
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

  return {
    currentView,
    setCurrentView,
    taskType,
    difficulty,
    currentTask,
    userInput,
    setUserInput,
    stats,
    feedback,
    timer,
    history,
    startTraining,
    checkAnswer,
    handleKeyPress,
    saveToHistory,
    clearHistory
  };
};
