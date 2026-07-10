import { ServiceCategory } from '../types';
import { cn } from '../utils/cn';
import { Globe, Tv, Phone, Smartphone, Zap } from 'lucide-react';

interface CategorySelectorProps {
  onSelect: (category: ServiceCategory) => void;
  disabled?: boolean;
}

const categories = [
  { id: 'internet' as ServiceCategory, name: 'Интернет', icon: Globe, color: 'blue' },
  { id: 'tv' as ServiceCategory, name: 'Телевидение', icon: Tv, color: 'purple' },
  { id: 'telephony' as ServiceCategory, name: 'Телефония', icon: Phone, color: 'green' },
  { id: 'mobile' as ServiceCategory, name: 'Мобильная связь', icon: Smartphone, color: 'orange' },
  { id: 'equipment' as ServiceCategory, name: 'Оборудование', icon: Zap, color: 'red' }
];

const colorClasses = {
  blue: 'hover:bg-blue-50 hover:border-blue-500',
  purple: 'hover:bg-purple-50 hover:border-purple-500',
  green: 'hover:bg-green-50 hover:border-green-500',
  orange: 'hover:bg-orange-50 hover:border-orange-500',
  red: 'hover:bg-red-50 hover:border-red-500'
};

export function CategorySelector({ onSelect, disabled }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            disabled={disabled}
            className={cn(
              'p-6 rounded-xl border-2 border-gray-200',
              'transition-all duration-200',
              colorClasses[category.color],
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex flex-col items-center gap-3'
            )}
          >
            <div className={`w-12 h-12 rounded-full bg-${category.color}-100 flex items-center justify-center`}>
              <Icon className={`w-6 h-6 text-${category.color}-600`} />
            </div>
            <span className="font-medium text-gray-800">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
