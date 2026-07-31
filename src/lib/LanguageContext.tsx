"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = 
  | "English" 
  | "Hindi" 
  | "Kannada" 
  | "Tamil" 
  | "Telugu" 
  | "Malayalam"
  | "Marathi"
  | "Bengali"
  | "Gujarati"
  | "Spanish"
  | "French";

export const LANG_CODES: Record<SupportedLanguage, string> = {
  English: "en",
  Hindi: "hi",
  Kannada: "kn",
  Tamil: "ta",
  Telugu: "te",
  Malayalam: "ml",
  Marathi: "mr",
  Bengali: "bn",
  Gujarati: "gu",
  Spanish: "es",
  French: "fr",
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<string, Record<string, string>> = {
  English: {
    "nav.shop": "Shop All",
    "nav.blogs": "Blogs",
    "nav.story": "Our Story",
    "nav.admin": "Admin",
    "nav.signin": "Sign In",
    "nav.signout": "Sign Out",
    "nav.account": "My Account",
    "nav.cart": "Cart",
    "search.placeholder": "Search natural products...",
    "announcement": "🌿 Free shipping on orders above ₹499 | Handcrafted in Karnataka | 100% Natural Ingredients",
    "home.bestsellers": "Our Bestsellers",
    "home.featured": "Featured Products",
    "home.viewall": "View All Products →",
    "home.browsebytype": "Browse by Type",
    "home.shopbycategory": "Shop by Category",
    "home.freshbatch": "Fresh Batch Coming Soon",
    "account.preferences": "Account Preferences",
    "account.sub": "Manage your orders, profile, and preferences",
    "account.language": "Preferred Language",
    "account.theme": "App Theme",
    "account.interests": "Interests & Favorites",
    "account.dietary": "Dietary Options & Allergies",
    "account.save": "Save Preferences",
    "account.updated": "Preferences updated successfully!",
    "product.addtocart": "Add to Cart",
    "product.viewcart": "View Cart",
    "product.instock": "In Stock",
    "product.outofstock": "Out of Stock",
    "product.selectsize": "Select Packaging / Size:",
    "cart.title": "Shopping Cart",
    "cart.empty": "Your Wellness Cart is Empty",
    "cart.checkout": "Proceed to Checkout",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.free": "FREE",
    "cart.total": "Total Amount",
  },
  Hindi: {
    "nav.shop": "सभी उत्पाद",
    "nav.blogs": "ब्लॉग",
    "nav.story": "हमारी कहानी",
    "nav.admin": "व्यवस्थापक",
    "nav.signin": "साइन इन",
    "nav.signout": "साइन आउट",
    "nav.account": "मेरा खाता",
    "nav.cart": "कार्ट",
    "search.placeholder": "प्राकृतिक उत्पादों की खोज करें...",
    "announcement": "🌿 ₹499 से अधिक के ऑर्डर पर मुफ्त शिपिंग | कर्नाटक में निर्मित | 100% प्राकृतिक सामग्री",
    "home.bestsellers": "हमारे बेस्टसेलर्स",
    "home.featured": "प्रमुख उत्पाद",
    "home.viewall": "सभी उत्पाद देखें →",
    "home.browsebytype": "प्रकार के अनुसार ब्राउज़ करें",
    "home.shopbycategory": "श्रेणी के अनुसार खरीदें",
    "home.freshbatch": "ताजा बैच जल्द आ रहा है",
    "account.preferences": "खाता प्राथमिकताएं",
    "account.sub": "अपने ऑर्डर, प्रोफ़ाइल और प्राथमिकताओं को प्रबंधित करें",
    "account.language": "पसंदीदा भाषा",
    "account.theme": "ऐप थीम",
    "account.interests": "रुचियां और पसंदीदा",
    "account.dietary": "आहार विकल्प और एलर्जी",
    "account.save": "प्राथमिकताएं सहेजें",
    "account.updated": "प्राथमिकताएं सफलतापूर्वक अपडेट की गईं!",
    "product.addtocart": "कार्ट में जोड़ें",
    "product.viewcart": "कार्ट देखें",
    "product.instock": "स्टॉक में है",
    "product.outofstock": "स्टॉक खत्म",
    "product.selectsize": "पैकेजिंग / आकार चुनें:",
    "cart.title": "शॉपिंग कार्ट",
    "cart.empty": "आपकी कार्ट खाली है",
    "cart.checkout": "चेकआउट करें",
    "cart.subtotal": "उप-योग",
    "cart.shipping": "शिपिंग",
    "cart.free": "मुफ़्त",
    "cart.total": "कुल राशि",
  },
  Kannada: {
    "nav.shop": "ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು",
    "nav.blogs": "ಬ್ಲಾಗ್‌ಗಳು",
    "nav.story": "ನಮ್ಮ ಕಥೆ",
    "nav.admin": "ಅಡ್ಮಿನ್",
    "nav.signin": "ಸೈನ್ ಇನ್",
    "nav.signout": "ಸೈನ್ ಔಟ್",
    "nav.account": "ನನ್ನ ಖಾತೆ",
    "nav.cart": "ಕಾರ್ಟ್",
    "search.placeholder": "ನೈಸರ್ಗಿಕ ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...",
    "announcement": "🌿 ₹499 ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಡೆಲಿವರಿ | ಕರ್ನಾಟಕದಲ್ಲಿ ತಯಾರಿಸಲಾಗಿದೆ | 100% ನೈಸರ್ಗಿಕ ಪದಾರ್ಥಗಳು",
    "home.bestsellers": "ನಮ್ಮ ಅತ್ಯುತ್ತಮ ಉತ್ಪನ್ನಗಳು",
    "home.featured": "ವಿಶೇಷ ಉತ್ಪನ್ನಗಳು",
    "home.viewall": "ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ →",
    "home.browsebytype": "ಪ್ರಕಾರದ ಪ್ರಕಾರ ಹುಡುಕಿ",
    "home.shopbycategory": "ವರ್ಗದ ಪ್ರಕಾರ ಖರೀದಿಸಿ",
    "home.freshbatch": "ತಾಜಾ ಬ್ಯಾಚ್ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ",
    "account.preferences": "ಖಾತೆಯ ಆಯ್ಕೆಗಳು",
    "account.sub": "ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳು, ಪ್ರೊಫೈಲ್ ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    "account.language": "ಆದ್ಯತೆಯ ಭಾಷೆ",
    "account.theme": "ಆ್ಯಪ್ ಥೀಮ್",
    "account.interests": "ಆಸಕ್ತಿಗಳು ಮತ್ತು ಇಷ್ಟಗಳು",
    "account.dietary": "ಆಹಾರದ ಆಯ್ಕೆಗಳು",
    "account.save": "ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಿ",
    "account.updated": "ಆದ್ಯತೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!",
    "product.addtocart": "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    "product.viewcart": "ಕಾರ್ಟ್ ನೋಡಿ",
    "product.instock": "ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ",
    "product.outofstock": "ಸ್ಟಾಕ್ ಮುಗಿದಿದೆ",
    "product.selectsize": "ಪ್ಯಾಕೇಜಿಂಗ್ / ಗಾತ್ರ ಆಯ್ಕೆಮಾಡಿ:",
    "cart.title": "ಶಾಂಪಿಂಗ್ ಕಾರ್ಟ್",
    "cart.empty": "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
    "cart.checkout": "ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ",
    "cart.subtotal": "ಉಪಮೊತ್ತ",
    "cart.shipping": "ಶಿಪ್ಪಿಂಗ್",
    "cart.free": "ಉಚಿತ",
    "cart.total": "ಒಟ್ಟು ಮೊತ್ತ",
  },
  Tamil: {
    "nav.shop": "அனைத்து பொருட்கள்",
    "nav.blogs": "பிளாக்குகள்",
    "nav.story": "எங்கள் கதை",
    "nav.admin": "நிர்வாகி",
    "nav.signin": "உள்நுழைக",
    "nav.signout": "வெளியேறுக",
    "nav.account": "என் கணக்கு",
    "nav.cart": "கார்ட்",
    "search.placeholder": "இயற்கை பொருட்களைத் தேடவும்...",
    "announcement": "🌿 ₹499 க்கு மேற்பட்ட ஆர்டர்களுக்கு இலவச ஷிப்பிங் | கர்நாடகாவில் தயாரிக்கப்பட்டது | 100% இயற்கை பொருட்கள்",
    "home.bestsellers": "எங்கள் சிறந்த விற்பனை பொருட்கள்",
    "home.featured": "சிறப்புப் பொருட்கள்",
    "home.viewall": "அனைத்து பொருட்களையும் பார்க்க →",
    "home.browsebytype": "வகைப்படி உலாவுக",
    "home.shopbycategory": "பிரிவு வாரியாக வாங்குக",
    "home.freshbatch": "புதிய பேட்ச் விரைவில் வருகிறது",
    "account.preferences": "கணக்கு விருப்பங்கள்",
    "account.sub": "உங்கள் ஆர்டர்கள் மற்றும் சுயவிவரத்தை நிர்வகிக்கவும்",
    "account.language": "விருப்பமான மொழி",
    "account.theme": "செயலி தீம்",
    "account.interests": "விருப்பங்கள் மற்றும் ஆர்வங்கள்",
    "account.dietary": "உணவு விருப்பங்கள்",
    "account.save": "விருப்பங்களைச் சேமிக்கவும்",
    "account.updated": "விருப்பங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!",
    "product.addtocart": "கார்ட்டில் சேர்க்கவும்",
    "product.viewcart": "கார்ட்டைப் பார்க்கவும்",
    "product.instock": "இருப்பில் உள்ளது",
    "product.outofstock": "இருப்பு இல்லை",
    "product.selectsize": "அளவைத் தேர்ந்தெடுக்கவும்:",
    "cart.title": "ஷாப்பிங் கார்ட்",
    "cart.empty": "உங்கள் கார்ட் காலியாக உள்ளது",
    "cart.checkout": "செக்அவுட் செய்ய தொடரவும்",
    "cart.subtotal": "துணைத் தொகை",
    "cart.shipping": "ஷிப்பிங்",
    "cart.free": "இலவசம்",
    "cart.total": "மொத்தத் தொகை",
  },
  Telugu: {
    "nav.shop": "అన్ని ఉత్పత్తులు",
    "nav.blogs": "బ్లాగులు",
    "nav.story": "మా కథ",
    "nav.admin": "అడ్మిన్",
    "nav.signin": "సైన్ ఇన్",
    "nav.signout": "సైన్ అవుట్",
    "nav.account": "నా ఖాతా",
    "nav.cart": "కార్ట్",
    "search.placeholder": "సహజ ఉత్పత్తులను శోధించండి...",
    "announcement": "🌿 ₹499 కంటే ఎక్కువ ఆర్డర్‌లపై ఉచిత షిప్పింగ్ | కర్ణాటకలో తయారు చేయబడింది | 100% సహజ పదార్థాలు",
    "home.bestsellers": "మా అత్యంత ప్రజాదరణ పొందిన ఉత్పత్తులు",
    "home.featured": "ప్రత్యేక ఉత్పత్తులు",
    "home.viewall": "అన్ని ఉత్పత్తులను చూడండి →",
    "home.browsebytype": "రకం వారీగా శోధించండి",
    "home.shopbycategory": "కేటగిరీ వారీగా కొనుగోలు చేయండి",
    "home.freshbatch": "తాజా బ్యాచ్ త్వరలో వస్తుంది",
    "account.preferences": "ఖాతా ప్రాధాన్యతలు",
    "account.sub": "మీ ఆర్డర్‌లు మరియు ప్రొఫైల్‌ను నిర్వహించండి",
    "account.language": "ప్రాధాన్య భాష",
    "account.theme": "యాప్ థీమ్",
    "account.interests": "ఆసక్తులు మరియు ఇష్టమైనవి",
    "account.dietary": "ఆహార ఎంపికలు",
    "account.save": "ప్రాధాన్యతలను సేవ్ చేయండి",
    "account.updated": "ప్రాధాన్యతలు విజయవంతంగా నవీకరించబడ్డాయి!",
    "product.addtocart": "కార్ట్‌కు జోడించండి",
    "product.viewcart": "కార్ట్ చూడండి",
    "product.instock": "స్టాక్‌లో ఉంది",
    "product.outofstock": "స్టాక్ లేదు",
    "product.selectsize": "సైజు ఎంచుకోండి:",
    "cart.title": "షాపింగ్ కార్ట్",
    "cart.empty": "మీ కార్ట్ ఖాళీగా ఉంది",
    "cart.checkout": "చెక్‌అవుట్‌కు వెళ్లండి",
    "cart.subtotal": "సబ్‌టోటల్",
    "cart.shipping": "షిప్పింగ్",
    "cart.free": "ఉచితం",
    "cart.total": "మొత్తం ಮೊత్తం",
  },
  Malayalam: {
    "nav.shop": "എല്ലാ ഉൽപ്പന്നങ്ങളും",
    "nav.blogs": "ബ്ലോഗുകൾ",
    "nav.story": "ഞങ്ങളുടെ കഥ",
    "nav.admin": "അഡ്മിൻ",
    "nav.signin": "സൈൻ ഇൻ",
    "nav.signout": "സൈൻ ഔട്ട്",
    "nav.account": "എന്റെ അക്കൗണ്ട്",
    "nav.cart": "കാർട്ട്",
    "search.placeholder": "നാടൻ ഉൽപ്പന്നങ്ങൾ തിരയുക...",
    "announcement": "🌿 ₹499-ന് മുകളിലുള്ള ഓർഡറുകൾക്ക് സൗജന്യ ഡെലിവറി | കർണാടകയിൽ നിർമ്മിച്ചത് | 100% പ്രകൃതിദത്ത ചേരുവകൾ",
    "home.bestsellers": "ഞങ്ങളുടെ മികച്ച ഉൽപ്പന്നങ്ങൾ",
    "home.featured": "പ്രത്യേക ഉൽപ്പന്നങ്ങൾ",
    "home.viewall": "എല്ലാ ഉൽപ്പന്നങ്ങളും കാണുക →",
    "home.browsebytype": "ഇനം തിരിച്ച് തിരയുക",
    "home.shopbycategory": "വിഭാഗം തിരിച്ച് വാങ്ങുക",
    "home.freshbatch": "പുതിയ ബാച്ച് ഉടൻ വരുന്നു",
    "account.preferences": "അക്കൗണ്ട് താല്പര്യങ്ങൾ",
    "account.sub": "നിങ്ങളുടെ ഓർഡറുകളും പ്രൊഫൈലും ക്രമീകരിക്കുക",
    "account.language": "തിരഞ്ഞെടുത്ത ഭാഷ",
    "account.theme": "ആപ്പ് തീം",
    "account.interests": "താല്പര്യങ്ങൾ",
    "account.dietary": "ഭക്ഷണ രീതികൾ",
    "account.save": "മാറ്റങ്ങൾ സേവ് ചെയ്യുക",
    "account.updated": "താല്പര്യങ്ങൾ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!",
    "product.addtocart": "കാർട്ടിലേക്ക് ചേർക്കുക",
    "product.viewcart": "കാർട്ട് കാണുക",
    "product.instock": "സ്റ്റോക്കിലുണ്ട്",
    "product.outofstock": "സ്റ്റോക്കില്ല",
    "product.selectsize": "അളവ് തിരഞ്ഞെടുക്കുക:",
    "cart.title": "ഷോപ്പിംഗ് കാർട്ട്",
    "cart.empty": "നിങ്ങളുടെ കാർട്ട് ശൂന്യമാണ്",
    "cart.checkout": "ചെക്ക്ഔട്ട് ചെയ്യുക",
    "cart.subtotal": "സബ്‌ടോട്ടൽ",
    "cart.shipping": "ഷിപ്പിംഗ്",
    "cart.free": "സൗജന്യമായി",
    "cart.total": "ആകെ തുക",
  },
};

const setGoogleTranslateCookie = (langCode: string) => {
  if (typeof document === "undefined") return;
  const domain = window.location.hostname;
  if (langCode === "en") {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
  } else {
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain};`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain};`;
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "English",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("English");

  useEffect(() => {
    const savedLang = localStorage.getItem("rhp_language") as SupportedLanguage;
    if (savedLang && LANG_CODES[savedLang]) {
      setLanguageState(savedLang);
    }

    // Inject Google Translate script dynamically if not present
    if (typeof window !== "undefined" && !document.getElementById("google-translate-script")) {
      const div = document.createElement("div");
      div.id = "google_translate_element";
      div.style.display = "none";
      document.body.appendChild(div);

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,kn,ta,te,ml,mr,bn,gu,es,fr",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("rhp_language", lang);
    const langCode = LANG_CODES[lang] || "en";
    setGoogleTranslateCookie(langCode);

    // Trigger translate dropdown change in Google Translate widget if present
    const selectElem = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const t = (key: string): string => {
    const langDict = DICTIONARY[language] || DICTIONARY.English;
    return langDict[key] || DICTIONARY.English[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
