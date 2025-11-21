import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import AvatarCreatorTool from './components/AvatarCreator'; 
import PhotoGenerator from './components/PhotoGenerator';
import ImageExpander from './components/ImageExpander';
import { UploadedImage, GenerationState } from './types';
import { generateCompositeImage } from './services/geminiService';

// --- Components ---

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-yellow-500 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const PhotoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-purple-500 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
)

const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12 text-teal-500 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
)

interface MenuCardProps {
  title: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ title, icon, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-8 rounded-xl border transition-all duration-300 group
      ${disabled 
        ? 'bg-slate-800/30 border-slate-800 opacity-50 cursor-not-allowed' 
        : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750 hover:shadow-lg hover:shadow-indigo-900/20 cursor-pointer'
      }`}
  >
    {icon || <ShieldCheckIcon />}
    <span className="text-slate-200 font-medium text-lg">{title}</span>
    {disabled && <span className="text-xs text-slate-500 mt-2">Скоро</span>}
  </button>
);

// --- Portrait Adapter Tool (Existing Logic) ---

const PortraitAdapterTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [personImg, setPersonImg] = useState<UploadedImage | null>(null);
  const [bgImg, setBgImg] = useState<UploadedImage | null>(null);
  const [genState, setGenState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultImage: null,
  });

  const handlePersonSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPersonImg({ file, previewUrl });
    setGenState(prev => ({ ...prev, resultImage: null, error: null }));
  };

  const handleBgSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setBgImg({ file, previewUrl });
    setGenState(prev => ({ ...prev, resultImage: null, error: null }));
  };

  const handleRemovePerson = () => {
    setPersonImg(null);
    setGenState(prev => ({ ...prev, resultImage: null }));
  };

  const handleRemoveBg = () => {
    setBgImg(null);
    setGenState(prev => ({ ...prev, resultImage: null }));
  };

  const handleGenerate = async () => {
    if (!personImg || !bgImg) return;

    setGenState({ isLoading: true, error: null, resultImage: null });

    try {
      const result = await generateCompositeImage(personImg.file, bgImg.file);
      setGenState({
        isLoading: false,
        error: null,
        resultImage: result,
      });
    } catch (error: any) {
      console.error(error);
      setGenState({
        isLoading: false,
        error: "Произошла ошибка при генерации. Пожалуйста, попробуйте снова.",
        resultImage: null,
      });
    }
  };

  const isReadyToGenerate = personImg !== null && bgImg !== null;

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
        <h2 className="text-2xl font-semibold text-white">Портретный адаптер</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-medium text-slate-300 mb-6">Настройки генерации</h3>
            
            <div className="space-y-6">
              <ImageUploader 
                id="person-upload"
                label="1. Фото человека (Донор)" 
                imagePreview={personImg?.previewUrl || null}
                onFileSelect={handlePersonSelect}
                onRemove={handleRemovePerson}
              />

              <div className="flex items-center justify-center text-slate-600">
                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>

              <ImageUploader 
                id="bg-upload"
                label="2. Фото фона (Цель)" 
                imagePreview={bgImg?.previewUrl || null}
                onFileSelect={handleBgSelect}
                onRemove={handleRemoveBg}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!isReadyToGenerate || genState.isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all transform duration-200 flex items-center justify-center
              ${isReadyToGenerate && !genState.isLoading
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 hover:scale-[1.01] text-white cursor-pointer' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
          >
            {genState.isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </>
            ) : (
              'Сгенерировать'
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 h-full min-h-[500px] flex flex-col">
              <h3 className="text-lg font-medium text-slate-300 mb-4">Результат</h3>

              <div className="flex-grow flex items-center justify-center bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 overflow-hidden relative">
                {genState.resultImage ? (
                  <img 
                    src={genState.resultImage} 
                    alt="Generated result" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-8">
                    {genState.isLoading ? (
                      <div className="flex flex-col items-center animate-pulse">
                          <div className="h-64 w-64 bg-slate-800 rounded-lg mb-4"></div>
                          <p className="text-slate-400">ИИ объединяет изображения...</p>
                      </div>
                    ) : genState.error ? (
                      <div className="text-red-400 max-w-md">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p>{genState.error}</p>
                      </div>
                    ) : (
                      <div className="text-slate-500">
                        <p>Здесь появится результат</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {genState.resultImage && (
                <div className="mt-4 flex justify-end">
                  <a 
                    href={genState.resultImage} 
                    download="denzzzz_7-result.png"
                    className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Скачать результат
                  </a>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App ---

type View = 'menu' | 'portrait-adapter' | 'gen-photo' | 'avatar' | 'expand-photo';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('menu');

  if (currentView === 'avatar') {
    return <AvatarCreatorTool onBack={() => setCurrentView('menu')} />;
  }
  if (currentView === 'gen-photo') {
    return <PhotoGenerator onBack={() => setCurrentView('menu')} />;
  }
  if (currentView === 'expand-photo') {
    return <ImageExpander onBack={() => setCurrentView('menu')} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      
      <main className="flex-grow flex flex-col items-center justify-center">
        
        {currentView === 'menu' && (
          <div className="max-w-5xl w-full text-center animate-fade-in p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Инструменты denzzzz_7
            </h1>
            <p className="text-slate-400 mb-12 text-lg">
              Выберите один из доступных инструментов для начала работы.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <MenuCard 
                title="Генерация фото" 
                icon={<PhotoIcon />}
                onClick={() => setCurrentView('gen-photo')} 
                disabled={false} 
              />
              <MenuCard 
                title="Портретный адаптер" 
                onClick={() => setCurrentView('portrait-adapter')} 
              />
              <MenuCard 
                title="Создание аватара" 
                icon={<UserIcon />}
                onClick={() => setCurrentView('avatar')} 
                disabled={false}
              />
               <MenuCard 
                title="Расширение фото" 
                icon={<ExpandIcon />}
                onClick={() => setCurrentView('expand-photo')} 
                disabled={false}
              />
            </div>
          </div>
        )}

        {currentView === 'portrait-adapter' && (
          <PortraitAdapterTool onBack={() => setCurrentView('menu')} />
        )}

      </main>

      {currentView === 'menu' && (
        <footer className="p-6 text-center text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} denzzzz_7 Project. All rights reserved.
        </footer>
      )}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;