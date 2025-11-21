import React from 'react';

interface ImageUploaderProps {
  label: string;
  imagePreview: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  label, 
  imagePreview, 
  onFileSelect, 
  onRemove,
  id 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <span className="text-sm font-medium text-slate-300 ml-1">{label}</span>
      
      {imagePreview ? (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-600 group">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onRemove}
              className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      ) : (
        <label 
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-slate-600 rounded-xl cursor-pointer bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-500 transition-all group"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-indigo-400">
            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm"><span className="font-semibold">Нажмите</span> для загрузки</p>
            <p className="text-xs text-slate-500">PNG, JPG (до 5MB)</p>
          </div>
          <input 
            id={id} 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
