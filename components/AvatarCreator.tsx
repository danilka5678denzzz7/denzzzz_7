
import React, { useState, useEffect } from 'react';
import { AvatarConfig, GeneratedAvatar, UploadedImage } from '../types';
import { generateAvatar, modifyAvatar } from '../services/geminiService';
import ImageUploader from './ImageUploader';

// --- Expanded Constants & Options ---

const OPTIONS = {
  model: [{ value: 'gemini-2.5-flash-image', label: 'Nano Banana (Быстро)' }],
  plan: [
    { value: 'Extreme close-up of eyes/face', label: 'Макро (Глаза/Лицо)' },
    { value: 'Close-up of face', label: 'Крупный план лица' },
    { value: 'Chest-up portrait', label: 'От груди до лица' },
    { value: 'Waist-up portrait', label: 'От пояса до лица' },
    { value: 'Knee-up portrait', label: 'По колено (Американский план)' },
    { value: 'Full body shot', label: 'В полный рост' },
    { value: 'Wide angle environmental', label: 'Широкий угол (С окружением)' },
  ],
  aspectRatio: [
    { value: '1:1', label: 'Квадрат 1:1' },
    { value: '16:9', label: 'Горизонтальное 16:9' },
    { value: '9:16', label: 'Вертикальное 9:16' },
    { value: '4:3', label: '4:3' },
    { value: '3:4', label: '3:4' },
  ],
  gender: [
    { value: 'Male', label: 'Мужчина' },
    { value: 'Female', label: 'Женщина' },
    { value: 'Non-binary', label: 'Небинарный' },
  ],
  age: [
    { value: 'Child (5-10 years)', label: 'Ребенок (5-10)' },
    { value: 'Teenager (16-19 years)', label: 'Подросток (16-19)' },
    { value: 'Young Adult (20-29 years)', label: 'Молодой взрослый (20-29)' },
    { value: 'Adult (30-39 years)', label: 'Взрослый (30-39)' },
    { value: 'Middle-aged (40-55 years)', label: 'Средний возраст (40-55)' },
    { value: 'Elderly (60+ years)', label: 'Пожилой (60+)' },
    { value: 'Very Old (80+ years)', label: 'Глубокая старость (80+)' },
  ],
  bodyType: [
    { value: 'Average build', label: 'Среднее телосложение' },
    { value: 'Slim/Slender', label: 'Худое / Стройное' },
    { value: 'Athletic/Fit', label: 'Спортивное / Подтянутое' },
    { value: 'Muscular/Bodybuilder', label: 'Мускулистое / Бодибилдер' },
    { value: 'Curvy/Hourglass', label: 'Пышное / Песочные часы' },
    { value: 'Plus size/Heavy', label: 'Полное / Крупное' },
  ],
  ethnicity: [
    { value: 'Caucasian, Northern European, Scandinavian', label: 'Скандинавский (Сев. Европа)' },
    { value: 'Caucasian, Mediterranean, Southern European', label: 'Средиземноморский (Юж. Европа)' },
    { value: 'Slavic, Eastern European', label: 'Славянский (Вост. Европа)' },
    { value: 'East Asian (Chinese, Korean, Japanese)', label: 'Восточная Азия (Китай, Корея)' },
    { value: 'Southeast Asian (Vietnamese, Thai)', label: 'Юго-Вост. Азия (Вьетнам, Таиланд)' },
    { value: 'South Asian (Indian, Pakistani)', label: 'Южная Азия (Индия, Пакистан)' },
    { value: 'Middle Eastern (Arab, Persian)', label: 'Ближневосточный' },
    { value: 'African, Afro-American', label: 'Африканский / Афроамериканский' },
    { value: 'Latino/Hispanic', label: 'Латиноамериканский' },
    { value: 'Mixed ethnicity', label: 'Смешанная этничность' },
    { value: 'Native American/Indigenous', label: 'Коренной американец / Индигенный' },
  ],
  skinTone: [
    { value: 'Pale Porcelain skin', label: 'Очень светлая (Фарфоровая)' },
    { value: 'Fair European skin', label: 'Светлая (Европейская)' },
    { value: 'Sun-kissed Tan skin', label: 'Легкий загар' },
    { value: 'Deep Tan/Bronze skin', label: 'Сильный загар / Бронзовая' },
    { value: 'Olive skin', label: 'Оливковая' },
    { value: 'Light Brown skin', label: 'Светло-коричневая' },
    { value: 'Dark Brown skin', label: 'Темно-коричневая' },
    { value: 'Very Dark/Ebony skin', label: 'Эбеновая / Очень темная' },
  ],
  faceShape: [
    { value: 'Oval face shape', label: 'Овальное' },
    { value: 'Round face shape', label: 'Круглое' },
    { value: 'Square face shape with strong jaw', label: 'Квадратное (сильная челюсть)' },
    { value: 'Rectangular/Oblong face', label: 'Прямоугольное (вытянутое)' },
    { value: 'Triangle face shape', label: 'Треугольное' },
    { value: 'Diamond face shape', label: 'Ромбовидное' },
    { value: 'Heart-shaped face', label: 'Сердцевидное' },
    { value: 'High cheekbones, chiseled', label: 'Точеное с высокими скулами' },
    { value: 'Soft, chubby cheeks', label: 'Мягкое / Пухлые щеки' },
  ],
  eyeShape: [
    { value: 'Almond-shaped eyes', label: 'Миндалевидные' },
    { value: 'Round, large eyes', label: 'Круглые большие' },
    { value: 'Narrow, squinting eyes', label: 'Узкие / Прищуренные' },
    { value: 'Deep-set eyes', label: 'Глубоко посаженные' },
    { value: 'Hooded eyes', label: 'С нависшим веком' },
    { value: 'Downturned eyes', label: 'С опущенными уголками' },
    { value: 'Upturned (Cat) eyes', label: 'Кошачьи / Приподнятые' },
  ],
  eyeColor: [
    { value: 'Blue eyes', label: 'Голубой' },
    { value: 'Ice Blue eyes', label: 'Ледяной голубой' },
    { value: 'Grey eyes', label: 'Серый' },
    { value: 'Green eyes', label: 'Зелёный' },
    { value: 'Emerald Green eyes', label: 'Изумрудный' },
    { value: 'Amber eyes', label: 'Янтарный' },
    { value: 'Hazel eyes', label: 'Ореховый' },
    { value: 'Light Brown eyes', label: 'Светло-карий' },
    { value: 'Dark Brown eyes', label: 'Темно-карий' },
    { value: 'Black eyes', label: 'Черный' },
    { value: 'Heterochromia (different colors)', label: 'Гетерохромия (Разные)' },
  ],
  facialFeatures: [
    { value: 'Clear skin', label: 'Чистая кожа' },
    { value: 'Freckles', label: 'Веснушки' },
    { value: 'Beauty mark', label: 'Родинка' },
    { value: 'Acne/Imperfections', label: 'Акне / Несовершенства' },
    { value: 'Scar on face', label: 'Шрам на лице' },
    { value: 'Dimples', label: 'Ямочки на щеках' },
    { value: 'Wrinkles/Aged skin', label: 'Морщины' },
    { value: 'Rosy cheeks', label: 'Румянец' },
  ],
  noseShape: [
    { value: 'Straight nose', label: 'Прямой' },
    { value: 'Button nose', label: 'Курносый (кнопкой)' },
    { value: 'Roman/Aquiline nose', label: 'Римский (с горбинкой)' },
    { value: 'Wide/Nubian nose', label: 'Широкий' },
    { value: 'Hawk nose', label: 'Орлиный' },
    { value: 'Small pointed nose', label: 'Маленький заостренный' },
  ],
  lipShape: [
    { value: 'Average lips', label: 'Средние' },
    { value: 'Thin lips', label: 'Тонкие' },
    { value: 'Full/Plump lips', label: 'Полные / Пухлые' },
    { value: 'Cupid bow lips', label: 'Лук Купидона' },
    { value: 'Wide mouth', label: 'Широкий рот' },
  ],
  hairLength: [
    { value: 'Bald/Shaved head', label: 'Бритая голова / Лысый' },
    { value: 'Buzz cut', label: 'Очень короткая (ёжик)' },
    { value: 'Short hair', label: 'Короткая' },
    { value: 'Chin length bob', label: 'Боб / Каре' },
    { value: 'Shoulder length hair', label: 'До плеч' },
    { value: 'Mid-back length hair', label: 'До лопаток' },
    { value: 'Waist length hair', label: 'До талии' },
    { value: 'Very long hair', label: 'Очень длинные' },
    { value: 'Receding hairline', label: 'С залысинами' },
  ],
  hairColor: [
    { value: 'Light Brown hair', label: 'Светло-каштановый' },
    { value: 'Dark Brown hair', label: 'Каштановый' },
    { value: 'Black hair', label: 'Черный' },
    { value: 'Jet Black hair', label: 'Иссиня-черный' },
    { value: 'Ash Blonde hair', label: 'Пепельный блонд' },
    { value: 'Golden Blonde hair', label: 'Золотистый блонд' },
    { value: 'Platinum Blonde hair', label: 'Платиновый блонд' },
    { value: 'Red/Ginger hair', label: 'Рыжий' },
    { value: 'Auburn hair', label: 'Темно-рыжий' },
    { value: 'Grey/Silver hair', label: 'Седой / Серебристый' },
    { value: 'White hair', label: 'Белый' },
    { value: 'Dyed Pink hair', label: 'Розовый (Крашеный)' },
    { value: 'Dyed Blue hair', label: 'Синий (Крашеный)' },
    { value: 'Dyed Green hair', label: 'Зеленый (Крашеный)' },
    { value: 'Rainbow hair', label: 'Радужный' },
  ],
  hairTexture: [
    { value: 'Straight hair', label: 'Прямые' },
    { value: 'Wavy hair', label: 'Волнистые' },
    { value: 'Curly hair', label: 'Кудрявые' },
    { value: 'Coily/Afro hair', label: 'Афро-текстура / Спирали' },
    { value: 'Braids/Dreadlocks', label: 'Косички / Дреды' },
    { value: 'Messy/Tousled', label: 'Взъерошенные' },
  ],
  facialHair: [
    { value: 'Clean shaven', label: 'Чисто выбрит' },
    { value: 'Light stubble', label: 'Лёгкая щетина' },
    { value: 'Heavy stubble', label: 'Густая щетина' },
    { value: 'Short groomed beard', label: 'Короткая ухоженная борода' },
    { value: 'Full thick beard', label: 'Густая борода' },
    { value: 'Long wizard beard', label: 'Длинная борода' },
    { value: 'Mustache', label: 'Усы' },
    { value: 'Handlebar mustache', label: 'Закрученные усы' },
    { value: 'Goatee', label: 'Эспаньолка' },
  ],
  clothing: [
    { value: 'Casual T-shirt and jeans', label: 'Футболка и джинсы' },
    { value: 'Business suit', label: 'Деловой костюм' },
    { value: 'Elegant evening gown/dress', label: 'Вечернее платье' },
    { value: 'Hoodie and streetwear', label: 'Худи / Уличный стиль' },
    { value: 'Leather jacket and boots', label: 'Кожаная куртка' },
    { value: 'Sportswear/Gym outfit', label: 'Спортивная одежда' },
    { value: 'Summer beachwear', label: 'Пляжная одежда' },
    { value: 'Cyberpunk/Sci-fi armor', label: 'Киберпанк / Броня' },
    { value: 'Fantasy medieval armor', label: 'Фэнтези броня' },
    { value: 'Vintage 1950s style', label: 'Винтаж 50-х' },
    { value: 'Medical coat/Uniform', label: 'Униформа / Халат' },
  ],
  accessories: [
    { value: 'No accessories', label: 'Без аксессуаров' },
    { value: 'Prescription glasses', label: 'Очки для зрения' },
    { value: 'Sunglasses', label: 'Солнечные очки' },
    { value: 'Gold earrings', label: 'Золотые серьги' },
    { value: 'Pearl necklace', label: 'Жемчужное ожерелье' },
    { value: 'Baseball cap', label: 'Кепка' },
    { value: 'Beanie hat', label: 'Шапка бини' },
    { value: 'Wide brim hat', label: 'Шляпа с полями' },
    { value: 'Headphones', label: 'Наушники' },
    { value: 'Nose piercing', label: 'Пирсинг носа' },
    { value: 'Face tattoos', label: 'Тату на лице' },
    { value: 'Scarf', label: 'Шарф' },
  ],
  artStyle: [
    { value: 'Photorealistic 8k', label: 'Фотореализм (8k)' },
    { value: 'Cinematic movie scene', label: 'Кинематографичный' },
    { value: 'Anime style', label: 'Аниме' },
    { value: '3D Render (Pixar/Disney style)', label: '3D Рендер (Мультфильм)' },
    { value: 'Cyberpunk Neon', label: 'Киберпанк Неон' },
    { value: 'Oil Painting', label: 'Масло (Живопись)' },
    { value: 'Digital Art Illustration', label: 'Цифровой арт' },
    { value: 'Black and White Noir', label: 'ЧБ Нуар' },
    { value: 'Vintage Polaroid', label: 'Винтаж Полароид' },
    { value: 'Studio Photography', label: 'Студийное фото' },
  ],
  expression: [
    { value: 'Neutral calm expression', label: 'Нейтральное спокойное' },
    { value: 'Happy smiling', label: 'Счастливая улыбка' },
    { value: 'Serious intensity', label: 'Серьезное' },
    { value: 'Friendly warm', label: 'Дружелюбное' },
    { value: 'Mysterious smirking', label: 'Загадочная ухмылка' },
    { value: 'Sad melancholic', label: 'Грустное' },
    { value: 'Angry fierce', label: 'Злое' },
    { value: 'Surprised shocked', label: 'Удивленное' },
    { value: 'Tired exhausted', label: 'Уставшее' },
  ],
};

