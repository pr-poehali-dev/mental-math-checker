import { useTraining } from '@/hooks/useTraining';
import MenuView from '@/components/MenuView';
import TrainingView from '@/components/TrainingView';

const Index = () => {
  const {
    currentView,
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
    clearHistory,
    setCurrentView
  } = useTraining();

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
      feedback={feedback}
      timer={timer}
      stats={stats}
      onInputChange={setUserInput}
      onCheckAnswer={checkAnswer}
      onKeyPress={handleKeyPress}
      onBackToMenu={() => {
        saveToHistory();
        setCurrentView('menu');
      }}
    />
  );
};

export default Index;
