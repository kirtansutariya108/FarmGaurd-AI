import { en } from './en';

export const hi: typeof en = {
  brand: {
    name: 'FarmGuard AI',
    tagline: 'फसल की तस्वीर से सटीक कृषि निर्णय तक।',
    badge: 'एआई-संचालित कृषि निर्णय सहायता',
    disclaimer: 'FarmGuard AI निर्णय-सहायता अंतर्दृष्टि प्रदान करता है और यह पेशेवर कृषि सलाह का विकल्प नहीं है।'
  },
  nav: {
    home: 'होम',
    features: 'विशेषताएं',
    howItWorks: 'यह कैसे काम करता है',
    about: 'हमारे बारे में',
    contact: 'संपर्क',
    login: 'लॉग इन',
    signUp: 'शुरू करें',
    dashboard: 'डैशबोर्ड',
    myFarms: 'मेरे खेत',
    cropScanner: 'फसल स्कैनर',
    cropHealth: 'फसल स्वास्थ्य',
    irrigation: 'सिंचाई सलाहकार',
    weather: 'मौसम',
    recommendations: 'सुझाव',
    history: 'स्कैन इतिहास',
    notifications: 'सूचनाएं',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    help: 'सहायता एवं समर्थन',
    logout: 'लॉग आउट'
  },
  dashboard: {
    greeting: 'शुभ प्रभात',
    cropHealth: 'फसल स्वास्थ्य',
    diseaseRisk: 'रोग जोखिम',
    soilMoisture: 'मिट्टी की नमी',
    nextIrrigation: 'अगली सिंचाई',
    weatherCard: 'स्थानीय मौसम',
    aiInsightTitle: 'एआई फार्म अंतर्दृष्टि',
    quickActions: 'त्वरित कार्रवाई',
    recentActivity: 'हाल की गतिविधि',
    scanCrop: 'पत्ता स्कैन करें',
    checkIrrigation: 'सिंचाई जांचें',
    viewWeather: 'मौसम देखें'
  },
  scanner: {
    title: 'एआई फसल रोग स्कैनर',
    subtitle: 'फसल के स्वास्थ्य की जांच के लिए पत्ते की स्पष्ट तस्वीर अपलोड करें।',
    dropzoneTitle: 'पत्ते की तस्वीर यहाँ खींचें',
    dropzoneSubtitle: 'या अपने उपकरण से चुनें (JPG, PNG, WEBP)',
    takePhoto: 'कैमरे से फोटो लें',
    sampleButton: 'टमाटर के पत्ते का नमूना आज़माएं',
    analyzingTitle: 'आपकी फसल का विश्लेषण हो रहा है...',
    step1: 'तस्वीर अपलोड और सत्यापित',
    step2: 'पत्ते का फोकस और प्रकाश जांचा गया',
    step3: 'रोग पैटर्न का विश्लेषण',
    step4: 'कार्यवाही योग्य सलाह तैयार',
    confidence: 'एआई विश्वसनीयता',
    primaryFinding: 'प्राथमिक स्थिति का पता चला',
    whatWeFound: 'हमने क्या पाया',
    recommendedNextSteps: 'अनुशंसित अगले कदम',
    topPredictions: 'पूर्वानुमान संभावनाएं',
    viewRecs: 'सुझाव देखें',
    scanAnother: 'दूसरा पत्ता स्कैन करें',
    saveResult: 'स्कैन परिणाम सहेजें'
  },
  irrigation: {
    title: 'स्मार्ट सिंचाई सलाहकार',
    subtitle: 'सिंचाई करने से पहले फसल और पर्यावरण संकेतों की समीक्षा करें।',
    updateConditions: 'खेत के माप अपडेट करें',
    statusRecommended: 'जल्द सिंचाई पर विचार करें',
    statusNotNeeded: 'पर्याप्त नमी उपलब्ध है',
    statusMonitor: 'नमी स्थिर है — निगरानी जारी रखें',
    statusInsufficient: 'खेत डेटा अधूरा है'
  },
  common: {
    healthy: 'स्वस्थ',
    needsAttention: 'ध्यान देने योग्य',
    uncertain: 'अनिश्चित',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    loading: 'डेटा लोड हो रहा है...',
    viewDetails: 'विवरण देखें',
    edit: 'संपादित करें'
  }
};
