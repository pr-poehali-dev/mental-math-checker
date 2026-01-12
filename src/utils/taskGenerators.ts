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
  const answer = parseInt(decimalNumber.toString(toBase), toBase);

  const baseNames: { [key: number]: string } = {
    2: 'двоичной',
    8: 'восьмеричной',
    10: 'десятичной',
    16: 'шестнадцатеричной'
  };

  return {
    question: `Переведите ${fromNumber} из ${baseNames[fromBase]} системы в ${baseNames[toBase]} (основание ${toBase})`,
    answer: answer,
    userAnswer: '',
    type: 'numeral-system'
  };
};

export const generateDataUnitsTask = (level: DifficultyLevel): Task => {
  const units = [
    { name: 'бит', plural: 'бит', genitive: 'битах', order: 0, toBits: 1 },
    { name: 'байт', plural: 'байт', genitive: 'байтах', order: 1, toBits: 8 },
    { name: 'КБ', plural: 'КБ', genitive: 'КБ', order: 2, toBits: 8 * 1024 },
    { name: 'МБ', plural: 'МБ', genitive: 'МБ', order: 3, toBits: 8 * 1024 * 1024 },
    { name: 'ГБ', plural: 'ГБ', genitive: 'ГБ', order: 4, toBits: 8 * 1024 * 1024 * 1024 }
  ];

  let fromUnit, toUnit;
  
  if (level === 'easy') {
    const availableUnits = units.slice(0, 3);
    fromUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    toUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    while (toUnit.order === fromUnit.order) {
      toUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    }
  } else if (level === 'medium') {
    const availableUnits = units.slice(0, 4);
    fromUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    toUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    while (toUnit.order === fromUnit.order) {
      toUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    }
  } else {
    fromUnit = units[Math.floor(Math.random() * units.length)];
    toUnit = units[Math.floor(Math.random() * units.length)];
    while (toUnit.order === fromUnit.order) {
      toUnit = units[Math.floor(Math.random() * units.length)];
    }
  }

  const orderDiff = Math.abs(fromUnit.order - toUnit.order);
  let baseValue: number;

  if (fromUnit.order > toUnit.order) {
    if (orderDiff === 1) {
      baseValue = level === 'easy' ? Math.floor(Math.random() * 16) + 1 :
                  level === 'medium' ? Math.floor(Math.random() * 64) + 1 :
                  Math.floor(Math.random() * 256) + 1;
    } else if (orderDiff === 2) {
      baseValue = level === 'easy' ? Math.floor(Math.random() * 8) + 1 :
                  level === 'medium' ? Math.floor(Math.random() * 16) + 1 :
                  Math.floor(Math.random() * 32) + 1;
    } else {
      baseValue = Math.floor(Math.random() * 8) + 1;
    }
  } else {
    if (orderDiff === 1) {
      baseValue = level === 'easy' ? (Math.floor(Math.random() * 16) + 1) * (toUnit.toBits / fromUnit.toBits) :
                  level === 'medium' ? (Math.floor(Math.random() * 32) + 1) * (toUnit.toBits / fromUnit.toBits) :
                  (Math.floor(Math.random() * 64) + 1) * (toUnit.toBits / fromUnit.toBits);
    } else if (orderDiff === 2) {
      const multiplier = toUnit.toBits / fromUnit.toBits;
      baseValue = level === 'easy' ? (Math.floor(Math.random() * 4) + 1) * multiplier :
                  level === 'medium' ? (Math.floor(Math.random() * 8) + 1) * multiplier :
                  (Math.floor(Math.random() * 16) + 1) * multiplier;
    } else {
      const multiplier = toUnit.toBits / fromUnit.toBits;
      baseValue = (Math.floor(Math.random() * 2) + 1) * multiplier;
    }
  }

  const bitsValue = baseValue * fromUnit.toBits;
  const answer = bitsValue / toUnit.toBits;
  const question = `Сколько ${toUnit.plural} в ${baseValue} ${fromUnit.genitive}?`;

  return {
    question: question,
    answer: Math.round(answer),
    userAnswer: '',
    type: 'data-units'
  };
};
