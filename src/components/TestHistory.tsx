
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { speedTestService, SpeedTestResult } from '@/services/speedTest';
import { Trash2 } from 'lucide-react';

export const TestHistory: React.FC = () => {
  const { t } = useTranslation();
  const [history, setHistory] = React.useState<SpeedTestResult[]>([]);

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
      <Card>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('history')}</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearHistory}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((result, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg space-y-2 md:space-y-0"
            >
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm">
                  <span className="font-medium">{formatDate(result.timestamp)}</span>
                  <span className="text-muted-foreground">{formatTime(result.timestamp)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('fileSize')}: {(result.fileSize / 1024).toFixed(0)} MB
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 rtl:space-x-reverse">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm text-muted-foreground">{t('download')}:</span>
                  <span className="font-medium text-green-600">
                    {result.downloadSpeed.toFixed(1)} {t('mbps')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm text-muted-foreground">{t('upload')}:</span>
                  <span className="font-medium text-blue-600">
                    {result.uploadSpeed.toFixed(1)} {t('mbps')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
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
