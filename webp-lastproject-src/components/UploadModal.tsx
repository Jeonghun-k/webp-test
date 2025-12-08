import React, { useState, useRef } from 'react';
import { X, ImagePlus, Upload, Loader2 } from 'lucide-react';
import { compressImage } from '../utils';
import { Trip } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (newTrip: Trip) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7).replace('-', '.')); // YYYY.MM format
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("최소 한 장 이상의 사진을 선택해주세요.");
      return;
    }

    setIsProcessing(true);

    try {
      // Compress images
      const compressedImages = await Promise.all(
        selectedFiles.map(file => compressImage(file))
      );

      const newTrip: Trip = {
        id: Date.now().toString(),
        title: title || `나만의 앨범`,
        location: location || 'Unknown Location',
        date: date,
        images: compressedImages,
        description: description || `${selectedFiles.length}장의 사진이 담긴 기록`
      };

      onUpload(newTrip);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      // Ensure error is treated as an Error object or fallback string
      const errorMessage = error instanceof Error ? error.message : "이미지 처리 중 알 수 없는 오류가 발생했습니다.";
      alert(`오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1c1c1e] w-full max-w-lg rounded-3xl p-8 border border-[#333] shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif text-white">새로운 추억 기록</h2>
          <button onClick={onClose} className="text-[#86868b] hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* File Input Area */}
          <div 
            className="border-2 border-dashed border-[#333] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#2c2c2e] hover:border-[#555] transition-all group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              multiple 
              className="hidden" 
            />
            {selectedFiles.length > 0 ? (
              <div className="text-center">
                 <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload size={24} />
                 </div>
                 <p className="text-white font-medium">{selectedFiles.length}장의 사진 선택됨</p>
                 <p className="text-xs text-[#86868b] mt-1">클릭하여 다시 선택</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-[#333] text-[#86868b] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#444] group-hover:text-white transition-colors">
                    <ImagePlus size={24} />
                </div>
                <p className="text-[#a1a1a6] font-medium">사진을 선택하세요</p>
                <p className="text-xs text-[#636366] mt-1">또는 여기로 드래그 앤 드롭</p>
              </div>
            )}
          </div>

          {/* Text Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#86868b] mb-2 font-semibold">앨범 제목</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="예: 파리 여행, 여름 휴가" 
                className="w-full bg-[#2c2c2e] border border-transparent focus:border-[#555] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-[#86868b] mb-2 font-semibold">장소</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="예: Paris, France" 
                        className="w-full bg-[#2c2c2e] border border-transparent focus:border-[#555] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest text-[#86868b] mb-2 font-semibold">날짜 (년.월)</label>
                    <input 
                        type="text" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        placeholder="2023.12" 
                        className="w-full bg-[#2c2c2e] border border-transparent focus:border-[#555] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none transition-colors"
                    />
                </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#86868b] mb-2 font-semibold">설명 (선택)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="이 앨범에 대한 간단한 설명을 적어주세요." 
                className="w-full bg-[#2c2c2e] border border-transparent focus:border-[#555] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none transition-colors resize-none h-24"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isProcessing || selectedFiles.length === 0}
            className={`w-full py-4 rounded-xl font-medium text-black transition-all flex items-center justify-center gap-2 ${
                isProcessing || selectedFiles.length === 0 
                ? 'bg-[#333] text-[#666] cursor-not-allowed' 
                : 'bg-white hover:bg-gray-200'
            }`}
          >
            {isProcessing ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>처리 중...</span>
                </>
            ) : (
                '앨범 생성하기'
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default UploadModal;