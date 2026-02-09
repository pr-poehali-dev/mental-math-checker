import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import type { DifficultyLevel, TaskType, Stats, TrainingHistory, UserProfile } from '@/types/training';
import MenuHeader from '@/components/MenuHeader';
import TrainingCard from '@/components/TrainingCard';
import StatsSection from '@/components/StatsSection';
import HistorySection from '@/components/HistorySection';

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
        <MenuHeader userProfile={userProfile} onLogout={onLogout} />

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Тренажёр счёта</h1>
          <p className="text-xl text-gray-600">Развивайте математические навыки и работу с системами счисления</p>
        </div>

        <Tabs defaultValue="addition" className="w-full">
          <div className="mb-8 space-y-4">
            <div className="bg-white rounded-lg p-2 border-2 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-2 px-2">Математика:</p>
              <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent h-auto">
                <TabsTrigger value="addition" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="Plus" size={16} className="mr-1" />
                  <span className="hidden sm:inline">Сложение</span>
                  <span className="sm:hidden">+/−</span>
                </TabsTrigger>
                <TabsTrigger value="multiplication" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="X" size={16} className="mr-1" />
                  <span className="hidden sm:inline">Умножение</span>
                  <span className="sm:hidden">×</span>
                </TabsTrigger>
                <TabsTrigger value="square" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="Square" size={16} className="mr-1" />
                  <span className="hidden sm:inline">Квадрат</span>
                  <span className="sm:hidden">x²</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-white rounded-lg p-2 border-2 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-2 px-2">Информатика:</p>
              <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent h-auto">
                <TabsTrigger value="numeral" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="Binary" size={16} className="mr-1" />
                  <span className="hidden sm:inline">Системы</span>
                  <span className="sm:hidden">Bin</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="HardDrive" size={16} className="mr-1" />
                  <span className="hidden sm:inline">Данные</span>
                  <span className="sm:hidden">MB</span>
                </TabsTrigger>
                <TabsTrigger value="python" className="text-xs sm:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="Code2" size={16} className="mr-1" />
                  Python
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-white rounded-lg p-2 border-2 shadow-sm">
              <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent h-auto">
                <TabsTrigger value="stats" className="text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="BarChart3" size={16} className="mr-2" />
                  Статистика
                </TabsTrigger>
                <TabsTrigger value="history" className="text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Icon name="History" size={16} className="mr-2" />
                  История
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="numeral" className="animate-scale-in">
            <TrainingCard
              icon="Binary"
              title="Системы счисления"
              description="Перевод чисел между различными системами"
              taskType="numeral-system"
              easyLabel="0-15"
              mediumLabel="0-127"
              hardLabel="0-1023"
              onStartTraining={onStartTraining}
            />
          </TabsContent>

          <TabsContent value="data" className="animate-scale-in">
            <TrainingCard
              icon="HardDrive"
              title="Единицы данных"
              description="Преобразование между битами, байтами, КБ, МБ, ГБ"
              taskType="data-units"
              easyLabel="биты ↔ байты"
              mediumLabel="+ КБ"
              hardLabel="+ МБ, ГБ"
              onStartTraining={onStartTraining}
            />
          </TabsContent>

          <TabsContent value="addition" className="animate-scale-in">
            <TrainingCard
              icon="Plus"
              title="Сложение и вычитание"
              description="Тренировка навыков сложения и вычитания"
              taskType="addition"
              easyLabel="числа до 100"
              mediumLabel="десятичные дроби"
              hardLabel="большие числа"
              onStartTraining={onStartTraining}
            />
          </TabsContent>

          <TabsContent value="multiplication" className="animate-scale-in">
            <TrainingCard
              icon="X"
              title="Умножение"
              description="Тренировка навыков умножения"
              taskType="multiplication"
              easyLabel="таблица умножения"
              mediumLabel="числа до 25"
              hardLabel="десятичные дроби"
              onStartTraining={onStartTraining}
            />
          </TabsContent>

          <TabsContent value="square" className="animate-scale-in">
            <TrainingCard
              icon="Square"
              title="Возведение в квадрат"
              description="Тренировка навыков возведения чисел в квадрат"
              taskType="square"
              easyLabel="числа до 10"
              mediumLabel="числа до 20"
              hardLabel="числа до 100"
              onStartTraining={onStartTraining}
            />
          </TabsContent>

          <TabsContent value="python" className="animate-scale-in">
            <TrainingCard
              icon="Code2"
              title="Python код"
              description="Что выведет программа на Python?"
              taskType="python"
              easyLabel="базовые операции"
              mediumLabel="строки и списки"
              hardLabel="list comprehension"
              onStartTraining={onStartTraining}
            />
          </TabsContent>

          <TabsContent value="stats" className="animate-scale-in">
            <StatsSection stats={stats} userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="history" className="animate-scale-in">
            <HistorySection history={history} onClearHistory={onClearHistory} />
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
