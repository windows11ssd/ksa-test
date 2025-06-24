
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpeedGauge } from './SpeedGauge';
import { speedTestService, SpeedTestResult } from '@/services/speedTest';
import { Loader2, Play, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeedTestWidgetProps {
  onTestComplete?: (result: SpeedTestResult) => void;
}

export const SpeedTestWidget: React.FC<SpeedTestWidgetProps> = ({ onTestComplete }) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [fileSize, setFileSize] = useState('10240'); // 10MB default
  const [results, setResults] = useState<SpeedTestResult | null>(null);

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

  const startTest = async () => {
    setIsRunning(true);
    setResults(null);
    setCurrentStep(t('testing'));

    try {
      const result = await speedTestService.runFullTest(
        parseInt(fileSize),
        (step) => setCurrentStep(step)
      );
      
      setResults(result);
      onTestComplete?.(result);
    } catch (error) {
      console.error('Speed test failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const stopTest = () => {
    speedTestService.abort();
    setIsRunning(false);
    setCurrentStep('');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('subtitle')}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* File Size Selection */}
        <div className={`flex items-center justify-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
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
          <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm text-muted-foreground">{currentStep}</span>
          </div>
        )}

        {/* Results Gauges */}
        {(results || isRunning) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <SpeedGauge
              value={results?.downloadSpeed || 0}
              maxValue={100}
              unit={t('mbps')}
              label={t('download')}
              color="#10b981"
              size={180}
            />
            <SpeedGauge
              value={results?.uploadSpeed || 0}
              maxValue={100}
              unit={t('mbps')}
              label={t('upload')}
              color="#3b82f6"
              size={180}
            />
            <SpeedGauge
              value={results?.ping || 0}
              maxValue={200}
              unit={t('ms')}
              label={t('ping')}
              color="#f59e0b"
              size={180}
            />
          </div>
        )}

        {/* Server Info */}
        {results && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">{t('serverInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <span className="font-medium">{t('ipAddress')}: </span>
                <span>{results.ipAddress}</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <span className="font-medium">{t('location')}: </span>
                <span>{results.serverLocation}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
