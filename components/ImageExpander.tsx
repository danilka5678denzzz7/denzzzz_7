import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { UploadedImage } from '../types';
import { expandImage } from '../services/geminiService';

interface ImageExpanderProps {
  onBack: () => void;
}

const ASPECT_RATIOS = [
  { value: '1:1', label: '1/1 (Квадрат)' },
  { value: '16:9', label: '16/9 (Горизонтально)' },
  { value: '9:16', label: '9/16 (Вертикально)' },
  { value: '4:3', label: '4/3' },
  { value: '3:4', label: '3/4' },
];

const ImageExpander: React.FC<ImageExpanderProps> = ({ onBack }) => {
  const [uploadedImg, setUploadedImg] = useState<UploadedImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setUploadedImg({ file, previewUrl });
    setResultImage(null);
    setError(null);
  };

  const handleRemoveImage = () => {
    setUploadedImg(null);
    setResultImage(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImg) return;
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    
    try {
      const result = await expandImage(uploadedImg.file, aspectRatio, prompt);
      setResultImage(result);
    } catch (err: any) {
      setError("Ошибка расширения фото. " + (err.message || "Попробуйте снова."));
    } finally {
      setIsLoading(false);
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
        <h2 className="text-2xl font-semibold text-white">Расширение фото</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-medium text-slate-300 mb-6">Настройки расширения</h3>
            
            <div className="mb-6">
              <ImageUploader 
                id="expand-upload"
                label="Исходное фото" 
                imagePreview={uploadedImg?.previewUrl || null}
                onFileSelect={handleImageSelect}
                onRemove={handleRemoveImage}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">Новый формат (Размер)</label>
              <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map(ratio => (
                  <button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all ${
                      aspectRatio === ratio.value 
                        ? 'bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-900/30' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm text-slate-400 mb-2">Дополнительный контекст (Необязательно)</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Например: густой лес, современный офис, пляж на закате..."
                className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
              />
              <p className="text-xs text-slate-500 mt-2">
                Опишите окружение, чтобы ИИ лучше дорисовал недостающие части.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !uploadedImg}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all transform duration-200 flex items-center justify-center
              ${!isLoading && uploadedImg
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 hover:scale-[1.01] text-white cursor-pointer' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Расширение...
              </>
            ) : (
              'Расширить фото'
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 h-full min-h-[500px] flex flex-col">
            <h3 className="text-lg font-medium text-slate-300 mb-4">Результат</h3>

            <div className="flex-grow flex items-center justify-center bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 overflow-hidden relative min-h-[400px]">
              {resultImage ? (
                <>
                  <img 
                    src={resultImage} 
                    alt="Expanded result" 
                    className="w-full h-full object-contain"
                  />
                  <a 
                    href={resultImage} 
                    download="expanded-photo.png"
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
                    title="Скачать"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                </>
              ) : (
                 <div className="text-center p-8 max-w-sm">
                   {isLoading ? (
                     <div className="flex flex-col items-center animate-pulse">
                       <div className="w-full h-40 bg-slate-800 rounded-lg mb-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                       </div>
                       <p className="text-slate-400">Дорисовываем пространство...</p>
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
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                       </svg>
                       <p>Загрузите фото и выберите новый формат для расширения</p>
                     </div>
                   )}
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageExpander;