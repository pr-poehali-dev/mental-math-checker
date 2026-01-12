import { useState, useEffect } from 'react';
import type { DifficultyLevel, TaskType, Task, Stats, TrainingHistory } from '@/types/training';
import { generateNumeralSystemTask, generateDataUnitsTask } from '@/utils/taskGenerators';
import MenuView from '@/components/MenuView';
import TrainingView from '@/components/TrainingView';

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

  const handleBackToMenu = () => {
    saveToHistory();
    setCurrentView('menu');
  };

  if (currentView === 'menu') {
    return (
      <MenuView
        stats={stats}
        history={history}
        onStartTraining={startTraining}
        onClearHistory={clearHistory}
      />
    );
  }

  return (
    <TrainingView
      difficulty={difficulty}
      currentTask={currentTask}
      userInput={userInput}
      stats={stats}
      feedback={feedback}
      timer={timer}
      onBack={handleBackToMenu}
      onCheckAnswer={checkAnswer}
      onUserInputChange={setUserInput}
      onKeyPress={handleKeyPress}
    />
  );
};

export default Index;
