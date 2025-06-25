
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { speedTestService, SpeedTestResult } from '@/services/speedTest';
import { Trash2 } from 'lucide-react';

export const TestHistory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = React.useState<SpeedTestResult[]>([]);

  const isRTL = i18n.language === 'ar';

  React.useEffect(() => {
    setHistory(speedTestService.getTestHistory());
  }, []);

  const clearHistory = () => {
    speedTestService.clearHistory();
    setHistory([]);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (history.length === 0) {
    return (
      <Card dir={isRTL ? 'rtl' : 'ltr'}>
        <CardHeader>
          <CardTitle>{t('history')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {t('noHistory')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card dir={isRTL ? 'rtl' : 'ltr'}>
      <CardHeader className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between`}>
        <CardTitle>{t('history')}</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearHistory}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((result, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg space-y-2 md:space-y-0 ${isRTL ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`flex flex-col space-y-1 ${isRTL ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-4 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-medium">{formatDate(result.timestamp)}</span>
                  <span className="text-muted-foreground">{formatTime(result.timestamp)}</span>
                </div>
                <div className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('fileSize')}: {(result.fileSize / 1024).toFixed(0)} MB
                </div>
              </div>
              
              <div className={`flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:gap-6 ${isRTL ? 'md:flex-row-reverse items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm text-muted-foreground">{t('download')}:</span>
                  <span className="font-medium text-green-600">
                    {result.downloadSpeed.toFixed(1)} {t('mbps')}
                  </span>
                </div>
                
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm text-muted-foreground">{t('upload')}:</span>
                  <span className="font-medium text-blue-600">
                    {result.uploadSpeed.toFixed(1)} {t('mbps')}
                  </span>
                </div>
                
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm text-muted-foreground">{t('ping')}:</span>
                  <span className="font-medium text-yellow-600">
                    {result.ping} {t('ms')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
