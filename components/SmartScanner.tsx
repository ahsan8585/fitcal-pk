
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, X, Check, Scan, Flame, RefreshCw } from 'lucide-react';
import Button from './Button';
import { analyzeFoodImage } from '../utils';
import { ScannedFood, Language } from '../types';

interface SmartScannerProps {
  onClose: () => void;
  onSave: (food: ScannedFood) => void;
  language: Language;
}

const SmartScanner: React.FC<SmartScannerProps> = ({ onClose, onSave, language }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'result'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<ScannedFood | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        startScanning(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScanning = async (imageUri: string) => {
    setStep('scanning');
    try {
      const result = await analyzeFoodImage(imageUri);
      setScannedData(result);
      setStep('result');
    } catch (error) {
      alert("Scanning failed. Please try again.");
      setStep('upload');
    }
  };

  const handleSave = () => {
    if (scannedData) {
      onSave(scannedData);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-6"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(188,19,254,0.4)]">
                <Scan size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Smart Meal Scanner</h2>
              <p className="text-gray-400 mb-8">Take a photo of your Pakistani food to instantly calculate calories.</p>
              
              <div className="flex flex-col gap-4 w-full">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center gap-3 text-white font-bold hover:bg-white/20 transition-all"
                >
                  <Camera size={24} /> Take Photo
                </button>
                <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full py-4 bg-transparent border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-gray-400 font-bold hover:text-white hover:border-white/30 transition-all"
                >
                  <ImageIcon size={24} /> Upload from Gallery
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: SCANNING */}
          {step === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-neon-blue/50 shadow-[0_0_50px_rgba(0,243,255,0.2)]"
            >
              {imagePreview && (
                <img src={imagePreview} alt="Scanning" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Scanning Laser Animation */}
              <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-neon-green shadow-[0_0_20px_#0aff00]"
              ></motion.div>
              
              <div className="absolute bottom-6 left-0 right-0 text-center">
                 <p className="text-neon-green font-bold text-lg animate-pulse">Analyzing Food...</p>
                 <p className="text-white/60 text-xs">Identifying Calories & Macros</p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: RESULT */}
          {step === 'result' && scannedData && (
            <motion.div
               key="result"
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="bg-card backdrop-blur-xl border border-card-border rounded-3xl p-6 shadow-2xl"
            >
               <div className="flex items-start gap-4 mb-6">
                 <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0">
                    <img src={scannedData.imagePreview} alt="Food" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{scannedData.name}</h3>
                    <p className="text-muted text-xs">{scannedData.serving}</p>
                    <div className="flex items-center gap-1 mt-2 text-neon-green font-bold text-lg">
                       <Flame size={18} className="fill-current" /> {scannedData.calories} kcal
                    </div>
                 </div>
               </div>

               {/* Editable Macros */}
               <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-input rounded-xl p-3 text-center border border-card-border">
                     <span className="block text-neon-purple font-bold">{scannedData.protein}g</span>
                     <span className="text-[10px] text-muted uppercase">Protein</span>
                  </div>
                  <div className="bg-input rounded-xl p-3 text-center border border-card-border">
                     <span className="block text-neon-blue font-bold">{scannedData.carbs}g</span>
                     <span className="text-[10px] text-muted uppercase">Carbs</span>
                  </div>
                  <div className="bg-input rounded-xl p-3 text-center border border-card-border">
                     <span className="block text-neon-green font-bold">{scannedData.fats}g</span>
                     <span className="text-[10px] text-muted uppercase">Fats</span>
                  </div>
               </div>

               <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-xl p-3 mb-6 flex items-center gap-3">
                  <div className="bg-neon-blue rounded-full p-1"><Check size={12} className="text-black" /></div>
                  <p className="text-sm text-neon-blue font-medium">
                    {language === 'en' ? "Photo scanned successfully! Add calories?" : "Photo scan ho gaya! Calories add karen?"}
                  </p>
               </div>

               <div className="flex gap-3">
                  <button 
                    onClick={() => setStep('upload')}
                    className="p-4 rounded-xl bg-input hover:bg-white/10 text-muted transition-colors"
                  >
                    <RefreshCw size={20} />
                  </button>
                  <Button onClick={handleSave} fullWidth>
                    Add to Daily Log
                  </Button>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SmartScanner;
