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
  const answer = decimalNumber.toString(toBase).toUpperCase();

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
  let actualLevel = level;

  if (level === 'medium' && Math.random() < 0.3) {
    actualLevel = 'easy';
  } else if (level === 'hard') {
    const rand = Math.random();
    if (rand < 0.25) actualLevel = 'easy';
    else if (rand < 0.5) actualLevel = 'medium';
  }

  if (actualLevel === 'easy') {
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
  } else if (actualLevel === 'medium') {
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
    const num1 = (Math.floor(Math.random() * 1000) + 1) / 10;
    const num2 = (Math.floor(Math.random() * 1000) + 1) / 10;
    if (isAddition) {
      answer = Math.round((num1 + num2) * 10) / 10;
      question = `${num1.toFixed(1)} + ${num2.toFixed(1)} = ?`;
    } else {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = Math.round((larger - smaller) * 10) / 10;
      question = `${larger.toFixed(1)} − ${smaller.toFixed(1)} = ?`;
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
  let actualLevel = level;

  if (level === 'medium' && Math.random() < 0.3) {
    actualLevel = 'easy';
  } else if (level === 'hard') {
    const rand = Math.random();
    if (rand < 0.25) actualLevel = 'easy';
    else if (rand < 0.5) actualLevel = 'medium';
  }

  if (actualLevel === 'easy') {
    num1 = Math.floor(Math.random() * 9) + 2;
    num2 = Math.floor(Math.random() * 9) + 2;
    answer = num1 * num2;
    question = `${num1} × ${num2} = ?`;
  } else if (actualLevel === 'medium') {
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
  let actualLevel = level;

  if (level === 'medium' && Math.random() < 0.3) {
    actualLevel = 'easy';
  } else if (level === 'hard') {
    const rand = Math.random();
    if (rand < 0.25) actualLevel = 'easy';
    else if (rand < 0.5) actualLevel = 'medium';
  }

  if (actualLevel === 'easy') {
    num = Math.floor(Math.random() * 10) + 1;
  } else if (actualLevel === 'medium') {
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

export const generatePythonTask = (level: DifficultyLevel): Task => {
  let code: string;
  let answer: string | number;

  if (level === 'easy') {
    const taskType = Math.floor(Math.random() * 5);
    
    if (taskType === 0) {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
      code = `x = ${a}\ny = ${b}\nprint(x + y)`;
    } else if (taskType === 1) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      answer = a * b;
      code = `x = ${a}\ny = ${b}\nprint(x * y)`;
    } else if (taskType === 2) {
      const text = ['Hello', 'Python', 'Code', 'Test'][Math.floor(Math.random() * 4)];
      answer = text.length;
      code = `text = "${text}"\nprint(len(text))`;
    } else if (taskType === 3) {
      const num = Math.floor(Math.random() * 10) + 1;
      answer = num * 2;
      code = `x = ${num}\nx = x * 2\nprint(x)`;
    } else {
      const str = ['abc', 'xyz', 'test'][Math.floor(Math.random() * 3)];
      answer = str.toUpperCase();
      code = `s = "${str}"\nprint(s.upper())`;
    }
  } else if (level === 'medium') {
    const taskType = Math.floor(Math.random() * 6);
    
    if (taskType === 0) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const c = Math.floor(Math.random() * 10) + 1;
      answer = a + b * c;
      code = `x = ${a}\ny = ${b}\nz = ${c}\nprint(x + y * z)`;
    } else if (taskType === 1) {
      const num = Math.floor(Math.random() * 20) + 10;
      answer = num % 10;
      code = `x = ${num}\nprint(x % 10)`;
    } else if (taskType === 2) {
      const text = 'Hello World';
      const start = Math.floor(Math.random() * 3);
      const end = start + Math.floor(Math.random() * 3) + 3;
      answer = text.slice(start, end);
      code = `text = "${text}"\nprint(text[${start}:${end}])`;
    } else if (taskType === 3) {
      const nums = [2, 5, 8, 3];
      answer = Math.max(...nums);
      code = `nums = [${nums.join(', ')}]\nprint(max(nums))`;
    } else if (taskType === 4) {
      const base = Math.floor(Math.random() * 5) + 2;
      const exp = Math.floor(Math.random() * 3) + 2;
      answer = Math.pow(base, exp);
      code = `x = ${base}\ny = ${exp}\nprint(x ** y)`;
    } else {
      const text = 'python';
      answer = text.replace('p', 'P');
      code = `s = "${text}"\nprint(s.replace('p', 'P'))`;
    }
  } else {
    const taskType = Math.floor(Math.random() * 6);
    
    if (taskType === 0) {
      const nums = [3, 7, 2, 9, 4];
      answer = nums.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nresult = sum([x for x in nums if x % 2 == 0])\nprint(result)`;
    } else if (taskType === 1) {
      const text = 'Hello World';
      answer = text.split(' ').map(w => w[0]).join('');
      code = `text = "${text}"\nwords = text.split()\nprint(''.join([w[0] for w in words]))`;
    } else if (taskType === 2) {
      const a = Math.floor(Math.random() * 10) + 5;
      const b = Math.floor(Math.random() * 5) + 1;
      answer = Math.floor(a / b);
      code = `x = ${a}\ny = ${b}\nprint(x // y)`;
    } else if (taskType === 3) {
      const nums = [1, 2, 3, 4];
      answer = nums.map(n => n * 2).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nresult = sum([x * 2 for x in nums])\nprint(result)`;
    } else if (taskType === 4) {
      const text = 'abcabc';
      answer = text.length / 2;
      code = `s = "${text}"\nprint(len(s) // 2)`;
    } else {
      const num = Math.floor(Math.random() * 50) + 10;
      answer = String(num).split('').reverse().join('');
      code = `x = ${num}\nprint(str(x)[::-1])`;
    }
  }

  return {
    question: `Что выведет эта программа?\n\n${code}`,
    answer,
    userAnswer: '',
    type: 'python'
  };
};