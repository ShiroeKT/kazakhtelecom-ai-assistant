import { Malfunction } from '../types';
import { CheckCircle, Clock, AlertTriangle, Wrench } from 'lucide-react';
import { cn } from '../utils/cn';

interface DiagnosisCardProps {
  diagnosis: Malfunction;
  onReset?: () => void;
}

export function DiagnosisCard({ diagnosis, onReset }: DiagnosisCardProps) {
  const severityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const severityLabels = {
    low: 'Низкая',
    medium: 'Средняя',
    high: 'Высокая'
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'instruction':
        return '📝';
      case 'check':
        return '✅';
      case 'reset':
        return '🔄';
      case 'configuration':
        return '⚙️';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-white" />
          <h3 className="text-lg font-semibold text-white">Диагностика завершена</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">{diagnosis.name}</h4>
          <p className="text-gray-600">{diagnosis.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className={cn(
            'px-3 py-1 rounded-full text-sm font-medium',
            severityColors[diagnosis.severity]
          )}>
            Важность: {severityLabels[diagnosis.severity]}
          </span>
          
          {diagnosis.requiresTechnician && (
            <span className="flex items-center gap-1 text-orange-600">
              <Wrench className="w-4 h-4" />
              <span className="text-sm">Требуется техник</span>
            </span>
          )}
        </div>

        <div>
          <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Возможные причины
          </h5>
          <ul className="space-y-2">
            {diagnosis.possibleCauses.map((cause, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-gray-400 mt-1">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Решения
          </h5>
          <div className="space-y-3">
            {diagnosis.solutions.map((solution) => (
              <div key={solution.step} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{getActionIcon(solution.actionType)}</span>
                <div>
                  <span className="font-medium text-gray-900">Шаг {solution.step}:</span>
                  <span className="text-gray-700 ml-2">{solution.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span className="text-sm">
            Ориентировочное время решения: {diagnosis.estimatedResolutionTime}
          </span>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Начать новую диагностику
          </button>
        )}
      </div>
    </div>
  );
}
