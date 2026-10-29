const mockTranslations = {
  en: (text) => text,
  ml: (text) => {
    const originals = {
      "Hey! Are we still on for the product review?": "ഹായ്! ഞങ്ങൾ ഇപ്പോഴും പ്രോഡക്ട് റിവ്യൂയ്ക്കായി തയ്യാറാണോ?",
      "Yes, I am ready. I can share the latest mockup.": "അതെ, ഞാൻ തയ്യാറാണ്. ഞാൻ ഏറ്റവും പുതിയ മോക്കപ്പ് പങ്കിടാം.",
      "Perfect. I will join in ten minutes.": " superb. ഞാൻ പത്ത് മിനിറ്റിന് ശേഷം ചേരും.",
      "I sent the revised timeline. Please review it.": "എനിക്ക് പുനരാരംഭിച്ച ടൈംലൈൻ അയച്ചു. ദയവായി അത് വീണ്ടും നോക്കിക്കോ.",
      "Morning team, we have the launch checklist ready.": "സുഗ്രഹം ടീം, ലോഞ്ച് ചെക്ക് ലിസ്റ്റ് തയ്യാറായിട്ടുണ്ട്.",
      "I am updating the assets and the page flow now.": "ഞാൻ ഇപ്പോൾ അസറ്റുകൾക്കും പേജ് ഫ്ലോക്കും മാറ്റം വരുത്തുന്നു.",
    };

    return originals[text] || `Demo Malayalam translation: ${text}`;
  },
  hi: (text) => {
    const originals = {
      "Hey! Are we still on for the product review?": "अरे! क्या हम अभी भी प्रोडक्ट रिव्यू के लिए तैयार हैं?",
      "Yes, I am ready. I can share the latest mockup.": "हाँ, मैं तैयार हूँ। मैं लेटेस्ट मॉक्सअप साझा कर सकता हूँ।",
      "Perfect. I will join in ten minutes.": "बिल्कुल सही। मैं दस मिनट में जुड़ जाऊँगा।",
      "I sent the revised timeline. Please review it.": "मैंने संशोधित टाइमलाइन भेज दी है। कृपया इसकी समीक्षा करें।",
      "Morning team, we have the launch checklist ready.": "शुभ प्रभात टीम, हमारे पास लॉन्च चेकलिस्ट तैयार है।",
      "I am updating the assets and the page flow now.": "मैं अभी एसेट्स और पेज फ्लो को अपडेट कर रहा हूँ।",
    };

    return originals[text] || `Demo Hindi translation: ${text}`;
  },
  ta: (text) => {
    const originals = {
      "Hey! Are we still on for the product review?": "வணக்கம்! தயாரிப்பு மதிப்பாய்வுக்காக இன்னும் நாங்கள் தயார் இருக்கிறோமா?",
      "Yes, I am ready. I can share the latest mockup.": "ஆம், நான் தயார். கடைசி மாடல் டெம்ப்ளேட்டை பகிர்ந்து கொள்ளலாம்.",
      "Perfect. I will join in ten minutes.": "சிறந்தது. நான் பத்து நிமிடங்களில் சேருவேன்.",
      "I sent the revised timeline. Please review it.": "திருத்தப்பட்ட காலவரிசையை நான் அனுப்பியுள்ளேன். தயவுசெய்து பரிசீலிக்கவும்.",
      "Morning team, we have the launch checklist ready.": "காலை சகாக்களே, தொடக்கச் சரிபார்ப்பு தயாராக உள்ளது.",
      "I am updating the assets and the page flow now.": "நான் இப்போது பொருட்கள் மற்றும் பக்கம் ஓட்டத்தை புதுப்பிக்கிறேன்.",
    };

    return originals[text] || `Demo Tamil translation: ${text}`;
  },
  kn: (text) => {
    const originals = {
      "Hey! Are we still on for the product review?": "ಹಾಯ್! ಉತ್ಪನ್ನ ವಿಮರ್ಶೆಗೆ ನಾವು ಇನ್ನೂ ಸಿದ್ಧರಿದ್ದೇವೆಯೇ?",
      "Yes, I am ready. I can share the latest mockup.": "ಹೌದು, ನಾನು ಸಿದ್ಧನಿದ್ದೇನೆ. ಇತ್ತೀಚಿನ ಮಾಕಪ್ ಅನ್ನು ಹಂಚಿಕೊಳ್ಳಬಹುದು.",
      "Perfect. I will join in ten minutes.": "ಹೇಗೆ? ನಾನು ಹತ್ತು ನಿಮಿಷಗಳಲ್ಲಿ ಸೇರುತ್ತೇನೆ.",
      "I sent the revised timeline. Please review it.": "ಮೇಲ್ ಮಾಡಿದ ನವೀಕರಣಗೊಂಡ ಸಮಯಸಾಲು ನಾನು ಕಳುಹಿಸಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.",
      "Morning team, we have the launch checklist ready.": "ಪ್ರಭಾತ ಶಾಲೆ, ಲಾನಚ್ ಚೆಕ್‌ಲಿಸ್ಟ್ ಸಿದ್ಧವಾಗಿದೆ.",
      "I am updating the assets and the page flow now.": "ನಾನು ಈಗ ಆಸ್ತಿ ಮತ್ತು ಪುಟದ ಹರಿವನ್ನು ನವೀಕರಿಸುತ್ತಿದ್ದೇನೆ.",
    };

    return originals[text] || `Demo Kannada translation: ${text}`;
  },
  ar: (text) => {
    const originals = {
      "Hey! Are we still on for the product review?": "مرحبًا! هل ما زلنا على استعداد لمراجعة المنتج؟",
      "Yes, I am ready. I can share the latest mockup.": "نعم، أنا جاهز. أستطيع مشاركة أحدث النموذج الأولي.",
      "Perfect. I will join in ten minutes.": "ممتاز. سأنضم خلال عشر دقائق.",
      "I sent the revised timeline. Please review it.": "أرسلت الجدول الزمني المنقح. يرجى مراجعته.",
      "Morning team, we have the launch checklist ready.": "صباح الخير الفريق، قائمة إطلاق جاهزة.",
      "I am updating the assets and the page flow now.": "أنا الآن أُحدّث الأصول وتدفق الصفحة.",
    };

    return originals[text] || `Demo Arabic translation: ${text}`;
  },
  es: (text) => {
    const originals = {
      "Hey! Are we still on for the product review?": "¡Hola! ¿Todavía estamos para la revisión del producto?",
      "Yes, I am ready. I can share the latest mockup.": "Sí, estoy listo. Puedo compartir el último prototipo.",
      "Perfect. I will join in ten minutes.": "Perfecto. Me uniré en diez minutos.",
      "I sent the revised timeline. Please review it.": "Envié la línea de tiempo revisada. Por favor revísala.",
      "Morning team, we have the launch checklist ready.": "Buenos días equipo, ya está lista la lista de lanzamiento.",
      "I am updating the assets and the page flow now.": "Estoy actualizando los activos y el flujo de la página ahora mismo.",
    };

    return originals[text] || `Demo Spanish translation: ${text}`;
  },
};

export const translateMockText = (text, targetLanguage = 'en') => {
  if (!text) return '';
  const handler = mockTranslations[targetLanguage] || mockTranslations.en;
  return handler(text);
};
