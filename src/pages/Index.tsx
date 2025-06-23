
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpeedTestWidget } from '@/components/SpeedTestWidget';
import { TestHistory } from '@/components/TestHistory';
import { SettingsPanel } from '@/components/SettingsPanel';
import { PWAInstall } from '@/components/PWAInstall';
import { SpeedTestResult } from '@/services/speedTest';

interface IndexProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Index: React.FC<IndexProps> = ({ theme, setTheme }) => {
  const { t } = useTranslation();
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleTestComplete = (result: SpeedTestResult) => {
    // Refresh history when test completes
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t('appTitle')}
          </h1>
          <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* PWA Install Prompt */}
        <PWAInstall />

        {/* Main Content */}
        <Tabs defaultValue="test" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="test">{t('startTest')}</TabsTrigger>
            <TabsTrigger value="history">{t('history')}</TabsTrigger>
            <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-6">
            <SpeedTestWidget onTestComplete={handleTestComplete} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TestHistory key={refreshHistory} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel theme={theme} setTheme={setTheme} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
          <p>{t('footer')}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