const MODIFICATIONS = {
  emotions: [
    { value: 'Neutral calm expression', label: 'Нейтральное' },
    { value: 'Slight smile', label: 'Лёгкая улыбка' },
    { value: 'Big wide smile', label: 'Широкая улыбка' },
    { value: 'Laughing', label: 'Смех' },
    { value: 'Surprised face', label: 'Удивление' },
    { value: 'Angry face', label: 'Злость' },
    { value: 'Furious shouting', label: 'Гнев/Крик' },
    { value: 'Crying sad face', label: 'Заплаканное лицо' },
    { value: 'Winking', label: 'Подмигивание' },
    { value: 'Disgusted', label: 'Отвращение' },
  ],
  poses: [
    { value: 'Turn head left', label: 'Голова влево' },
    { value: 'Turn head right', label: 'Голова вправо' },
    { value: 'Tilt head down', label: 'Наклон вниз' },
    { value: 'Tilt head up', label: 'Наклон вверх' },
    { value: 'Low angle view', label: 'Вид снизу' },
    { value: 'High angle view', label: 'Вид сверху' },
    { value: 'Turn body left', label: 'Туловище влево' },
    { value: 'Turn body right', label: 'Туловище вправо' },
    { value: 'Back view', label: 'Вид сзади' },
    { value: 'Profile view (side)', label: 'Профиль' },
  ]
};

