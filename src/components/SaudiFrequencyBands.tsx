
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const saudiTelecomBands = [
  // STC
  { operator: 'STC', technology: '2G (GSM)', band: 'GSM 900', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'STC', technology: '2G (GSM)', band: 'GSM 1800', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'STC', technology: '3G (UMTS)', band: 'UMTS 2100', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'STC', technology: '3G (UMTS)', band: 'UMTS 900', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'STC', technology: '4G (LTE)', band: 'Band 1', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'STC', technology: '4G (LTE)', band: 'Band 3', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'STC', technology: '4G (LTE)', band: 'Band 7', frequency: '2500-2570 MHz / 2620-2690 MHz' },
  { operator: 'STC', technology: '4G (LTE)', band: 'Band 8', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'STC', technology: '4G (LTE)', band: 'Band 20', frequency: '832-862 MHz / 791-821 MHz' },
  { operator: 'STC', technology: '5G', band: 'n1', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'STC', technology: '5G', band: 'n3', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'STC', technology: '5G', band: 'n78', frequency: '3300-3800 MHz' },
  
  // Mobily
  { operator: 'Mobily', technology: '2G (GSM)', band: 'GSM 900', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'Mobily', technology: '2G (GSM)', band: 'GSM 1800', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'Mobily', technology: '3G (UMTS)', band: 'UMTS 2100', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'Mobily', technology: '3G (UMTS)', band: 'UMTS 900', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'Mobily', technology: '4G (LTE)', band: 'Band 1', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'Mobily', technology: '4G (LTE)', band: 'Band 3', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'Mobily', technology: '4G (LTE)', band: 'Band 7', frequency: '2500-2570 MHz / 2620-2690 MHz' },
  { operator: 'Mobily', technology: '4G (LTE)', band: 'Band 8', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'Mobily', technology: '4G (LTE)', band: 'Band 20', frequency: '832-862 MHz / 791-821 MHz' },
  { operator: 'Mobily', technology: '5G', band: 'n1', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'Mobily', technology: '5G', band: 'n3', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'Mobily', technology: '5G', band: 'n78', frequency: '3300-3800 MHz' },
  
  // Zain
  { operator: 'Zain', technology: '2G (GSM)', band: 'GSM 900', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'Zain', technology: '2G (GSM)', band: 'GSM 1800', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'Zain', technology: '3G (UMTS)', band: 'UMTS 2100', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'Zain', technology: '3G (UMTS)', band: 'UMTS 900', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'Zain', technology: '4G (LTE)', band: 'Band 1', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'Zain', technology: '4G (LTE)', band: 'Band 3', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'Zain', technology: '4G (LTE)', band: 'Band 7', frequency: '2500-2570 MHz / 2620-2690 MHz' },
  { operator: 'Zain', technology: '4G (LTE)', band: 'Band 8', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'Zain', technology: '4G (LTE)', band: 'Band 20', frequency: '832-862 MHz / 791-821 MHz' },
  { operator: 'Zain', technology: '5G', band: 'n1', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'Zain', technology: '5G', band: 'n3', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'Zain', technology: '5G', band: 'n78', frequency: '3300-3800 MHz' },
  
  // Virgin Mobile
  { operator: 'Virgin Mobile', technology: '4G (LTE)', band: 'Band 1', frequency: '1920-1980 MHz / 2110-2170 MHz' },
  { operator: 'Virgin Mobile', technology: '4G (LTE)', band: 'Band 3', frequency: '1710-1785 MHz / 1805-1880 MHz' },
  { operator: 'Virgin Mobile', technology: '4G (LTE)', band: 'Band 7', frequency: '2500-2570 MHz / 2620-2690 MHz' },
  { operator: 'Virgin Mobile', technology: '4G (LTE)', band: 'Band 8', frequency: '880-915 MHz / 925-960 MHz' },
  { operator: 'Virgin Mobile', technology: '5G', band: 'n78', frequency: '3300-3800 MHz' },
];

export const SaudiFrequencyBands: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {isRTL ? 'نطاقات وترددات شركات الاتصالات في المملكة العربية السعودية' : 'Saudi Arabia Telecom Operators Frequency Bands'}
        </CardTitle>
        <CardDescription>
          {isRTL ? 'جدول شامل لجميع النطاقات والترددات المستخدمة' : 'Comprehensive table of all bands and frequencies used'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={`min-w-[120px] ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'المشغل' : 'Operator'}
                </TableHead>
                <TableHead className={`min-w-[100px] ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'التقنية' : 'Technology'}
                </TableHead>
                <TableHead className={`min-w-[100px] ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'النطاق' : 'Band'}
                </TableHead>
                <TableHead className={`min-w-[200px] ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'التردد' : 'Frequency'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saudiTelecomBands.map((band, index) => (
                <TableRow key={index}>
                  <TableCell className={`font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{band.operator}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>{band.technology}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>{band.band}</TableCell>
                  <TableCell className={`font-mono text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{band.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
