import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpeedGauge } from './SpeedGauge';
import { speedTestService, SpeedTestResult } from '@/services/speedTest';
import { Loader2, Play, Square, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeedTestWidgetProps {
  onTestComplete?: (result: SpeedTestResult) => void;
}

interface PartialResults {
  downloadSpeed?: number;
  uploadSpeed?: number;
  ping?: number;
  ipAddress?: string;
  serverLocation?: string;
  isp?: string;
}

export const SpeedTestWidget: React.FC<SpeedTestWidgetProps> = ({ onTestComplete }) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [fileSize, setFileSize] = useState('10240'); // 10MB default
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [partialResults, setPartialResults] = useState<PartialResults>({});

  const fileSizeOptions = [
    { value: '1024', label: '1 MB' },
    { value: '5120', label: '5 MB' },
    { value: '10240', label: '10 MB' },
    { value: '51200', label: '50 MB' },
    { value: '102400', label: '100 MB' },
    { value: '512000', label: '500 MB' },
    { value: '1024000', label: '1000 MB' },
  ];

  const isRTL = i18n.language === 'ar';

  const handleFileSizeChange = (value: string) => {
    setFileSize(value);
    
    // Show toast warning for files 100MB or larger
    const sizeInKB = parseInt(value);
    if (sizeInKB >= 102400) { // 100MB = 102400 KB
      toast({
        title: t('largeFileWarning'),
        description: "",
        duration: 4000,
      });
    }
  };

  const checkInternetConnection = async (): Promise<boolean> => {
    if (!navigator.onLine) {
      return false;
    }
    
    try {
      // Try to fetch a small resource to verify actual connectivity
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const startTest = async () => {
    // Check internet connectivity first
    const isConnected = await checkInternetConnection();
    
    if (!isConnected) {
      toast({
        title: t('noInternetConnection'),
        description: t('pleaseCheckConnection'),
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsRunning(true);
    setResults(null);
    setPartialResults({});
    setCurrentStep(t('testing'));

    try {
      const result = await speedTestService.runFullTest(
        parseInt(fileSize),
        (step) => setCurrentStep(step),
        (partial) => setPartialResults(partial)
      );
      
      setResults(result);
      onTestComplete?.(result);
    } catch (error) {
      console.error('Speed test failed:', error);
      toast({
        title: t('testFailed'),
        description: t('testFailedDescription'),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const stopTest = () => {
    speedTestService.abort();
    setIsRunning(false);
    setCurrentStep('');
    setPartialResults({});
  };

  // Get current values to display (either partial or final results)
  const currentResults = results || partialResults;

  return (
    <Card className="w-full max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('subtitle')}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* File Size Selection */}
        <div className={`flex items-center justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <label className="text-sm font-medium">{t('fileSize')}:</label>
          <Select value={fileSize} onValueChange={handleFileSizeChange} disabled={isRunning}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fileSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Internet Connection Warning */}
        {!navigator.onLine && (
          <div className={`flex items-center justify-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">{t('noInternetWarning')}</span>
          </div>
        )}

        {/* Start/Stop Button */}
        <div className="flex justify-center">
          {!isRunning ? (
            <Button onClick={startTest} size="lg" className="px-8">
              <Play className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('startTest')}
            </Button>
          ) : (
            <Button onClick={stopTest} variant="destructive" size="lg" className="px-8">
              <Square className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('testing')}
            </Button>
          )}
        </div>

        {/* Progress */}
        {isRunning && (
          <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm text-muted-foreground">{currentStep}</span>
          </div>
        )}

        {/* Results Gauges */}
        {(currentResults.downloadSpeed !== undefined || currentResults.uploadSpeed !== undefined || currentResults.ping !== undefined) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <SpeedGauge
              value={currentResults.downloadSpeed || 0}
              maxValue={100}
              unit={t('mbps')}
              label={t('download')}
              color="#10b981"
              size={180}
            />
            <SpeedGauge
              value={currentResults.uploadSpeed || 0}
              maxValue={100}
              unit={t('mbps')}
              label={t('upload')}
              color="#3b82f6"
              size={180}
            />
            <SpeedGauge
              value={currentResults.ping || 0}
              maxValue={200}
              unit={t('ms')}
              label={t('ping')}
              color="#f59e0b"
              size={180}
            />
          </div>
        )}

        {/* Server Info */}
        {currentResults.ipAddress && (
          <Card className="mt-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <CardHeader>
              <CardTitle className="text-lg">{t('serverInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <span className="font-medium">{t('ipAddress')}: </span>
                <span>{currentResults.ipAddress}</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <span className="font-medium">{t('location')}: </span>
                <span>{currentResults.serverLocation}</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <span className="font-medium">{t('isp')}: </span>
                <span>{currentResults.isp}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