const ROTATION_TYPES = [
    { value: 'Turn head left', label: 'Голова влево' },
    { value: 'Turn head right', label: 'Голова вправо' },
    { value: 'Turn body left', label: 'Туловище влево' },
    { value: 'Turn body right', label: 'Туловище вправо' },
];

const BACKGROUND_PRESETS = [
  "Modern minimalist studio with soft lighting",
  "Cyberpunk city street at night with neon lights",
  "Sunny tropical beach with palm trees",
  "Cozy wooden library with books",
  "Futuristic spaceship interior",
  "Autumn forest with falling leaves",
  "Busy New York city street",
  "Fantasy magical forest",
  "Grunge alleyway with graffiti",
  "Luxury penthouse apartment",
];

// --- Helper Components ---

const CollapsibleSection = ({ title, children, defaultOpen = false }: { title: string, children?: React.ReactNode, defaultOpen?: boolean }) => {
  return (
    <details className="group border-b border-slate-700" open={defaultOpen}>
      <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors list-none">
        <span className="font-semibold text-slate-200 text-sm uppercase tracking-wider">{title}</span>
        <span className="transition group-open:rotate-180">
          <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
        </span>
      </summary>
      <div className="p-4 space-y-4 bg-slate-900/30">
        {children}
      </div>
    </details>
  );
};

