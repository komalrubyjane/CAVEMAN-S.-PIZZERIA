import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, AlertCircle, Share2 } from 'lucide-react';

export function DeliveryPage() {
  const [phone, setPhone] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shared, setShared] = useState(false);

  const fetchLocation = () => {
    setIsLoading(true);
    setError('');
    setShared(false);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocationLink(link);
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        setError('Please enable location access');
        setIsLoading(false);
      }
    );
  };

  const handleShare = () => {
    if (!locationLink) return;
    
    const shareMessage = `Track your delivery here: ${locationLink}`;

    if (navigator.share) {
      navigator.share({
        title: 'Delivery Location',
        text: shareMessage,
      }).then(() => {
        handleSuccess();
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
          fallbackShare(shareMessage);
        }
      });
    } else {
      fallbackShare(shareMessage);
    }
  };

  const fallbackShare = (message: string) => {
    if (!phone) {
      setError('Please enter Customer Phone Number to share via WhatsApp');
      return;
    }
    setError('');
    const cleanPhone = phone.replace(/\D/g, '');
    const waLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
    handleSuccess();
  };

  const handleSuccess = () => {
    setShared(true);
    setTimeout(() => setShared(false), 3500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl border border-[#E85D3A]/20 mt-10">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#E85D3A]/10 text-[#E85D3A] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🚚
        </div>
        <h2 className="text-2xl font-black text-[#2D2016]">Delivery Portal</h2>
        <p className="text-[#8B7355] text-sm mt-1">Share your live location with the customer</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wide">Customer Phone Number <span className="text-xs lowercase text-[#8B7355]/60 block">(Optional for Web Share, Required for WhatsApp fallback)</span></label>
          <input 
            type="tel" 
            placeholder="e.g. 9876543210" 
            className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-4 text-[#2D2016] uppercase focus:outline-none focus:border-[#E85D3A] font-bold shadow-sm mb-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button 
          onClick={fetchLocation}
          disabled={isLoading}
          className="w-full bg-[#E85D3A] hover:bg-[#D04E2E] text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <MapPin className="w-5 h-5" />
          {isLoading ? 'Fetching Location...' : 'Get Location 📍'}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}
          
          {locationLink && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#FDF6EC] p-5 rounded-2xl border border-[#E85D3A]/20 shadow-inner">
              <h3 className="font-bold text-[#8B7355] mb-2 text-xs uppercase tracking-wider">Location Link Generated:</h3>
              <a href={locationLink} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-[#E85D3A]/10 rounded-xl text-[#E85D3A] font-bold text-sm tracking-tight break-all hover:bg-orange-50 transition-colors mb-4 shadow-sm">
                🗺️ {locationLink}
              </a>
              <button 
                onClick={handleShare}
                className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm border-2 ${shared ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-[#E85D3A] text-[#E85D3A] hover:bg-[#E85D3A] hover:text-white'}`}
              >
                {shared ? <span className="text-xl">🚚</span> : <Share2 className="w-5 h-5" />}
                {shared ? 'Location shared successfully 🚚' : 'Share My Location 📍'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
