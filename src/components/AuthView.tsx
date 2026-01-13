import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import type { UserProfile } from '@/types/training';

interface AuthViewProps {
  onAuth: (profile: UserProfile) => void;
}

const AuthView = ({ onAuth }: AuthViewProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      onAuth({ firstName: firstName.trim(), lastName: lastName.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Icon name="User" size={48} className="text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Добро пожаловать!</CardTitle>
          <CardDescription className="text-base">
            Представьтесь, чтобы начать тренировку
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Введите ваше имя"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="text-lg"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Введите вашу фамилию"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-lg h-12"
              disabled={!firstName.trim() || !lastName.trim()}
            >
              <Icon name="LogIn" size={20} className="mr-2" />
              Начать тренировку
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="w-full text-base h-10"
              onClick={() => onAuth({ firstName: 'Гость', lastName: '' })}
            >
              Продолжить без входа
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthView;