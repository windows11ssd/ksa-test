
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const networkingTerms = {
  '5G_NSA': {
    en: '5G Non-Standalone (NSA) - A 5G network deployment mode that relies on existing 4G LTE infrastructure as an anchor, using both 4G and 5G radio access technologies simultaneously.',
    ar: '5G غير المستقل (NSA) - وضع نشر شبكة 5G يعتمد على البنية التحتية الحالية لـ 4G LTE كمرساة، باستخدام تقنيات الوصول الراديوي 4G و 5G معًا.'
  },
  'RSRP': {
    en: 'Reference Signal Received Power - Measures the power level of LTE reference signals, indicating signal strength and quality for cell selection and handover decisions.',
    ar: 'قوة الإشارة المرجعية المستقبلة - تقيس مستوى قوة إشارات LTE المرجعية، مما يشير إلى قوة الإشارة وجودتها لاختيار الخلية وقرارات التسليم.'
  },
  'PCI': {
    en: 'Physical Cell Identity - A unique identifier assigned to each cell in LTE networks, ranging from 0 to 503, used to distinguish between different cells.',
    ar: 'هوية الخلية الفيزيائية - معرف فريد مخصص لكل خلية في شبكات LTE، يتراوح من 0 إلى 503، يستخدم للتمييز بين الخلايا المختلفة.'
  },
  'SINR': {
    en: 'Signal-to-Interference-plus-Noise Ratio - Measures the quality of a wireless signal by comparing the signal power to the interference and noise power.',
    ar: 'نسبة الإشارة إلى التداخل والضوضاء - تقيس جودة الإشارة اللاسلكية من خلال مقارنة قوة الإشارة بقوة التداخل والضوضاء.'
  },
  'IMEI': {
    en: 'International Mobile Equipment Identity - A unique 15-digit number assigned to every mobile device to identify it on cellular networks.',
    ar: 'هوية المعدات المحمولة الدولية - رقم فريد مكون من 15 رقمًا يُخصص لكل جهاز محمول لتحديد هويته على الشبكات الخلوية.'
  },
  'RSRQ': {
    en: 'Reference Signal Received Quality - Indicates the quality of the received LTE signal, considering both signal strength and interference levels.',
    ar: 'جودة الإشارة المرجعية المستقبلة - تشير إلى جودة إشارة LTE المستقبلة، مع مراعاة قوة الإشارة ومستويات التداخل.'
  },
  '5G_CONNECTED_BAND': {
    en: '5G Connected Band - The specific frequency band that a 5G device is currently connected to, determining the speed and coverage characteristics.',
    ar: 'نطاق 5G المتصل - النطاق الترددي المحدد الذي يتصل به جهاز 5G حاليًا، مما يحدد خصائص السرعة والتغطية.'
  },
  '5G_SIGNAL_STRENGTH': {
    en: '5G Signal Strength - Measures the power level of 5G signals received by a device, typically measured in dBm (decibels per milliwatt).',
    ar: 'قوة إشارة 5G - تقيس مستوى قوة إشارات 5G التي يستقبلها الجهاز، وتُقاس عادة بوحدة dBm (ديسيبل لكل ميلي واط).'
  },
  '4G_SIGNAL_STRENGTH': {
    en: '4G Signal Strength - Measures the power level of 4G LTE signals, indicating how strong the connection is between the device and cell tower.',
    ar: 'قوة إشارة 4G - تقيس مستوى قوة إشارات 4G LTE، مما يشير إلى قوة الاتصال بين الجهاز وبرج الخلية.'
  },
  '5G_SA': {
    en: '5G Standalone (SA) - A 5G network deployment that operates independently without relying on 4G infrastructure, providing full 5G capabilities.',
    ar: '5G المستقل (SA) - نشر شبكة 5G يعمل بشكل مستقل دون الاعتماد على البنية التحتية لـ 4G، مما يوفر قدرات 5G الكاملة.'
  },
  '5G_SINR': {
    en: '5G SINR - Signal-to-Interference-plus-Noise Ratio specifically for 5G networks, measuring signal quality in the 5G frequency bands.',
    ar: '5G SINR - نسبة الإشارة إلى التداخل والضوضاء خاصة لشبكات 5G، تقيس جودة الإشارة في نطاقات تردد 5G.'
  },
  'ECIO': {
    en: 'Energy per Chip to Interference Ratio - A measure of signal quality in CDMA networks, indicating the ratio of energy per chip to the interference level.',
    ar: 'نسبة الطاقة لكل رقاقة إلى التداخل - مقياس لجودة الإشارة في شبكات CDMA، يشير إلى نسبة الطاقة لكل رقاقة إلى مستوى التداخل.'
  },
  'CELL_ID': {
    en: 'Cell Identity - A unique identifier assigned to each cell in a cellular network, used for network management and handover procedures.',
    ar: 'هوية الخلية - معرف فريد مخصص لكل خلية في الشبكة الخلوية، يستخدم لإدارة الشبكة وإجراءات التسليم.'
  },
  'LAC': {
    en: 'Location Area Code - A unique identifier for a location area in GSM networks, used for location tracking and paging procedures.',
    ar: 'رمز منطقة الموقع - معرف فريد لمنطقة موقع في شبكات GSM، يستخدم لتتبع الموقع وإجراءات النداء.'
  },
  'MCC': {
    en: 'Mobile Country Code - A three-digit code that identifies the country of a mobile network operator, part of the IMSI.',
    ar: 'رمز البلد المحمول - رمز مكون من ثلاثة أرقام يحدد بلد مشغل الشبكة المحمولة، جزء من IMSI.'
  },
  'MNC': {
    en: 'Mobile Network Code - A code that identifies the mobile network operator within a country, used together with MCC.',
    ar: 'رمز الشبكة المحمولة - رمز يحدد مشغل الشبكة المحمولة داخل البلد، يستخدم مع MCC.'
  },
  'GSM': {
    en: 'Global System for Mobile Communications - A standard for 2G cellular networks, providing voice and basic data services.',
    ar: 'النظام العالمي للاتصالات المحمولة - معيار لشبكات الخلوية 2G، يوفر خدمات الصوت والبيانات الأساسية.'
  },
  'LTE': {
    en: 'Long Term Evolution - A standard for 4G wireless broadband communication, providing high-speed data transmission.',
    ar: 'التطور طويل المدى - معيار لاتصالات النطاق العريض اللاسلكي 4G، يوفر نقل البيانات عالي السرعة.'
  },
  'HSDPA': {
    en: 'High-Speed Downlink Packet Access - An enhancement to 3G networks that increases download speeds significantly.',
    ar: 'الوصول عالي السرعة للحزم الهابطة - تحسين لشبكات 3G يزيد من سرعات التحميل بشكل كبير.'
  },
  'TAC': {
    en: 'Tracking Area Code - Used in LTE networks to identify a tracking area for location management and paging optimization.',
    ar: 'رمز منطقة التتبع - يستخدم في شبكات LTE لتحديد منطقة التتبع لإدارة الموقع وتحسين النداء.'
  },
  'H_PLUS': {
    en: 'H+ (HSPA+) - An evolution of 3G technology that provides faster data speeds than standard 3G, also known as 3.5G.',
    ar: 'H+ (HSPA+) - تطور لتقنية 3G توفر سرعات بيانات أسرع من 3G القياسي، تُعرف أيضًا باسم 3.5G.'
  },
  'ASU': {
    en: 'Arbitrary Strength Unit - A value used to represent signal strength in a standardized format across different network technologies.',
    ar: 'وحدة القوة التعسفية - قيمة تستخدم لتمثيل قوة الإشارة بتنسيق موحد عبر تقنيات الشبكة المختلفة.'
  },
  'IP': {
    en: 'Internet Protocol - The primary protocol used for communication across the internet, defining how data packets are addressed and routed.',
    ar: 'بروتوكول الإنترنت - البروتوكول الأساسي المستخدم للاتصال عبر الإنترنت، يحدد كيفية توجيه حزم البيانات وعنونتها.'
  },
  'IPV4': {
    en: 'Internet Protocol version 4 - The fourth version of IP, using 32-bit addresses and supporting about 4.3 billion unique addresses.',
    ar: 'بروتوكول الإنترنت الإصدار 4 - الإصدار الرابع من IP، يستخدم عناوين 32 بت ويدعم حوالي 4.3 مليار عنوان فريد.'
  },
  'IPV6': {
    en: 'Internet Protocol version 6 - The latest version of IP, using 128-bit addresses to provide virtually unlimited unique addresses.',
    ar: 'بروتوكول الإنترنت الإصدار 6 - أحدث إصدار من IP، يستخدم عناوين 128 بت لتوفير عناوين فريدة غير محدودة تقريبًا.'
  }
};

export const NetworkingTerms: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const isRTL = i18n.language === 'ar';

  const getTermExplanation = (termKey: string) => {
    const term = networkingTerms[termKey as keyof typeof networkingTerms];
    return term ? term[i18n.language as 'en' | 'ar'] : '';
  };

  const getTermDisplayName = (termKey: string) => {
    return termKey.replace(/_/g, ' ').replace(/PLUS/g, '+');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {isRTL ? 'مصطلحات مهمة لعشاق الشبكات' : 'Important Terms for Networking Enthusiasts'}
        </CardTitle>
        <CardDescription>
          {isRTL ? 'اختر مصطلحاً لرؤية شرحه التفصيلي' : 'Select a term to see its detailed explanation'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isRTL ? 'اختر مصطلحاً...' : 'Select a term...'} />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(networkingTerms).map((termKey) => (
              <SelectItem key={termKey} value={termKey}>
                {getTermDisplayName(termKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedTerm && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">{getTermDisplayName(selectedTerm)}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getTermExplanation(selectedTerm)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
