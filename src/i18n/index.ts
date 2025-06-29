
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App Title
      appTitle: "KsaTest",
      subtitle: "Internet Speed Test",
      
      // Speed Test
      startTest: "Start Test",
      testing: "Testing...",
      testCompleted: "Test Completed",
      download: "Download",
      upload: "Upload",
      ping: "Ping",
      
      // Results
      mbps: "Mbps",
      ms: "ms",
      
      // File Size Selection
      selectFileSize: "Select Test File Size",
      fileSize: "File Size",
      largeFileWarning: "Large file selected. This will make the test take longer to complete.",
      
      // Connection Errors
      noInternetConnection: "No Internet Connection",
      pleaseCheckConnection: "Please check your internet connection and try again.",
      noInternetWarning: "No internet connection detected",
      testFailed: "Test Failed",
      testFailedDescription: "The speed test could not be completed. Please try again.",
      
      // History
      history: "Test History",
      noHistory: "No test history available",
      date: "Date",
      time: "Time",
      
      // Settings
      settings: "Settings",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      
      // Server Info
      serverInfo: "Server Information",
      ipAddress: "IP Address",
      location: "Location",
      isp: "ISP",
      
      // Footer
      footer: "By Abo Yassir 2025 All Rights Reserved",
      
      // PWA
      installApp: "Install App",
      installPrompt: "Install KsaTest for better experience"
    }
  },
  ar: {
    translation: {
      // App Title
      appTitle: "KsaTest",
      subtitle: "اختبار سرعة الإنترنت",
      
      // Speed Test
      startTest: "بدء الاختبار",
      testing: "جاري الاختبار...",
      testCompleted: "تم إكمال الاختبار",
      download: "التحميل",
      upload: "الرفع",
      ping: "البنق",
      
      // Results
      mbps: "ميجابت/ث",
      ms: "مللي ثانية",
      
      // File Size Selection
      selectFileSize: "اختر حجم ملف الاختبار",
      fileSize: "حجم الملف",
      largeFileWarning: "تم اختيار ملف كبير. هذا سيجعل الاختبار يستغرق وقتاً أطول لإكماله.",
      
      // Connection Errors
      noInternetConnection: "لا يوجد اتصال بالإنترنت",
      pleaseCheckConnection: "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
      noInternetWarning: "لم يتم اكتشاف اتصال بالإنترنت",
      testFailed: "فشل الاختبار",
      testFailedDescription: "لم يتم إكمال اختبار السرعة. يرجى المحاولة مرة أخرى.",
      
      // History
      history: "سجل الاختبارات",
      noHistory: "لا يوجد سجل اختبارات متاح",
      date: "التاريخ",
      time: "الوقت",
      
      // Settings
      settings: "الإعدادات",
      language: "اللغة",
      theme: "المظهر",
      light: "فاتح",
      dark: "داكن",
      
      // Server Info
      serverInfo: "معلومات الخادم",
      ipAddress: "عنوان الآي بي",
      location: "الموقع",
      isp: "مزود الخدمة",
      
      // Footer
      footer: "بواسطة أبو ياسر ٢٠٢٥ جميع الحقوق محفوظة",
      
      // PWA
      installApp: "تثبيت التطبيق",
      installPrompt: "ثبت KsaTest للحصول على تجربة أفضل"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
