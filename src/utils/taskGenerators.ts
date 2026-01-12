import type { DifficultyLevel, Task } from '@/types/training';

export const generateNumeralSystemTask = (level: DifficultyLevel): Task => {
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

export const generateDataUnitsTask = (level: DifficultyLevel): Task => {
  const conversions = [
    { from: 'бит', fromPlural: 'бит', fromGenitive: 'битах', to: 'байт', toPlural: 'байт', toGenitive: 'байтах', multiplier: 8 },
    { from: 'байт', fromPlural: 'байт', fromGenitive: 'байтах', to: 'КБ', toPlural: 'КБ', toGenitive: 'КБ', multiplier: 1024 },
    { from: 'КБ', fromPlural: 'КБ', fromGenitive: 'КБ', to: 'МБ', toPlural: 'МБ', toGenitive: 'МБ', multiplier: 1024 },
    { from: 'МБ', fromPlural: 'МБ', fromGenitive: 'МБ', to: 'ГБ', toPlural: 'ГБ', toGenitive: 'ГБ', multiplier: 1024 }
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
    question = `Сколько ${conversion.toPlural} в ${baseValue} ${conversion.fromGenitive}?`;
  } else {
    baseValue = level === 'easy' ? Math.floor(Math.random() * 16) + 1 :
                level === 'medium' ? Math.floor(Math.random() * 64) + 1 :
                Math.floor(Math.random() * 256) + 1;
    answer = baseValue * conversion.multiplier;
    question = `Сколько ${conversion.fromPlural} в ${baseValue} ${conversion.toGenitive}?`;
  }

  return {
    question: question,
    answer: Math.round(answer),
    userAnswer: '',
    type: 'data-units'
  };
};
