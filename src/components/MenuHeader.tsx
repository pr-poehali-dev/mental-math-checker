import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { UserProfile } from '@/types/training';

interface MenuHeaderProps {
  userProfile: UserProfile | null;
  onLogout: () => void;
}

const MenuHeader = ({ userProfile, onLogout }: MenuHeaderProps) => {
  return (
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
  );
};

export default MenuHeader;
