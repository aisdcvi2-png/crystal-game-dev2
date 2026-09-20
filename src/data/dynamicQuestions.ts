import { Question } from './questions';

// Procedural question generators for each subject
export function generateDynamicQuestions(seed: number): Question[] {
  const questions: Question[] = [];
  let id = 1;

  // Seeded random number generator
  const random = (min: number = 0, max: number = 1): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return min + (seed / 233280) * (max - min);
  };

  const randomInt = (min: number, max: number): number => {
    return Math.floor(random(min, max + 1));
  };

  // ===== МАТЕМАТИКА (20 вопросов) =====
  
  // Сложение (5 вопросов)
  for (let i = 0; i < 5; i++) {
    const a = randomInt(1, 20);
    const b = randomInt(1, 20);
    const correct = a + b;
    const options = [
      correct.toString(),
      (correct + randomInt(-3, 3)).toString(),
      (correct + randomInt(-5, 5)).toString(),
      (correct + randomInt(-2, 2)).toString()
    ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 4);
    
    while (options.length < 4) {
      options.push((correct + randomInt(-10, 10)).toString());
    }
    
    const correctIndex = options.indexOf(correct.toString());
    
    questions.push({
      id: id++,
      subject: 'Математика',
      question: `Сколько будет ${a} + ${b}?`,
      options,
      correct: correctIndex
    });
  }

  // Вычитание (5 вопросов)
  for (let i = 0; i < 5; i++) {
    const a = randomInt(10, 30);
    const b = randomInt(1, a);
    const correct = a - b;
    const options = [
      correct.toString(),
      (correct + randomInt(-3, 3)).toString(),
      (correct + randomInt(-5, 5)).toString(),
      (correct + randomInt(-2, 2)).toString()
    ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 4);
    
    while (options.length < 4) {
      options.push((correct + randomInt(-10, 10)).toString());
    }
    
    const correctIndex = options.indexOf(correct.toString());
    
    questions.push({
      id: id++,
      subject: 'Математика',
      question: `Сколько будет ${a} - ${b}?`,
      options,
      correct: correctIndex
    });
  }

  // Умножение (5 вопросов)
  for (let i = 0; i < 5; i++) {
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    const correct = a * b;
    const options = [
      correct.toString(),
      (correct + a).toString(),
      (correct + b).toString(),
      (correct - a).toString()
    ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 4);
    
    while (options.length < 4) {
      options.push((correct + randomInt(-5, 5)).toString());
    }
    
    const correctIndex = options.indexOf(correct.toString());
    
    questions.push({
      id: id++,
      subject: 'Математика',
      question: `Сколько будет ${a} × ${b}?`,
      options,
      correct: correctIndex
    });
  }

  // Сравнение чисел (5 вопросов)
  for (let i = 0; i < 5; i++) {
    const a = randomInt(10, 99);
    const b = randomInt(10, 99);
    const correct = a > b ? 0 : 1;
    const options = [a.toString(), b.toString(), 'Они равны', 'Нельзя сравнить'];
    
    questions.push({
      id: id++,
      subject: 'Математика',
      question: `Какое число больше: ${a} или ${b}?`,
      options,
      correct
    });
  }

  // ===== РУССКИЙ ЯЗЫК (20 вопросов) =====
  
  // Гласные/согласные (5 вопросов)
  const vowels = ['А', 'Е', 'Ё', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я'];
  const consonants = ['Б', 'В', 'Г', 'Д', 'Ж', 'З', 'К', 'Л', 'М', 'Н', 'П', 'Р', 'С', 'Т', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ'];
  
  for (let i = 0; i < 5; i++) {
    const isVowel = random() > 0.5;
    const letter = isVowel ? vowels[randomInt(0, vowels.length - 1)] : consonants[randomInt(0, consonants.length - 1)];
    const correct = isVowel ? 0 : 1;
    
    questions.push({
      id: id++,
      subject: 'Русский язык',
      question: `Буква "${letter}" — это?`,
      options: ['Гласная', 'Согласная', 'Звонкая', 'Твёрдая'],
      correct
    });
  }

  // Ударение (5 вопросов)
  const words = [
    { word: 'молоко', correct: 2 },
    { word: 'собака', correct: 1 },
    { word: 'картина', correct: 2 },
    { word: 'деревня', correct: 1 },
    { word: 'корова', correct: 2 }
  ];
  
  for (let i = 0; i < 5; i++) {
    const wordData = words[i];
    questions.push({
      id: id++,
      subject: 'Русский язык',
      question: `На какой слог падает ударение в слове "${wordData.word}"?`,
      options: ['1-й', '2-й', '3-й', '4-й'],
      correct: wordData.correct - 1
    });
  }

  // Синонимы/антонимы (5 вопросов)
  const synonymPairs = [
    { word: 'большой', correct: 'огромный', wrong: ['маленький', 'быстрый', 'тихий'] },
    { word: 'быстрый', correct: 'скорый', wrong: ['медленный', 'тяжёлый', 'мягкий'] },
    { word: 'красивый', correct: 'прекрасный', wrong: ['ужасный', 'грустный', 'злой'] },
    { word: 'умный', correct: 'разумный', wrong: ['глупый', 'слабый', 'низкий'] },
    { word: 'весёлый', correct: 'радостный', wrong: ['печальный', 'сердитый', 'усталый'] }
  ];
  
  for (let i = 0; i < 5; i++) {
    const pair = synonymPairs[i];
    const options = [pair.correct, ...pair.wrong];
    const correctIndex = 0;
    
    questions.push({
      id: id++,
      subject: 'Русский язык',
      question: `Какой синоним к слову "${pair.word}"?`,
      options,
      correct: correctIndex
    });
  }

  // Части речи (5 вопросов)
  const posWords = [
    { word: 'бежать', correct: 'Глагол' },
    { word: 'стол', correct: 'Существительное' },
    { word: 'красивый', correct: 'Прилагательное' },
    { word: 'быстро', correct: 'Наречие' },
    { word: 'один', correct: 'Числительное' }
  ];
  
  for (let i = 0; i < 5; i++) {
    const wordData = posWords[i];
    const options = ['Глагол', 'Существительное', 'Прилагательное', 'Наречие'];
    const correctIndex = options.indexOf(wordData.correct);
    
    questions.push({
      id: id++,
      subject: 'Русский язык',
      question: `Какая часть речи слово "${wordData.word}"?`,
      options,
      correct: correctIndex
    });
  }

  // ===== ОКРУЖАЮЩИЙ МИР (20 вопросов) =====
  
  // Животные (7 вопросов)
  const animals = [
    { animal: 'медведь', fact: 'впадает в спячку зимой', correct: 0 },
    { animal: 'заяц', fact: 'меняет цвет шерсти зимой', correct: 0 },
    { animal: 'птица', fact: 'покрыта перьями', correct: 0 },
    { animal: 'рыба', fact: 'дышит жабрами', correct: 0 },
    { animal: 'лягушка', fact: 'земноводное животное', correct: 0 },
    { animal: 'паук', fact: 'имеет 8 ног', correct: 0 },
    { animal: 'пчела', fact: 'производит мёд', correct: 0 }
  ];
  
  for (let i = 0; i < 7; i++) {
    const animalData = animals[i];
    questions.push({
      id: id++,
      subject: 'Окружающий мир',
      question: `Что известно про ${animalData.animal}?`,
      options: [animalData.fact, 'Живёт в воде', 'Не имеет ног', 'Является растением'],
      correct: animalData.correct
    });
  }

  // Растения (5 вопросов)
  const plants = [
    { plant: 'дуб', fact: 'лиственное дерево', correct: 0 },
    { plant: 'ель', fact: 'хвойное дерево', correct: 0 },
    { plant: 'ромашка', fact: 'цветок с белыми лепестками', correct: 0 },
    { plant: 'какactus', fact: 'растёт в пустыне', correct: 0 },
    { plant: 'водоросли', fact: 'растут в воде', correct: 0 }
  ];
  
  for (let i = 0; i < 5; i++) {
    const plantData = plants[i];
    questions.push({
      id: id++,
      subject: 'Окружающий мир',
      question: `Что известно про ${plantData.plant}?`,
      options: [plantData.fact, 'Это животное', 'Не нуждается в воде', 'Не имеет корней'],
      correct: plantData.correct
    });
  }

  // Природные явления (4 вопросов)
  const phenomena = [
    { phenomenon: 'дождь', correct: 'осадки из облаков' },
    { phenomenon: 'радуга', correct: 'оптическое явление после дождя' },
    { phenomenon: 'ветер', correct: 'движение воздуха' },
    { phenomenon: 'молния', correct: 'электрический разряд' }
  ];
  
  for (let i = 0; i < 4; i++) {
    const phenData = phenomena[i];
    const options = [phenData.correct, 'Движение земли', 'Звуковое явление', 'Магнитное поле'];
    const correctIndex = 0;
    
    questions.push({
      id: id++,
      subject: 'Окружающий мир',
      question: `Что такое ${phenData.phenomenon}?`,
      options,
      correct: correctIndex
    });
  }

  // Времена года (4 вопросов)
  const seasons = [
    { season: 'зима', fact: 'самое холодное время года', correct: 0 },
    { season: 'весна', fact: 'природа пробуждается', correct: 0 },
    { season: 'лето', fact: 'самое тёплое время года', correct: 0 },
    { season: 'осень', fact: 'листья желтеют и опадают', correct: 0 }
  ];
  
  for (let i = 0; i < 4; i++) {
    const seasonData = seasons[i];
    questions.push({
      id: id++,
      subject: 'Окружающий мир',
      question: `Что характерно для ${seasonData.season}?`,
      options: [seasonData.fact, 'Жарко и сухо', 'Все деревья цветут', 'Дни самые длинные'],
      correct: seasonData.correct
    });
  }

  // ===== ЛИТЕРАТУРНОЕ ЧТЕНИЕ (20 вопросов) =====
  
  // Сказки (10 вопросов)
  const tales = [
    { tale: 'Колобок', author: 'народная сказка', correct: 0 },
    { tale: 'Репка', author: 'народная сказка', correct: 0 },
    { tale: 'Курочка Ряба', author: 'народная сказка', correct: 0 },
    { tale: 'Теремок', author: 'народная сказка', correct: 0 },
    { tale: 'Маша и медведь', author: 'народная сказка', correct: 0 },
    { tale: 'Пушкин А.С.', author: 'написал "Сказку о рыбаке и рыбке"', correct: 0 },
    { tale: 'Чуковский К.', author: 'написал "Мойдодыр"', correct: 0 },
    { tale: 'Маршак С.', author: 'написал "Сказку о глупом мышонке"', correct: 0 },
    { tale: 'Носов Н.', author: 'написал про Незнайку', correct: 0 },
    { tale: 'Толстой Л.', author: 'написал "Золотой ключик"', correct: 0 }
  ];
  
  for (let i = 0; i < 10; i++) {
    const taleData = tales[i];
    const options = [taleData.author, 'Написал Пушкин', 'Написал Толстой', 'Написал Чехов'];
    const correctIndex = i < 5 ? 0 : 0;
    
    questions.push({
      id: id++,
      subject: 'Литературное чтение',
      question: `Кто написал "${taleData.tale}"?`,
      options,
      correct: correctIndex
    });
  }

  // Жанры (5 вопросов)
  const genres = [
    { genre: 'сказка', definition: 'вымышленный рассказ с волшебством', correct: 0 },
    { genre: 'басня', definition: 'коркий рассказ с моралью', correct: 0 },
    { genre: 'стихотворение', definition: 'произведение в стихах', correct: 0 },
    { genre: 'рассказ', definition: 'короткое произведение о событии', correct: 0 },
    { genre: 'загадка', definition: 'вопрос требующий ответа', correct: 0 }
  ];
  
  for (let i = 0; i < 5; i++) {
    const genreData = genres[i];
    const options = [genreData.definition, 'Научная статья', 'Исторический документ', 'Биография'];
    const correctIndex = 0;
    
    questions.push({
      id: id++,
      subject: 'Литературное чтение',
      question: `Что такое ${genreData.genre}?`,
      options,
      correct: correctIndex
    });
  }

  // Литературные термины (5 вопросов)
  const terms = [
    { term: 'рифма', definition: 'созвучие в конце строк', correct: 0 },
    { term: 'герой', definition: 'главный персонаж произведения', correct: 0 },
    { term: 'завязка', definition: 'начало развития действия', correct: 0 },
    { term: 'развязка', definition: 'завершение произведения', correct: 0 },
    { term: 'автор', definition: 'создатель произведения', correct: 0 }
  ];
  
  for (let i = 0; i < 5; i++) {
    const termData = terms[i];
    const options = [termData.definition, 'Название книги', 'Место действия', 'Время события'];
    const correctIndex = 0;
    
    questions.push({
      id: id++,
      subject: 'Литературное чтение',
      question: `Что означает слово "${termData.term}"?`,
      options,
      correct: correctIndex
    });
  }

  // ===== АНГЛИЙСКИЙ ЯЗЫК (20 вопросов) =====
  
  // Животные (5 вопросов)
  const engAnimals = [
    { eng: 'cat', rus: 'кошка', correct: 0 },
    { eng: 'dog', rus: 'собака', correct: 0 },
    { eng: 'bird', rus: 'птица', correct: 0 },
    { eng: 'fish', rus: 'рыба', correct: 0 },
    { eng: 'horse', rus: 'лошадь', correct: 0 }
  ];
  
  for (let i = 0; i < 5; i++) {
    const animalData = engAnimals[i];
    const options = [animalData.rus, 'кошка', 'собака', 'птица'];
    const correctIndex = 0;
    
    questions.push({
      id: id++,
      subject: 'Английский язык',
      question: `Что означает "${animalData.eng}"?`,
      options,
      correct: correctIndex
    });
  }

  // Цвета (5 вопросов)
  const colors = [
    { eng: 'red', rus: 'красный', correct: 0 },
    { eng: 'blue', rus: 'синий', correct: 0 },
    { eng: 'green', rus: 'зелёный', correct: 0 },
    { eng: 'yellow', rus: 'жёлтый', correct: 0 },
    { eng: 'black', rus: 'чёрный', correct: 0 }
  ];
  
  for (let i = 0; i < 5; i++) {
    const colorData = colors[i];
    const options = [colorData.rus, 'красный', 'синий', 'зелёный'];
    const correctIndex = 0;
    
    questions.push({
      id: id++,
      subject: 'Английский язык',
      question: `Что означает "${colorData.eng}"?`,
      options,
      correct: correctIndex
    });
  }

  // Числа (5 вопросов)
  const numbers = [
    { eng: 'one', rus: 'один', correct: 0 },
    { eng: 'two', rus: 'два', correct: 0 },
    { eng: 'three', rus: 'три', correct: 0 },
    { eng: 'four', rus: 'четыре', correct: 0 },
    { eng: 'five', rus: 'пять', correct: 0 }
  ];
  
  for (let i = 0; i < 5; i++) {
    const numData = numbers[i];
    const options = [numData.rus, 'один', 'два', 'три'];
    const correctIndex = 0;
    
    questions.push({
      id: id++,
      subject: 'Английский язык',
      question: `Что означает "${numData.eng}"?`,
      options,
      correct: correctIndex
    });
  }

  // Приветствия (5 вопросов)
  const greetings = [
    { eng: 'hello', rus: 'привет', correct: 0 },
    { eng: 'goodbye', rus: 'пока', correct: 0 },
    { eng: 'thank you', rus: 'спасибо', correct: 0 },
    { eng: 'please', rus: 'пожалуйста', correct: 0 },
    { eng: 'sorry', rus: 'извини', correct: 0 }
  ];
  
  for (let i = 0; i < 5; i++) {
    const greetData = greetings[i];
    const options = [greetData.rus, 'привет', 'пока', 'спасибо'];
    const correctIndex = 0;
    
    questions.push({
      id: id++,
      subject: 'Английский язык',
      question: `Что означает "${greetData.eng}"?`,
      options,
      correct: correctIndex
    });
  }

  return questions;
}
