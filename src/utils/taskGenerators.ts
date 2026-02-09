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
  let actualLevel = level;

  if (level === 'medium' && Math.random() < 0.3) {
    actualLevel = 'easy';
  } else if (level === 'hard') {
    const rand = Math.random();
    if (rand < 0.25) actualLevel = 'easy';
    else if (rand < 0.5) actualLevel = 'medium';
  }

  let num: number;
  if (actualLevel === 'easy') {
    num = Math.floor(Math.random() * 10) + 1;
  } else if (actualLevel === 'medium') {
    num = Math.floor(Math.random() * 20) + 1;
  } else {
    num = Math.floor(Math.random() * 100) + 1;
  }

  const answer = num * num;
  const question = `${num}² = ?`;

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
    const taskType = Math.floor(Math.random() * 20);
    
    if (taskType === 0) {
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * 50) + 10;
      answer = a + b;
      code = `x = ${a}\ny = ${b}\nprint(x + y)`;
    } else if (taskType === 1) {
      const a = Math.floor(Math.random() * 15) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      answer = a * b;
      code = `x = ${a}\ny = ${b}\nprint(x * y)`;
    } else if (taskType === 2) {
      const texts = ['Welcome', 'JavaScript', 'Programming', 'Algorithm', 'Database', 'Network', 'Computer', 'Software'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = text.length;
      code = `text = "${text}"\nprint(len(text))`;
    } else if (taskType === 3) {
      const num = Math.floor(Math.random() * 20) + 5;
      answer = num * 2;
      code = `x = ${num}\nx = x * 2\nprint(x)`;
    } else if (taskType === 4) {
      const strs = ['hello', 'world', 'code', 'data', 'info', 'tech'];
      const str = strs[Math.floor(Math.random() * strs.length)];
      answer = str.toUpperCase();
      code = `s = "${str}"\nprint(s.upper())`;
    } else if (taskType === 5) {
      const strs = ['PYTHON', 'JAVA', 'SWIFT', 'RUST', 'GOLANG'];
      const str = strs[Math.floor(Math.random() * strs.length)];
      answer = str.toLowerCase();
      code = `s = "${str}"\nprint(s.lower())`;
    } else if (taskType === 6) {
      const a = Math.floor(Math.random() * 30) + 20;
      const b = Math.floor(Math.random() * 15) + 5;
      answer = a - b;
      code = `x = ${a}\ny = ${b}\nprint(x - y)`;
    } else if (taskType === 7) {
      const num = Math.floor(Math.random() * 50) + 10;
      answer = num + 10;
      code = `x = ${num}\nprint(x + 10)`;
    } else if (taskType === 8) {
      const texts = ['apple', 'banana', 'cherry', 'orange', 'grape', 'melon'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = text[0].toUpperCase() + text.slice(1);
      code = `s = "${text}"\nprint(s.capitalize())`;
    } else if (taskType === 9) {
      const num = Math.floor(Math.random() * 40) + 10;
      const div = Math.floor(Math.random() * 3) + 3;
      answer = num * div;
      code = `x = ${num}\nprint(x * ${div})`;
    } else if (taskType === 10) {
      const nums = [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1];
      answer = nums[0] + nums[1] + nums[2];
      code = `a = ${nums[0]}\nb = ${nums[1]}\nc = ${nums[2]}\nprint(a + b + c)`;
    } else if (taskType === 11) {
      const texts = ['test', 'code', 'loop', 'data', 'file'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = text.repeat(2);
      code = `s = "${text}"\nprint(s * 2)`;
    } else if (taskType === 12) {
      const num = Math.floor(Math.random() * 15) + 5;
      answer = num % 3;
      code = `x = ${num}\nprint(x % 3)`;
    } else if (taskType === 13) {
      const words = ['cat', 'dog', 'car', 'bus', 'box', 'key'];
      const word = words[Math.floor(Math.random() * words.length)];
      answer = word.split('').reverse().join('');
      code = `s = "${word}"\nprint(s[::-1])`;
    } else if (taskType === 14) {
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 5) + 2;
      answer = a ** b;
      code = `x = ${a}\ny = ${b}\nprint(x ** y)`;
    } else if (taskType === 15) {
      const num = Math.floor(Math.random() * 100) + 20;
      answer = String(num)[0];
      code = `x = ${num}\nprint(str(x)[0])`;
    } else if (taskType === 16) {
      const texts = ['apple', 'orange', 'banana', 'cherry'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = text.replace('a', 'A');
      code = `s = "${text}"\nprint(s.replace('a', 'A'))`;
    } else if (taskType === 17) {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 3) + 2;
      answer = Math.floor(a / b);
      code = `x = ${a}\ny = ${b}\nprint(x // y)`;
    } else if (taskType === 18) {
      const nums = [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1];
      answer = Math.max(...nums);
      code = `a = ${nums[0]}\nb = ${nums[1]}\nprint(max(a, b))`;
    } else {
      const texts = ['Hello', 'World', 'Python', 'Code'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const idx = Math.floor(Math.random() * text.length);
      answer = text[idx];
      code = `s = "${text}"\nprint(s[${idx}])`;
    }
  } else if (level === 'medium') {
    const taskType = Math.floor(Math.random() * 25);
    
    if (taskType === 0) {
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 8) + 2;
      answer = a + b * c;
      code = `x = ${a}\ny = ${b}\nz = ${c}\nprint(x + y * z)`;
    } else if (taskType === 1) {
      const num = Math.floor(Math.random() * 80) + 20;
      answer = num % 10;
      code = `x = ${num}\nprint(x % 10)`;
    } else if (taskType === 2) {
      const texts = ['Hello World', 'Python Code', 'Data Science', 'Machine Learning', 'Web Development'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const start = Math.floor(Math.random() * 3);
      const end = start + Math.floor(Math.random() * 4) + 3;
      answer = text.slice(start, end);
      code = `text = "${text}"\nprint(text[${start}:${end}])`;
    } else if (taskType === 3) {
      const nums = Array.from({length: 4}, () => Math.floor(Math.random() * 20) + 1);
      answer = Math.max(...nums);
      code = `nums = [${nums.join(', ')}]\nprint(max(nums))`;
    } else if (taskType === 4) {
      const base = Math.floor(Math.random() * 6) + 2;
      const exp = Math.floor(Math.random() * 3) + 2;
      answer = Math.pow(base, exp);
      code = `x = ${base}\ny = ${exp}\nprint(x ** y)`;
    } else if (taskType === 5) {
      const texts = ['python', 'javascript', 'golang', 'kotlin'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const chars = ['a', 'e', 'o', 'i'];
      const from = chars[Math.floor(Math.random() * chars.length)];
      answer = text.replace(from, from.toUpperCase());
      code = `s = "${text}"\nprint(s.replace('${from}', '${from.toUpperCase()}'))`;
    } else if (taskType === 6) {
      const num = Math.floor(Math.random() * 50) + 30;
      answer = num % 7;
      code = `x = ${num}\nprint(x % 7)`;
    } else if (taskType === 7) {
      const nums = Array.from({length: 4}, () => Math.floor(Math.random() * 15) + 1);
      answer = Math.min(...nums);
      code = `nums = [${nums.join(', ')}]\nprint(min(nums))`;
    } else if (taskType === 8) {
      const texts = ['programming', 'algorithm', 'database', 'network'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const idx = Math.floor(Math.random() * (text.length - 3)) + 1;
      answer = text[idx];
      code = `s = "${text}"\nprint(s[${idx}])`;
    } else if (taskType === 9) {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 5) + 2;
      answer = Math.floor(a / b);
      code = `x = ${a}\ny = ${b}\nprint(x // y)`;
    } else if (taskType === 10) {
      const nums = Array.from({length: 5}, () => Math.floor(Math.random() * 10) + 1);
      answer = nums.reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nprint(sum(nums))`;
    } else if (taskType === 11) {
      const texts = ['developer', 'engineer', 'architect', 'analyst'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = text.length;
      code = `s = "${text}"\nresult = len(s)\nprint(result)`;
    } else if (taskType === 12) {
      const a = Math.floor(Math.random() * 12) + 3;
      const b = Math.floor(Math.random() * 5) + 2;
      answer = a % b;
      code = `x = ${a}\ny = ${b}\nresult = x % y\nprint(result)`;
    } else if (taskType === 13) {
      const words = ['Hello World', 'Python Code', 'Quick Sort', 'Deep Learning'];
      const word = words[Math.floor(Math.random() * words.length)];
      answer = word.split(' ').length;
      code = `text = "${word}"\nwords = text.split()\nprint(len(words))`;
    } else if (taskType === 14) {
      const texts = ['testing', 'coding', 'learning', 'teaching'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = text.replace('ing', 'ed');
      code = `s = "${text}"\nprint(s.replace('ing', 'ed'))`;
    } else if (taskType === 15) {
      const nums = Array.from({length: 3}, () => Math.floor(Math.random() * 20) + 1);
      answer = nums[0] * nums[1] + nums[2];
      code = `a, b, c = ${nums[0]}, ${nums[1]}, ${nums[2]}\nprint(a * b + c)`;
    } else if (taskType === 16) {
      const texts = ['algorithm', 'function', 'variable', 'constant'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const n = Math.floor(Math.random() * text.length - 2) + 1;
      answer = text.slice(0, n);
      code = `s = "${text}"\nprint(s[:${n}])`;
    } else if (taskType === 17) {
      const a = Math.floor(Math.random() * 25) + 10;
      answer = (a % 2 === 0) ? 'even' : 'odd';
      code = `x = ${a}\nprint('even' if x % 2 == 0 else 'odd')`;
    } else if (taskType === 18) {
      const nums = Array.from({length: 4}, () => Math.floor(Math.random() * 10) + 1);
      answer = nums.filter(n => n > 5).length;
      code = `nums = [${nums.join(', ')}]\nprint(len([x for x in nums if x > 5]))`;
    } else if (taskType === 19) {
      const text = 'abcdefgh';
      const step = Math.floor(Math.random() * 2) + 2;
      answer = text.split('').filter((_, i) => i % step === 0).join('');
      code = `s = "${text}"\nprint(s[::${step}])`;
    } else if (taskType === 20) {
      const a = Math.floor(Math.random() * 15) + 10;
      const b = Math.floor(Math.random() * 5) + 2;
      answer = a * b + a;
      code = `x = ${a}\ny = ${b}\nprint(x * y + x)`;
    } else if (taskType === 21) {
      const texts = ['python', 'golang', 'kotlin', 'elixir'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = text.split('').filter((c, i) => i % 2 === 0).join('');
      code = `s = "${text}"\nprint(s[::2])`;
    } else if (taskType === 22) {
      const nums = Array.from({length: 5}, () => Math.floor(Math.random() * 10) + 1);
      answer = nums.map(n => n * 2).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nprint(sum([x * 2 for x in nums]))`;
    } else if (taskType === 23) {
      const a = Math.floor(Math.random() * 40) + 20;
      answer = String(a).length;
      code = `x = ${a}\nprint(len(str(x)))`;
    } else {
      const texts = ['function', 'variable', 'constant', 'operator'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const char = text[Math.floor(Math.random() * text.length)];
      answer = text.split('').filter(c => c === char).length;
      code = `s = "${text}"\nprint(s.count('${char}'))`;
    }
  } else {
    const taskType = Math.floor(Math.random() * 20);
    
    if (taskType === 0) {
      const nums = Array.from({length: 6}, () => Math.floor(Math.random() * 15) + 1);
      answer = nums.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nresult = sum([x for x in nums if x % 2 == 0])\nprint(result)`;
    } else if (taskType === 1) {
      const texts = ['Hello World', 'Python Programming', 'Data Analysis', 'Web Design'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = text.split(' ').map(w => w[0]).join('');
      code = `text = "${text}"\nwords = text.split()\nprint(''.join([w[0] for w in words]))`;
    } else if (taskType === 2) {
      const a = Math.floor(Math.random() * 40) + 20;
      const b = Math.floor(Math.random() * 5) + 3;
      answer = Math.floor(a / b);
      code = `x = ${a}\ny = ${b}\nprint(x // y)`;
    } else if (taskType === 3) {
      const nums = Array.from({length: 5}, () => Math.floor(Math.random() * 8) + 1);
      answer = nums.map(n => n * 3).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nresult = sum([x * 3 for x in nums])\nprint(result)`;
    } else if (taskType === 4) {
      const texts = ['abcdefgh', 'programming', 'developer', 'technology'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      answer = Math.floor(text.length / 2);
      code = `s = "${text}"\nprint(len(s) // 2)`;
    } else if (taskType === 5) {
      const num = Math.floor(Math.random() * 90) + 10;
      answer = String(num).split('').reverse().join('');
      code = `x = ${num}\nprint(str(x)[::-1])`;
    } else if (taskType === 6) {
      const nums = Array.from({length: 6}, () => Math.floor(Math.random() * 10) + 1);
      answer = nums.filter(n => n > 5).length;
      code = `nums = [${nums.join(', ')}]\nresult = len([x for x in nums if x > 5])\nprint(result)`;
    } else if (taskType === 7) {
      const nums = Array.from({length: 5}, () => Math.floor(Math.random() * 12) + 1);
      answer = nums.filter(n => n % 3 === 0).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nresult = sum([x for x in nums if x % 3 == 0])\nprint(result)`;
    } else if (taskType === 8) {
      const texts = ['algorithm', 'framework', 'database', 'interface'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const vowels = text.split('').filter(c => 'aeiou'.includes(c)).length;
      answer = vowels;
      code = `s = "${text}"\nvowels = len([c for c in s if c in 'aeiou'])\nprint(vowels)`;
    } else if (taskType === 9) {
      const nums = Array.from({length: 4}, () => Math.floor(Math.random() * 10) + 5);
      answer = nums.map(n => n * n).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nresult = sum([x ** 2 for x in nums])\nprint(result)`;
    } else if (taskType === 10) {
      const texts = ['developer', 'architect', 'manager', 'designer'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const consonants = text.split('').filter(c => !'aeiou'.includes(c)).length;
      answer = consonants;
      code = `s = "${text}"\nconsonants = len([c for c in s if c not in 'aeiou'])\nprint(consonants)`;
    } else if (taskType === 11) {
      const nums = Array.from({length: 5}, () => Math.floor(Math.random() * 15) + 1);
      answer = nums.filter(n => n % 2 !== 0).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nresult = sum([x for x in nums if x % 2 != 0])\nprint(result)`;
    } else if (taskType === 12) {
      const text = 'programming';
      const n = Math.floor(Math.random() * 4) + 3;
      answer = text.slice(-n);
      code = `s = "${text}"\nprint(s[-${n}:])`;
    } else if (taskType === 13) {
      const nums = Array.from({length: 6}, () => Math.floor(Math.random() * 20) + 1);
      const threshold = Math.floor(Math.random() * 5) + 8;
      answer = nums.filter(n => n < threshold).length;
      code = `nums = [${nums.join(', ')}]\nresult = len([x for x in nums if x < ${threshold}])\nprint(result)`;
    } else if (taskType === 14) {
      const a = Math.floor(Math.random() * 100) + 50;
      answer = String(a).split('').reduce((acc, d) => acc + Number(d), 0);
      code = `x = ${a}\nprint(sum([int(d) for d in str(x)]))`;
    } else if (taskType === 15) {
      const nums = Array.from({length: 4}, () => Math.floor(Math.random() * 8) + 2);
      answer = nums.reduce((a, b) => a * b, 1);
      code = `nums = [${nums.join(', ')}]\nresult = 1\nfor x in nums:\n    result *= x\nprint(result)`;
    } else if (taskType === 16) {
      const texts = ['functional', 'procedural', 'objective', 'declarative'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const mid = Math.floor(text.length / 2);
      answer = text.slice(mid);
      code = `s = "${text}"\nprint(s[len(s)//2:])`;
    } else if (taskType === 17) {
      const nums = Array.from({length: 5}, () => Math.floor(Math.random() * 12) + 1);
      answer = nums.map(n => n % 4).reduce((a, b) => a + b, 0);
      code = `nums = [${nums.join(', ')}]\nprint(sum([x % 4 for x in nums]))`;
    } else if (taskType === 18) {
      const a = Math.floor(Math.random() * 50) + 20;
      const b = Math.floor(Math.random() * 8) + 3;
      answer = a % b + b;
      code = `x = ${a}\ny = ${b}\nprint(x % y + y)`;
    } else {
      const texts = ['development', 'application', 'integration', 'optimization'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const step = Math.floor(Math.random() * 2) + 2;
      answer = text.split('').filter((_, i) => i % step === 1).join('');
      code = `s = "${text}"\nprint(s[1::${step}])`;
    }
  }

  return {
    question: `Что выведет эта программа?\n\n${code}`,
    answer,
    userAnswer: '',
    type: 'python'
  };
};