const getRandomItem = <T extends { value: string }>(arr: T[]): string => {
  return arr[Math.floor(Math.random() * arr.length)].value;
};

const AvatarCreatorTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Configuration State
  const [config, setConfig] = useState<AvatarConfig>({
    model: 'gemini-2.5-flash-image',
    plan: '',
    aspectRatio: '1:1',
    gender: '',
    age: '',
    ethnicity: '',
    skinTone: '',
    bodyType: '',
    faceShape: '',
    eyeShape: '',
    eyeColor: '',
    noseShape: '',
    lipShape: '',
    facialFeatures: '',
    hairLength: '',
    hairColor: '',
    hairTexture: '',
    facialHair: '',
    clothing: '',
    accessories: '',
    artStyle: '',
    expression: '',
    backgroundMode: 'random',
    backgroundPrompt: '',
  });

  const [backgroundFile, setBackgroundFile] = useState<UploadedImage | null>(null);

  // Generation State
  const [generatedImages, setGeneratedImages] = useState<GeneratedAvatar[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Rotation State
  const [customDegree, setCustomDegree] = useState<string>('90');
  const [customRotateDir, setCustomRotateDir] = useState<string>(ROTATION_TYPES[0].value);

  // Initialize with random values
  useEffect(() => {
    randomizeAll();
  }, []);

  const randomizeAll = () => {
    setConfig(prev => ({
      ...prev,
      plan: getRandomItem(OPTIONS.plan),
      gender: getRandomItem(OPTIONS.gender),
      age: getRandomItem(OPTIONS.age),
      ethnicity: getRandomItem(OPTIONS.ethnicity),
      skinTone: getRandomItem(OPTIONS.skinTone),
      bodyType: getRandomItem(OPTIONS.bodyType),
      faceShape: getRandomItem(OPTIONS.faceShape),
      eyeShape: getRandomItem(OPTIONS.eyeShape),
      eyeColor: getRandomItem(OPTIONS.eyeColor),
      noseShape: getRandomItem(OPTIONS.noseShape),
      lipShape: getRandomItem(OPTIONS.lipShape),
      facialFeatures: Math.random() > 0.7 ? getRandomItem(OPTIONS.facialFeatures) : 'Clear skin',
      hairLength: getRandomItem(OPTIONS.hairLength),
      hairColor: getRandomItem(OPTIONS.hairColor),
      hairTexture: getRandomItem(OPTIONS.hairTexture),
      facialHair: getRandomItem(OPTIONS.facialHair),
      clothing: getRandomItem(OPTIONS.clothing),
      accessories: Math.random() > 0.5 ? getRandomItem(OPTIONS.accessories) : 'No accessories',
      artStyle: 'Photorealistic 8k', // Keep realistic by default for avatar creator, or random
      expression: getRandomItem(OPTIONS.expression),
      backgroundMode: 'random',
      backgroundPrompt: ''
    }));
    setBackgroundFile(null);
  };

  const bindFeaturesToEthnicity = () => {
    if (config.ethnicity.includes('Asian')) {
      setConfig(prev => ({
        ...prev,
        hairColor: 'Black hair',
        eyeColor: 'Dark Brown eyes',
        hairTexture: 'Straight hair'
      }));
    } else if (config.ethnicity.includes('Scandinavian')) {
      setConfig(prev => ({
        ...prev,
        hairColor: 'Ash Blonde hair',
        eyeColor: 'Blue eyes',
        skinTone: 'Pale Porcelain skin'
      }));
    } else if (config.ethnicity.includes('African')) {
       setConfig(prev => ({
        ...prev,
        hairColor: 'Black hair',
        eyeColor: 'Dark Brown eyes',
        hairTexture: 'Coily/Afro hair',
        skinTone: 'Very Dark/Ebony skin'
      }));
    }
  };

  const handleChange = (key: keyof AvatarConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleBgFileSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setBackgroundFile({ file, previewUrl });
    setConfig(prev => ({ ...prev, backgroundMode: 'upload' }));
  };

  const buildPrompt = () => {
    let bgPromptPart = '';
    if (config.backgroundMode === 'random') {
        bgPromptPart = `Background: ${BACKGROUND_PRESETS[Math.floor(Math.random() * BACKGROUND_PRESETS.length)]}.`;
    } else if (config.backgroundMode === 'prompt') {
        bgPromptPart = `Background: ${config.backgroundPrompt || 'Simple studio background'}.`;
    } else if (config.backgroundMode === 'upload') {
        bgPromptPart = "Place the character naturally into the environment of the reference background image provided.";
    }

    return `${config.artStyle} portrait of a ${config.gender}, ${config.age}, ${config.ethnicity}. 
    Body: ${config.bodyType}.
    Appearance: ${config.skinTone}, ${config.faceShape}, ${config.eyeShape}, ${config.eyeColor}, ${config.noseShape}, ${config.lipShape}. 
    Features: ${config.facialFeatures}.
    Hair: ${config.hairLength}, ${config.hairColor}, ${config.hairTexture}.
    Facial Hair: ${config.facialHair}.
    Attire: ${config.clothing}.
    Accessories: ${config.accessories}.
    Expression: ${config.expression}.
    Composition: ${config.plan}.
    ${bgPromptPart}
    Lighting: Cinematic professional lighting, high detailed, sharp focus.`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    const prompt = buildPrompt();

    try {
      let base64: string;
      
      // Pass the background file only if mode is upload and file exists
      const bgFile = (config.backgroundMode === 'upload' && backgroundFile) ? 
        await new Promise<string>((resolve) => {
             const reader = new FileReader();
             reader.readAsDataURL(backgroundFile.file);
             reader.onload = () => resolve(reader.result as string ? (reader.result as string).split(',')[1] : '');
        }) : undefined;

      base64 = await generateAvatar(prompt, config.aspectRatio, bgFile);

      const newAvatar: GeneratedAvatar = {
        id: Date.now().toString(),
        url: base64,
        prompt: prompt,
        type: 'original',
        label: 'Base Generation'
      };
      setGeneratedImages(prev => [newAvatar, ...prev]);
      setSelectedImageId(newAvatar.id);
    } catch (err) {
      console.error(err);
      setError("Не удалось создать аватар. Попробуйте снова.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModify = async (type: string, value: string, label: string) => {
    const currentImage = generatedImages.find(img => img.id === selectedImageId);
    if (!currentImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      const modPrompt = `Change the person's ${type} to ${value}. Maintain the exact same identity, facial features, ethnicity, age, hair, clothing and background. Only modify the ${type}.`;
      
      const base64 = await modifyAvatar(currentImage.url, modPrompt, config.aspectRatio);
      
      const newAvatar: GeneratedAvatar = {
        id: Date.now().toString(),
        url: base64,
        prompt: modPrompt,
        type: 'modification',
        label: label
      };
      setGeneratedImages(prev => [newAvatar, ...prev]);
      setSelectedImageId(newAvatar.id);
    } catch (err) {
      setError("Не удалось изменить аватар.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomRotation = () => {
      if(!customDegree) return;
      const promptValue = `${customRotateDir} exactly by ${customDegree} degrees`;
      const label = `${customRotateDir === 'Turn head left' ? 'Голова влево' : 
                      customRotateDir === 'Turn head right' ? 'Голова вправо' : 
                      customRotateDir === 'Turn body left' ? 'Тело влево' : 'Тело вправо'} ${customDegree}°`;
      handleModify('pose/angle', promptValue, label);
  };

  const selectedImage = generatedImages.find(img => img.id === selectedImageId);

  const SelectGroup = ({ label, field, options }: { label: string, field: keyof AvatarConfig, options: { value: string, label: string }[] }) => (
    <div className="mb-3">
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <select 
        value={config[field]} 
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row animate-fade-in bg-[#0f172a] min-h-screen">
      {/* LEFT SIDEBAR: CONFIGURATION */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex-shrink-0 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-slate-700 z-10">
        <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-20">
            <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white text-sm font-medium transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                В меню
            </button>
            <div className="flex justify-between items-end mt-4">
                <h2 className="text-xl font-bold text-white">Конструктор</h2>
                <button onClick={randomizeAll} className="text-xs text-indigo-400 hover:text-indigo-300 underline">Сброс / Random</button>
            </div>
        </div>

        <div className="pb-24">
            {/* 1. Basic Settings */}
            <CollapsibleSection title="Основные настройки" defaultOpen={true}>
                <SelectGroup label="Модель" field="model" options={OPTIONS.model} />
                <SelectGroup label="Формат (Aspect Ratio)" field="aspectRatio" options={OPTIONS.aspectRatio} />
                <SelectGroup label="План (Кадрирование)" field="plan" options={OPTIONS.plan} />
                <SelectGroup label="Стиль изображения" field="artStyle" options={OPTIONS.artStyle} />
            </CollapsibleSection>

            {/* 2. Character Base */}
            <CollapsibleSection title="Персонаж (База)" defaultOpen={true}>
                <SelectGroup label="Пол" field="gender" options={OPTIONS.gender} />
                <SelectGroup label="Возраст" field="age" options={OPTIONS.age} />
                <SelectGroup label="Телосложение" field="bodyType" options={OPTIONS.bodyType} />
                <SelectGroup label="Этнос" field="ethnicity" options={OPTIONS.ethnicity} />
                <button 
                    onClick={bindFeaturesToEthnicity}
                    className="w-full py-2 px-3 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 text-xs rounded border border-indigo-800/50 transition-colors mb-2"
                >
                    Авто-подбор черт под этнос
                </button>
                <SelectGroup label="Тип кожи" field="skinTone" options={OPTIONS.skinTone} />
            </CollapsibleSection>

            {/* 3. Face Features */}
            <CollapsibleSection title="Черты лица">
                <SelectGroup label="Форма лица" field="faceShape" options={OPTIONS.faceShape} />
                <SelectGroup label="Форма глаз" field="eyeShape" options={OPTIONS.eyeShape} />
                <SelectGroup label="Цвет глаз" field="eyeColor" options={OPTIONS.eyeColor} />
                <SelectGroup label="Нос" field="noseShape" options={OPTIONS.noseShape} />
                <SelectGroup label="Губы" field="lipShape" options={OPTIONS.lipShape} />
                <SelectGroup label="Особенности" field="facialFeatures" options={OPTIONS.facialFeatures} />
            </CollapsibleSection>

            {/* 4. Hair */}
            <CollapsibleSection title="Волосы">
                <SelectGroup label="Длина волос" field="hairLength" options={OPTIONS.hairLength} />
                <SelectGroup label="Цвет волос" field="hairColor" options={OPTIONS.hairColor} />
                <SelectGroup label="Текстура" field="hairTexture" options={OPTIONS.hairTexture} />
                <SelectGroup label="Борода / Усы" field="facialHair" options={OPTIONS.facialHair} />
            </CollapsibleSection>

            {/* 5. Style & Attire */}
            <CollapsibleSection title="Одежда и Аксессуары">
                <SelectGroup label="Одежда" field="clothing" options={OPTIONS.clothing} />
                <SelectGroup label="Аксессуары" field="accessories" options={OPTIONS.accessories} />
            </CollapsibleSection>

             {/* 6. Expression & BG */}
             <CollapsibleSection title="Эмоции и Фон" defaultOpen={true}>
                <SelectGroup label="Выражение лица" field="expression" options={OPTIONS.expression} />
                
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <label className="block text-xs text-slate-400 mb-2">Режим фона</label>
                    <div className="flex rounded-lg bg-slate-800 p-1 mb-3">
                        {(['random', 'prompt', 'upload'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => {
                                    setConfig(prev => ({ ...prev, backgroundMode: mode }));
                                    if (mode !== 'upload') setBackgroundFile(null);
                                }}
                                className={`flex-1 py-1.5 text-xs rounded-md transition-all ${config.backgroundMode === mode ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                {mode === 'random' ? 'Случайно' : mode === 'prompt' ? 'Текст' : 'Фото'}
                            </button>
                        ))}
                    </div>

                    {config.backgroundMode === 'prompt' && (
                        <textarea
                            value={config.backgroundPrompt}
                            onChange={(e) => setConfig(prev => ({ ...prev, backgroundPrompt: e.target.value }))}
                            placeholder="Опишите фон (например: уютная библиотека, лес...)"
                            className="w-full h-20 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    )}

                    {config.backgroundMode === 'upload' && (
                        <div className="mt-2">
                             <ImageUploader 
                                id="bg-ref-upload"
                                label="Загрузить фон"
                                imagePreview={backgroundFile?.previewUrl || null}
                                onFileSelect={handleBgFileSelect}
                                onRemove={() => setBackgroundFile(null)}
                             />
                             <p className="text-[10px] text-slate-500 mt-1">ИИ поместит персонажа в это окружение.</p>
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-sm">
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-95"
            >
                {isGenerating ? 'Генерация...' : 'Сгенерировать'}
            </button>
        </div>
      </div>

      {/* MAIN CONTENT: RESULT & MODIFICATIONS */}
      <div className="flex-grow flex flex-col h-screen overflow-y-auto relative bg-[#0f172a]">
         
         <div className="p-4 lg:p-10 max-w-6xl mx-auto w-full pb-20">
            
            {/* Top Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-white">Результат</h1>
                {selectedImage && (
                    <span className="bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-700">
                        {selectedImage.label}
                    </span>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-900/20 border border-red-800/50 text-red-300 p-4 rounded-lg flex items-center text-sm">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            {/* Main Image Area */}
            <div className="w-full min-h-[400px] lg:min-h-[600px] bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden relative group mb-8 shadow-2xl shadow-black/50">
                {selectedImage ? (
                    <>
                        <img 
                            src={selectedImage.url} 
                            alt="Generated Avatar" 
                            className="max-h-[75vh] w-full object-contain"
                        />
                        <a 
                            href={selectedImage.url} 
                            download={`avatar-${selectedImage.id}.png`}
                            className="absolute top-4 right-4 bg-black/60 hover:bg-indigo-600 text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                            title="Скачать"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </a>
                    </>
                ) : (
                    <div className="text-center text-slate-500 p-10 max-w-md">
                        {isGenerating ? (
                            <div className="flex flex-col items-center animate-pulse">
                                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-lg font-medium text-slate-300">ИИ создает персонажа...</p>
                                <p className="text-sm mt-2">Это может занять несколько секунд</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                <h3 className="text-xl font-medium text-slate-300 mb-2">Конструктор Аватаров</h3>
                                <p>Настройте параметры слева, выберите стиль, одежду и фон, затем нажмите "Сгенерировать"</p>
                            </>
                        )}
                    </div>
                )}
                {/* Loading Overlay for Modifications */}
                {isGenerating && selectedImage && (
                     <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-10">
                         <div className="text-center">
                            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-white font-medium">Применяю изменения...</p>
                         </div>
                     </div>
                )}
            </div>

            {/* Modification Controls */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-500 ${selectedImage ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none grayscale'}`}>
                
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3 text-yellow-500">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                        Эмоции
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {MODIFICATIONS.emotions.map((emo) => (
                            <button
                                key={emo.value}
                                onClick={() => handleModify('expression', emo.value, emo.label)}
                                className="px-3 py-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all border border-slate-700 hover:border-indigo-500"
                            >
                                {emo.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                     <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3 text-blue-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </span>
                        Ракурсы и Повороты
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {MODIFICATIONS.poses.map((pose) => (
                            <button
                                key={pose.value}
                                onClick={() => handleModify('pose/angle', pose.value, pose.label)}
                                className="px-3 py-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all border border-slate-700 hover:border-blue-500"
                            >
                                {pose.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-700/50">
                        <label className="text-xs text-slate-400 block mb-2 font-medium">Точный поворот (градусы)</label>
                        <div className="flex gap-2 items-center">
                            <select 
                                value={customRotateDir}
                                onChange={(e) => setCustomRotateDir(e.target.value)}
                                className="bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded px-2 py-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
                            >
                                {ROTATION_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                            <input 
                                type="number" 
                                min="0" 
                                max="180"
                                value={customDegree}
                                onChange={(e) => setCustomDegree(e.target.value)}
                                className="w-16 bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded px-2 py-2 text-center focus:ring-blue-500 focus:border-blue-500"
                                placeholder="90"
                            />
                            <span className="text-slate-400 text-xs">°</span>
                            <button 
                                onClick={handleCustomRotation}
                                disabled={!customDegree}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded font-medium transition-colors disabled:opacity-50"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery */}
            {generatedImages.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        История генераций
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {generatedImages.map((img) => (
                            <div 
                                key={img.id}
                                onClick={() => setSelectedImageId(img.id)}
                                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${selectedImageId === img.id ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800 hover:border-slate-600'}`}
                            >
                                <img src={img.url} alt={img.label} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                                    <span className="text-[10px] text-white font-medium block truncate text-center">{img.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AvatarCreatorTool;
