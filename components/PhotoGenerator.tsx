import React, { useState } from 'react';
import { generateProfessionalImage, remixImage } from '../services/geminiService';

interface PhotoGeneratorProps {
  onBack: () => void;
}

const ASPECT_RATIOS = [
  { value: '1:1', label: '1/1 (Квадрат)' },
  { value: '16:9', label: '16/9 (Горизонтально)' },
  { value: '9:16', label: '9/16 (Вертикально)' },
  { value: '4:3', label: '4/3' },
  { value: '3:4', label: '3/4' },
];

const PhotoGenerator: React.FC<PhotoGeneratorProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isIconMode, setIsIconMode] = useState(false);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [remixPrompt, setRemixPrompt] = useState('');
  const [isRemixing, setIsRemixing] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    
    try {
      const result = await generateProfessionalImage(prompt, aspectRatio, isIconMode);
      setGeneratedImage(result);
    } catch (err: any) {
      setError("Ошибка генерации. " + (err.message || "Попробуйте другой запрос."));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemix = async () => {
    if (!generatedImage || !remixPrompt.trim()) return;

    setIsRemixing(true);
    setError(null);

    try {
      const result = await remixImage(generatedImage, remixPrompt, aspectRatio);
      setGeneratedImage(result); // Update main image with remix result
      setRemixPrompt(''); // Clear remix prompt
    } catch (err: any) {
      setError("Ошибка ремикса. " + (err.message || "Попробуйте снова."));
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in p-6">
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold text-white">Генерация фото</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-medium text-slate-300 mb-6">Параметры</h3>
            
            {/* Aspect Ratio */}
            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">Формат</label>
              <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map(ratio => (
                  <button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all ${
                      aspectRatio === ratio.value 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Mode Checkbox */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isIconMode} 
                    onChange={(e) => setIsIconMode(e.target.checked)}
                  />
                  <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${isIconMode ? 'bg-indigo-600' : 'bg-slate-700'}`}></div>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isIconMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  Иконка / PNG (Без фона)
                </span>
              </label>
              <p className="text-xs text-slate-500 mt-2 ml-1">
                Оптимизирует генерацию для создания изолированных объектов или иконок.
              </p>
            </div>

            {/* Prompt */}
            <div className="mb-2">
              <label className="block text-sm text-slate-400 mb-2">Промт (Описание)</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Опишите изображение, которое хотите создать..."
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all transform duration-200 flex items-center justify-center
              ${!isGenerating && prompt.trim()
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-[1.01] text-white cursor-pointer' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Создание...
              </>
            ) : (
              'Сгенерировать'
            )}
          </button>
        </div>

        {/* Right Column: Result & Remix */}
        <div className="lg:col-span-7 flex flex-col h-full">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex-grow min-h-[500px] flex flex-col">
              <h3 className="text-lg font-medium text-slate-300 mb-4">Результат</h3>

              <div className="flex-grow flex items-center justify-center bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 overflow-hidden relative min-h-[400px]">
                {generatedImage ? (
                  <>
                    <img 
                      src={generatedImage} 
                      alt="Generated result" 
                      className="w-full h-full object-contain"
                    />
                    <a 
                      href={generatedImage} 
                      download="generated-photo.png"
                      className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
                      title="Скачать"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </a>
                  </>
                ) : (
                   <div className="text-center p-8 max-w-sm">
                     {isGenerating ? (
                       <div className="flex flex-col items-center animate-pulse">
                         <div className="h-48 w-48 bg-slate-800 rounded-full mb-4"></div>
                         <p className="text-slate-400">ИИ рисует ваше изображение...</p>
                       </div>
                     ) : error ? (
                       <div className="text-red-400">
                         <svg className="w-12 h-12 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                         </svg>
                         <p>{error}</p>
                       </div>
                     ) : (
                       <div className="text-slate-500">
                         <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                         <p>Здесь появится сгенерированное изображение</p>
                       </div>
                     )}
                   </div>
                )}
                
                {/* Loading overlay for Remix */}
                {isRemixing && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-white font-medium">Применяю изменения (Remix)...</p>
                        </div>
                    </div>
                )}
              </div>

              {/* Remix Section */}
              {generatedImage && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                    <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        Ремикс (Remix)
                    </h4>
                    <div className="flex gap-3">
                        <input 
                            type="text"
                            value={remixPrompt}
                            onChange={(e) => setRemixPrompt(e.target.value)}
                            placeholder="Что изменить? (например: 'добавь шляпу', 'сделай черно-белым')"
                            className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:border-purple-500 outline-none text-sm"
                        />
                        <button
                            onClick={handleRemix}
                            disabled={isRemixing || !remixPrompt.trim()}
                            className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                            Remix
                        </button>
                    </div>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoGenerator;