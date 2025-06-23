
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

export const PWAInstall: React.FC = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('ksatest-install-dismissed', 'true');
  };

  // Don't show if already dismissed
  const isDismissed = localStorage.getItem('ksatest-install-dismissed');
  
  if (!showInstallPrompt || isDismissed) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                {t('installApp')}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                {t('installPrompt')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button onClick={handleInstall} size="sm">
              {t('installApp')}
            </Button>
            <Button onClick={dismissPrompt} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
