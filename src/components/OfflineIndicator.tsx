import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 flex items-center gap-3 rounded-xl bg-amber-600/95 text-white px-4 py-3 shadow-xl backdrop-blur-md border border-amber-400/40 animate-fade-in">
      <div className="p-2 bg-white/20 rounded-lg shrink-0">
        <WifiOff className="w-5 h-5" />
      </div>
      <div className="text-xs">
        <p className="font-bold flex items-center gap-1.5">
          <span>Offline Mode Active</span>
          <span className="inline-flex items-center gap-0.5 text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-medium">
            <ShieldCheck className="w-3 h-3" /> 100% Functional
          </span>
        </p>
        <p className="text-amber-100 mt-0.5">
          All image compression & PDF creation runs strictly on your device.
        </p>
      </div>
    </div>
  );
};
