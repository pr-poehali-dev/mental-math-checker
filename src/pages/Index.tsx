import { useState, useEffect } from 'react';
import type { DifficultyLevel, TaskType, Task, Stats, TrainingHistory, UserProfile } from '@/types/training';
import { generateNumeralSystemTask, generateDataUnitsTask, generateAdditionTask, generateMultiplicationTask, generateSquareTask } from '@/utils/taskGenerators';
import { playCorrectSound, playWrongSound } from '@/utils/sounds';
import MenuView from '@/components/MenuView';
import TrainingView from '@/components/TrainingView';
import AuthView from '@/components/AuthView';

const Index = () => {
  const [currentView, setCurrentView] = useState<'auth' | 'menu' | 'training'>('auth');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setCurrentView('menu');
    }
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
      avgTime: stats.avgTime,
      userName: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : undefined
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
    
    let task: Task;
    switch (type) {
      case 'numeral-system':
        task = generateNumeralSystemTask(level);
        break;
      case 'data-units':
        task = generateDataUnitsTask(level);
        break;
      case 'addition':
        task = generateAdditionTask(level);
        break;
      case 'multiplication':
        task = generateMultiplicationTask(level);
        break;
      case 'square':
        task = generateSquareTask(level);
        break;
      default:
        task = generateNumeralSystemTask(level);
    }
    
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
    const normalizedInput = userInput.trim().replace(',', '.');
    const userAnswerNum = currentTask.type === 'numeral-system' 
      ? parseInt(normalizedInput, 16)
      : parseFloat(normalizedInput);
    const isCorrect = Math.abs(userAnswerNum - currentTask.answer) < 0.01;

    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
    
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

  const handleAuth = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setCurrentView('menu');
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('userProfile');
    setCurrentView('auth');
  };

  if (currentView === 'auth') {
    return <AuthView onAuth={handleAuth} />;
  }

  if (currentView === 'menu') {
    return (
      <MenuView
        stats={stats}
        history={history}
        userProfile={userProfile}
        onStartTraining={startTraining}
        onClearHistory={clearHistory}
        onLogout={handleLogout}
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