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

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const toMixedNumber = (numerator: number, denominator: number): string => {
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  if (remainder === 0) return whole.toString();
  if (whole === 0) return `${remainder}/${denominator}`;
  return `${whole} ${remainder}/${denominator}`;
};

export const generateAdditionTask = (level: DifficultyLevel): Task => {
  const isAddition = Math.random() > 0.5;
  let question: string;
  let answer: number;

  if (level === 'easy') {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    if (isAddition) {
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = larger - smaller;
      question = `${larger} − ${smaller} = ?`;
    }
  } else if (level === 'medium') {
    const num1 = (Math.floor(Math.random() * 100) + 1) / 10;
    const num2 = (Math.floor(Math.random() * 100) + 1) / 10;
    if (isAddition) {
      answer = Math.round((num1 + num2) * 10) / 10;
      question = `${num1.toFixed(1)} + ${num2.toFixed(1)} = ?`;
    } else {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = Math.round((larger - smaller) * 10) / 10;
      question = `${larger.toFixed(1)} − ${smaller.toFixed(1)} = ?`;
    }
  } else {
    const denominators = [2, 3, 4, 5, 6, 8];
    const denom1 = denominators[Math.floor(Math.random() * denominators.length)];
    const denom2 = denominators[Math.floor(Math.random() * denominators.length)];
    const num1 = Math.floor(Math.random() * (denom1 * 2)) + 1;
    const num2 = Math.floor(Math.random() * (denom2 * 2)) + 1;
    
    const commonDenom = (denom1 * denom2) / gcd(denom1, denom2);
    const newNum1 = num1 * (commonDenom / denom1);
    const newNum2 = num2 * (commonDenom / denom2);
    
    if (isAddition) {
      const resultNum = newNum1 + newNum2;
      const simplifiedGcd = gcd(resultNum, commonDenom);
      answer = resultNum / simplifiedGcd;
      const answerDenom = commonDenom / simplifiedGcd;
      question = `${toMixedNumber(num1, denom1)} + ${toMixedNumber(num2, denom2)} = ? (ответ: числитель дроби ${answer}/${answerDenom})`;
    } else {
      const larger = newNum1 > newNum2 ? { num: num1, denom: denom1, common: newNum1 } : { num: num2, denom: denom2, common: newNum2 };
      const smaller = newNum1 > newNum2 ? { num: num2, denom: denom2, common: newNum2 } : { num: num1, denom: denom1, common: newNum1 };
      const resultNum = larger.common - smaller.common;
      const simplifiedGcd = gcd(resultNum, commonDenom);
      answer = resultNum / simplifiedGcd;
      const answerDenom = commonDenom / simplifiedGcd;
      question = `${toMixedNumber(larger.num, larger.denom)} − ${toMixedNumber(smaller.num, smaller.denom)} = ? (ответ: числитель дроби ${answer}/${answerDenom})`;
    }
  }

  return {
    question,
    answer,
    userAnswer: '',
    type: 'addition'
  };
};

export const generateMultiplicationTask = (level: DifficultyLevel): Task => {
  let num1: number, num2: number, answer: number, question: string;

  if (level === 'easy') {
    num1 = Math.floor(Math.random() * 9) + 2;
    num2 = Math.floor(Math.random() * 9) + 2;
    answer = num1 * num2;
    question = `${num1} × ${num2} = ?`;
  } else if (level === 'medium') {
    num1 = Math.floor(Math.random() * 25) + 1;
    num2 = Math.floor(Math.random() * 25) + 1;
    answer = num1 * num2;
    question = `${num1} × ${num2} = ?`;
  } else {
    num1 = (Math.floor(Math.random() * 100) + 1) / 10;
    num2 = (Math.floor(Math.random() * 100) + 1) / 10;
    answer = Math.round(num1 * num2 * 10) / 10;
    question = `${num1.toFixed(1)} × ${num2.toFixed(1)} = ?`;
  }

  return {
    question,
    answer,
    userAnswer: '',
    type: 'multiplication'
  };
};

export const generateSquareTask = (level: DifficultyLevel): Task => {
  let num: number, answer: number, question: string;

  if (level === 'easy') {
    num = Math.floor(Math.random() * 10) + 1;
  } else if (level === 'medium') {
    num = Math.floor(Math.random() * 20) + 1;
  } else {
    num = Math.floor(Math.random() * 100) + 1;
  }

  answer = num * num;
  question = `${num}² = ?`;

  return {
    question,
    answer,
    userAnswer: '',
    type: 'square'
  };
};