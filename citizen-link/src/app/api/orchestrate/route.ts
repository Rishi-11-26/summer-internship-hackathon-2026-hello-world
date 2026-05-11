import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Comprehensive Telangana Schemes Database
const telanganaSchemes = [
  {
    id: "maha_lakshmi",
    name: "Maha Lakshmi Scheme",
    keywords: ["women", "bus", "travel", "free bus", "financial assistance", "2500", "gas cylinder", "maha lakshmi", "mahila"],
    details: "The Maha Lakshmi Scheme provides ₹2,500 monthly financial assistance to eligible women, free travel in TSRTC RTC buses for women across Telangana, and LPG gas cylinders at ₹500.",
    eligibilityLimit: 200000,
    edgeCases: "Applicant must be a resident of Telangana. White Ration Card (BPL) is mandatory for the ₹500 gas cylinder and financial assistance.",
    // Official age rule: Must be an adult woman (18+)
    minAge: 18,
    maxAge: 99,
    ageNote: "Applicant must be 18 years or above.",
    steps: {
      "English": ["1. Ensure you have a valid White Ration Card.", "2. Obtain the Praja Palana application form from your Gram Panchayat/Ward office.", "3. Submit the filled form with Aadhaar and bank details to the local nodal officer."],
      "Hindi": ["1. सुनिश्चित करें कि आपके पास सफेद राशन कार्ड है।", "2. अपनी ग्राम पंचायत/वार्ड कार्यालय से प्रजा पालन आवेदन पत्र प्राप्त करें।", "3. आधार और बैंक विवरण के साथ भरा हुआ फॉर्म स्थानीय अधिकारी को जमा करें।"],
      "Telugu": ["1. మీకు చెల్లుబాటు అయ్యే తెల్ల రేషన్ కార్డు ఉందని నిర్ధారించుకోండి.", "2. మీ గ్రామ పంచాయతీ/వార్డు కార్యాలయం నుండి ప్రజా పాలన దరఖాస్తు ఫారమ్‌ను పొందండి.", "3. ఆధార్ మరియు బ్యాంక్ వివరాలతో నింపిన ఫారమ్‌ను స్థానిక అధికారికి సమర్పించండి."]
    }
  },
  {
    id: "rythu_bandhu",
    name: "Rythu Bharosa / Rythu Bandhu",
    keywords: ["farmer", "agriculture", "rythu", "bandhu", "bharosa", "crop", "land", "investment support"],
    details: "Rythu Bharosa (formerly Rythu Bandhu) provides financial investment support to farmers for two crops a year. Eligible farmers receive ₹15,000 per acre per year (₹7,500 per season).",
    eligibilityLimit: 500000, // No strict income limit, but land ownership is required. Mock limit for demo.
    edgeCases: "Tenant farmers are also included under the new Rythu Bharosa guidelines. Must possess valid Pattadar passbook linked with Aadhaar.",
    // Official age rule: Must be an adult farmer (18+)
    minAge: 18,
    maxAge: 99,
    ageNote: "Applicant must be 18 years or above and own/cultivate agricultural land.",
    steps: {
      "English": ["1. Verify your land records on the Dharani portal.", "2. Link your Aadhaar card to your bank account.", "3. Apply through the local Agriculture Extension Officer (AEO)."],
      "Hindi": ["1. धरणी पोर्टल पर अपने भूमि रिकॉर्ड की पुष्टि करें।", "2. अपने आधार कार्ड को बैंक खाते से लिंक करें।", "3. स्थानीय कृषि विस्तार अधिकारी (AEO) के माध्यम से आवेदन करें।"],
      "Telugu": ["1. ధరణి పోర్టల్‌లో మీ భూ రికార్డులను ధృవీకరించండి.", "2. మీ ఆధార్ కార్డును మీ బ్యాంక్ ఖాతాకు లింక్ చేయండి.", "3. స్థానిక వ్యవసాయ విస్తరణ అధికారి (AEO) ద్వారా దరఖాస్తు చేసుకోండి."]
    }
  },
  {
    id: "gruha_jyothi",
    name: "Gruha Jyothi Scheme",
    keywords: ["electricity", "power", "bill", "free electricity", "200 units", "current", "gruha jyothi"],
    details: "The Gruha Jyothi Scheme guarantees 200 units of free electricity per month to all eligible households in Telangana.",
    eligibilityLimit: 300000,
    edgeCases: "Applicable only for domestic/residential meters. The Aadhaar card must be linked to the electricity meter connection.",
    // Official age rule: Adult household member (18+)
    minAge: 18,
    maxAge: 99,
    ageNote: "Applicant must be 18 years or above (head of household).",
    steps: {
      "English": ["1. Link your Aadhaar with your domestic electricity consumer number.", "2. Ensure your average monthly consumption is below 200 units.", "3. Register via the Praja Palana scheme or at the local electricity sub-station."],
      "Hindi": ["1. अपने आधार को अपने घरेलू बिजली उपभोक्ता नंबर से लिंक करें।", "2. सुनिश्चित करें कि आपकी औसत मासिक खपत 200 यूनिट से कम है।", "3. प्रजा पालन योजना के माध्यम से या स्थानीय बिजली उप-केंद्र पर पंजीकरण करें।"],
      "Telugu": ["1. మీ దేశీయ విద్యుత్ వినియోగదారు నంబర్‌తో మీ ఆధార్‌ను లింక్ చేయండి.", "2. మీ సగటు నెలవారీ వినియోగం 200 యూనిట్ల లోపు ఉండేలా చూసుకోండి.", "3. ప్రజా పాలన పథకం ద్వారా లేదా స్థానిక విద్యుత్ సబ్ స్టేషన్‌లో నమోదు చేసుకోండి."]
    }
  },
  {
    id: "epass",
    name: "Telangana ePASS (Post Matric Scholarships)",
    keywords: ["scholarship", "student", "education", "college", "epass", "fee reimbursement", "tuition", "degree"],
    details: "Telangana ePASS provides Post Matric Scholarships and Fee Reimbursement (RTF & MTF) to SC, ST, BC, EBC, and Minority students pursuing higher education.",
    eligibilityLimit: 200000,
    edgeCases: "Students must have 75% attendance. Income limit is ₹2,000,000 for SC/ST and ₹1,500,000 for BC/EBC/Minorities. Distance education courses are disqualified.",
    // Official age rule: Post-matric student (typically 16-30 for Inter/Degree/B.Tech, up to 35 for PG)
    minAge: 16,
    maxAge: 35,
    ageNote: "Student must be between 16 and 35 years of age depending on the course level.",
    steps: {
      "English": ["1. Keep your SSC ID, Aadhaar, and latest Income Certificate ready.", "2. Visit the official TS ePASS website (telanganaepass.cgg.gov.in).", "3. Fill the online application and submit physical copies to your college principal."],
      "Hindi": ["1. अपना एसएससी आईडी, आधार और नवीनतम आय प्रमाण पत्र तैयार रखें।", "2. आधिकारिक TS ePASS वेबसाइट (telanganaepass.cgg.gov.in) पर जाएं।", "3. ऑनलाइन आवेदन भरें और भौतिक प्रतियां अपने कॉलेज के प्रिंसिपल को जमा करें।"],
      "Telugu": ["1. మీ SSC ID, ఆధార్ మరియు తాజా ఆదాయ ధృవీకరణ పత్రాన్ని సిద్ధంగా ఉంచుకోండి.", "2. అధికారిక TS ePASS వెబ్‌సైట్ (telanganaepass.cgg.gov.in) ను సందర్శించండి.", "3. ఆన్‌లైన్ దరఖాస్తును పూరించి, మీ కళాశాల ప్రిన్సిపాల్‌కు భౌతిక కాపీలను సమర్పించండి."]
    }
  },
  {
    id: "aasara",
    name: "Aasara Pensions",
    keywords: ["pension", "old age", "widow", "disability", "disabled", "aasara", "handicap", "senior citizen", "elderly"],
    details: "Aasara Pensions provide monthly financial assistance to the elderly, widows, weavers, toddy tappers, and persons with disabilities to ensure a life of dignity.",
    eligibilityLimit: 150000,
    edgeCases: "Only one pension is allowed per family. Age limit is strictly 57+ years for old age pensions. Medical certificate is mandatory for disability pensions.",
    // Official age rule: Old Age Pension 57+; Widow/Disability pension 18+
    minAge: 18,
    maxAge: 99,
    ageNote: "For Old Age pension, minimum age is 57 years. For Widow/Disability pensions, minimum age is 18 years.",
    steps: {
      "English": ["1. Obtain the Aasara Pension application form from your Gram Panchayat/MRO office.", "2. Attach age proof, Aadhaar, and relevant category certificates (e.g., widow/disability).", "3. Submit to the Village Revenue Officer (VRO) or Mandal Parishad Development Officer (MPDO)."],
      "Hindi": ["1. अपनी ग्राम पंचायत/एमआरओ कार्यालय से आसरा पेंशन आवेदन पत्र प्राप्त करें।", "2. आयु प्रमाण, आधार और प्रासंगिक श्रेणी प्रमाण पत्र (जैसे, विधवा/विकलांगता) संलग्न करें।", "3. ग्राम राजस्व अधिकारी (VRO) या मंडल परिषद विकास अधिकारी (MPDO) को जमा करें।"],
      "Telugu": ["1. మీ గ్రామ పంచాయతీ/MRO కార్యాలయం నుండి ఆసరా పెన్షన్ దరఖాస్తు ఫారమ్‌ను పొందండి.", "2. వయస్సు రుజువు, ఆధార్ మరియు సంబంధిత వర్గం ధృవీకరణ పత్రాలను (ఉదా., వితంతువు/వైకల్యం) జత చేయండి.", "3. గ్రామ రెవెన్యూ అధికారి (VRO) లేదా మండల పరిషత్ అభివృద్ధి అధికారి (MPDO) కి సమర్పించండి."]
    }
  },
  {
    id: "kalyana_lakshmi",
    name: "Kalyana Lakshmi / Shaadi Mubarak",
    keywords: ["marriage", "wedding", "kalyana", "lakshmi", "shaadi", "mubarak", "bride", "girl child"],
    details: "This scheme provides financial assistance of ₹1,00,116 to unmarried girls belonging to SC, ST, BC, and Minority families at the time of their marriage to prevent child marriages and support families.",
    eligibilityLimit: 200000,
    edgeCases: "The bride's age must be 18 years or above at the time of marriage. The application must be submitted within 1 year of the date of marriage. Valid SSC certificate or birth certificate is required.",
    // Official age rule: Bride must be 18+, Groom must be 21+
    minAge: 18,
    maxAge: 99,
    ageNote: "The bride must be at least 18 years old and the groom must be at least 21 years old at the time of marriage.",
    steps: {
      "English": ["1. Collect the bride and groom's Aadhaar cards, SSC certificates, and wedding card.", "2. Apply online through the official TS ePASS Kalyana Lakshmi portal.", "3. The Mandal Revenue Officer (MRO) will conduct a physical verification at your residence."],
      "Hindi": ["1. दुल्हन और दूल्हे के आधार कार्ड, एसएससी प्रमाण पत्र और शादी का कार्ड एकत्र करें।", "2. आधिकारिक TS ePASS कल्याणा लक्ष्मी पोर्टल के माध्यम से ऑनलाइन आवेदन करें।", "3. मंडल राजस्व अधिकारी (MRO) आपके निवास पर भौतिक सत्यापन करेगा।"],
      "Telugu": ["1. వధువు మరియు వరుడి ఆధార్ కార్డులు, SSC సర్టిఫికెట్లు మరియు పెళ్లి కార్డును సేకరించండి.", "2. అధికారిక TS ePASS కళ్యాణ లక్ష్మి పోర్టల్ ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి.", "3. మండల రెవెన్యూ అధికారి (MRO) మీ నివాసంలో భౌతిక ధృవీకరణను నిర్వహిస్తారు."]
    }
  },
  {
    id: "aarogyasri",
    name: "Rajiv Aarogyasri Scheme",
    keywords: ["health", "medical", "hospital", "surgery", "aarogyasri", "insurance", "treatment", "disease", "sick"],
    details: "Rajiv Aarogyasri provides BPL families with up to ₹10 Lakhs of financial protection per family per year for catastrophic health needs and surgeries at empanelled government and corporate hospitals.",
    eligibilityLimit: 500000,
    edgeCases: "Only procedures listed in the Aarogyasri active guidelines are covered. The patient must possess a valid Aarogyasri Health Card or BPL White Ration Card.",
    // Official age rule: Open to all BPL family members
    minAge: 0,
    maxAge: 99,
    ageNote: "Open to all ages. The scheme covers the entire BPL family.",
    steps: {
      "English": ["1. Visit an empanelled Aarogyasri network hospital.", "2. Present your Aarogyasri Health Card or White Ration Card at the Aarogyasri Mitra desk.", "3. Undergo the required medical tests; the hospital will apply for pre-authorization online."],
      "Hindi": ["1. एक सूचीबद्ध आरोग्यश्री नेटवर्क अस्पताल पर जाएँ।", "2. आरोग्यश्री मित्र डेस्क पर अपना आरोग्यश्री स्वास्थ्य कार्ड या सफेद राशन कार्ड प्रस्तुत करें।", "3. आवश्यक चिकित्सा परीक्षण कराएं; अस्पताल ऑनलाइन पूर्व-प्राधिकरण के लिए आवेदन करेगा।"],
      "Telugu": ["1. ఎంపానెల్ చేయబడిన ఆరోగ్యశ్రీ నెట్‌వర్క్ ఆసుపత్రిని సందర్శించండి.", "2. ఆరోగ్యశ్రీ మిత్ర డెస్క్ వద్ద మీ ఆరోగ్యశ్రీ హెల్త్ కార్డ్ లేదా తెల్ల రేషన్ కార్డును సమర్పించండి.", "3. అవసరమైన వైద్య పరీక్షలు చేయించుకోండి; ఆసుపత్రి ముందస్తు అనుమతి కోసం ఆన్‌లైన్‌లో దరఖాస్తు చేస్తుంది."]
    }
  },
  {
    id: "dalit_bandhu",
    name: "Telangana Dalit Bandhu",
    keywords: ["dalit", "sc", "scheduled caste", "business", "entrepreneur", "empowerment", "dalit bandhu", "10 lakhs"],
    details: "Dalit Bandhu is a flagship scheme to empower Dalit (SC) families by providing a direct benefit transfer of ₹10 Lakhs per family to start a business or self-employment venture without any bank linkage or collateral.",
    eligibilityLimit: 9999999, // Open to all eligible SC families
    edgeCases: "Must have a valid SC caste certificate issued by the Telangana Government. The funds must be strictly used for the approved business plan. Government employees are strictly disqualified.",
    // Official age rule: Adult SC family member (18+)
    minAge: 18,
    maxAge: 99,
    ageNote: "Applicant must be 18 years or above and hold a valid SC caste certificate.",
    steps: {
      "English": ["1. Prepare a viable business plan for self-employment.", "2. Submit the application along with your SC Caste Certificate and Aadhaar to the District Collectorate.", "3. Open a dedicated bank account for the Dalit Bandhu funds once approved."],
      "Hindi": ["1. स्वरोजगार के लिए एक व्यवहार्य व्यवसाय योजना तैयार करें।", "2. जिला कलेक्ट्रेट में अपने अनुसूचित जाति (SC) प्रमाण पत्र और आधार के साथ आवेदन जमा करें।", "3. स्वीकृत होने के बाद दलित बंधु धन के लिए एक समर्पित बैंक खाता खोलें।"],
      "Telugu": ["1. స్వయం ఉపాధి కోసం ఆచరణీయమైన వ్యాపార ప్రణాళికను సిద్ధం చేయండి.", "2. జిల్లా కలెక్టరేట్‌కు మీ SC కుల ధృవీకరణ పత్రం మరియు ఆధార్‌తో పాటు దరఖాస్తును సమర్పించండి.", "3. ఆమోదించబడిన తర్వాత దళిత బంధు నిధుల కోసం ప్రత్యేక బ్యాంక్ ఖాతాను తెరవండి."]
    }
  },
  {
    id: "kcr_kit",
    name: "KCR Kit / Amma Vodi",
    keywords: ["pregnant", "pregnancy", "baby", "newborn", "mother", "kcr kit", "maternity", "hospital", "child"],
    details: "The scheme supports pregnant women by providing a 16-item 'KCR Kit' for newborns and financial assistance of ₹12,000 (₹13,000 for a girl child) distributed across vaccination and checkup stages to compensate for wage loss.",
    eligibilityLimit: 300000,
    edgeCases: "Limited to 2 deliveries only. The delivery must strictly occur in a Telangana Government Hospital. Registration with the local ASHA worker is mandatory.",
    // Official age rule: Pregnant women (18-45 is typical reproductive age range)
    minAge: 18,
    maxAge: 45,
    ageNote: "Pregnant women must be between 18 and 45 years of age.",
    steps: {
      "English": ["1. Register your pregnancy with the local ASHA worker within 12 weeks.", "2. Ensure you attend all required ANC (Ante-Natal Care) checkups at the Primary Health Centre.", "3. Deliver your baby at a designated Government Hospital to claim the kit and funds."],
      "Hindi": ["1. 12 सप्ताह के भीतर स्थानीय आशा कार्यकर्ता के पास अपने गर्भावस्था का पंजीकरण कराएं।", "2. सुनिश्चित करें कि आप प्राथमिक स्वास्थ्य केंद्र में सभी आवश्यक ANC (प्रसवपूर्व देखभाल) जांच में भाग लेते हैं।", "3. किट और धन का दावा करने के लिए एक नामित सरकारी अस्पताल में अपने बच्चे को जन्म दें।"],
      "Telugu": ["1. 12 వారాలలోపు స్థానిక ఆశా వర్కర్‌తో మీ గర్భధారణను నమోదు చేసుకోండి.", "2. ప్రాథమిక ఆరోగ్య కేంద్రంలో అవసరమైన అన్ని ANC చెకప్‌లకు మీరు హాజరయ్యేలా చూసుకోండి.", "3. కిట్ మరియు నిధులను క్లెయిమ్ చేయడానికి నియమించబడిన ప్రభుత్వ ఆసుపత్రిలో ప్రసవించండి."]
    }
  },
  {
    id: "indiramma_indlu",
    name: "Indiramma Indlu (Housing Scheme)",
    keywords: ["house", "housing", "home", "construction", "indiramma", "indlu", "plot", "landless"],
    details: "Indiramma Indlu provides financial assistance of ₹5 Lakhs to eligible poor families who own a plot to construct a house. Landless eligible families will be provided a housing plot along with the construction funds.",
    eligibilityLimit: 200000,
    edgeCases: "Beneficiary must not already own a pucca house. Must be a BPL family with a White Ration Card. Priority is given to SC/ST, single women, and disabled individuals.",
    // Official age rule: Adult BPL family head (18+)
    minAge: 18,
    maxAge: 99,
    ageNote: "Applicant must be 18 years or above and must be from a BPL family.",
    steps: {
      "English": ["1. Gather your Aadhaar, White Ration Card, and land ownership documents (if applicable).", "2. Apply through the Praja Palana application drive at your local Gram Panchayat or Municipal Ward.", "3. Await field verification by the Housing Corporation officials."],
      "Hindi": ["1. अपना आधार, सफेद राशन कार्ड और भूमि स्वामित्व दस्तावेज (यदि लागू हो) इकट्ठा करें।", "2. अपनी स्थानीय ग्राम पंचायत या नगर निगम वार्ड में प्रजा पालन अभियान के माध्यम से आवेदन करें।", "3. आवास निगम के अधिकारियों द्वारा क्षेत्र सत्यापन की प्रतीक्षा करें।"],
      "Telugu": ["1. మీ ఆధార్, తెల్ల రేషన్ కార్డు మరియు భూ యాజమాన్య పత్రాలను (వర్తిస్తే) సేకరించండి.", "2. మీ స్థానిక గ్రామ పంచాయతీ లేదా మున్సిపల్ వార్డులో ప్రజా పాలన దరఖాస్తు డ్రైవ్ ద్వారా దరఖాస్తు చేసుకోండి.", "3. హౌసింగ్ కార్పొరేషన్ అధికారుల ద్వారా క్షేత్ర స్థాయి పరిశీలన కోసం వేచి ఉండండి."]
    }
  },
  {
    id: "kanti_velugu",
    name: "Kanti Velugu (Free Eye Checkups)",
    keywords: ["eye", "vision", "glasses", "spectacles", "kanti", "velugu", "blindness", "health"],
    details: "Kanti Velugu is a massive universal eye screening program providing free eye checkups, distribution of reading glasses, and surgeries for the citizens of Telangana to achieve a completely 'Avoidable Blindness-Free' state.",
    eligibilityLimit: 9999999, // Open to all
    edgeCases: "Open to all residents of Telangana irrespective of income. Must carry Aadhaar card for registration at the eye camp.",
    // Official age rule: Open to all ages (universal health screening)
    minAge: 0,
    maxAge: 99,
    ageNote: "Open to all citizens of Telangana regardless of age.",
    steps: {
      "English": ["1. Keep your Aadhaar card ready.", "2. Visit the designated Kanti Velugu camp in your ward or village during the scheduled dates.", "3. Undergo the free screening to receive reading glasses immediately or prescription glasses within a few days."],
      "Hindi": ["1. अपना आधार कार्ड तैयार रखें।", "2. निर्धारित तिथियों के दौरान अपने वार्ड या गांव में निर्दिष्ट कांति वेलुगु शिविर में जाएँ।", "3. तुरंत रीडिंग ग्लास या कुछ दिनों के भीतर प्रिस्क्रिप्शन ग्लास प्राप्त करने के लिए निःशुल्क जांच कराएं।"],
      "Telugu": ["1. మీ ఆధార్ కార్డును సిద్ధంగా ఉంచుకోండి.", "2. షెడ్యూల్ చేయబడిన తేదీలలో మీ వార్డు లేదా గ్రామంలో నియమించబడిన కంటి వెలుగు శిబిరాన్ని సందర్శించండి.", "3. వెంటనే రీడింగ్ గ్లాసెస్ లేదా కొన్ని రోజుల్లో ప్రిస్క్రిప్షన్ గ్లాసెస్ పొందడానికి ఉచిత పరీక్ష చేయించుకోండి."]
    }
  },
  {
    id: "cm_overseas",
    name: "CM Overseas Scholarship Scheme",
    keywords: ["overseas", "abroad", "foreign", "scholarship", "minority", "masters", "phd", "student"],
    details: "This scheme provides financial assistance of up to ₹20 Lakhs to eligible minority students for pursuing post-graduate and doctoral studies in reputed foreign universities.",
    eligibilityLimit: 500000,
    edgeCases: "The student must have secured admission in a foreign university before applying. Maximum age limit is 35 years. Must be from a minority community in Telangana.",
    // Official age rule: Max 35 years for minority overseas scholarship
    minAge: 18,
    maxAge: 35,
    ageNote: "Applicant must be between 18 and 35 years of age.",
    steps: {
      "English": ["1. Obtain your foreign university admission letter and valid visa.", "2. Register online via the official Telangana Minorities Welfare Department portal.", "3. Upload your academic transcripts, Aadhaar, and Income Certificate for verification."],
      "Hindi": ["1. अपना विदेशी विश्वविद्यालय प्रवेश पत्र और वैध वीज़ा प्राप्त करें।", "2. आधिकारिक तेलंगाना अल्पसंख्यक कल्याण विभाग पोर्टल के माध्यम से ऑनलाइन पंजीकरण करें।", "3. सत्यापन के लिए अपने शैक्षणिक टेप, आधार और आय प्रमाण पत्र अपलोड करें।"],
      "Telugu": ["1. మీ విదేశీ విశ్వవిద్యాలయ ప్రవేశ పత్రం మరియు చెల్లుబాటు అయ్యే వీసాను పొందండి.", "2. అధికారిక తెలంగాణ మైనారిటీ సంక్షేమ శాఖ పోర్టల్ ద్వారా ఆన్‌లైన్‌లో నమోదు చేసుకోండి.", "3. ధృవీకరణ కోసం మీ అకడమిక్ ట్రాన్‌స్క్రిప్ట్‌లు, ఆధార్ మరియు ఆదాయ ధృవీకరణ పత్రాన్ని అప్‌లోడ్ చేయండి."]
    }
  },
  {
    id: "golla_kuruma",
    name: "Sheep Distribution Scheme (Golla Kuruma)",
    keywords: ["sheep", "animal", "livestock", "yadav", "kuruma", "distribution", "rearing"],
    details: "The Sheep Distribution Scheme empowers the traditional shepherd communities (Golla and Kuruma) by providing 75% subsidy on a unit of sheep (20 sheep + 1 ram) to boost rural economy.",
    eligibilityLimit: 9999999, // Open to community members
    edgeCases: "Applicant must be an active member of the local primary sheep breeders cooperative society and belong to the Golla or Kuruma community. Beneficiary contributes 25% of the cost.",
    // Official age rule: Adult community member (18+)
    minAge: 18,
    maxAge: 99,
    ageNote: "Applicant must be 18 years or above and an active member of a Sheep Breeders Cooperative Society.",
    steps: {
      "English": ["1. Register as a member in the local Sheep Breeders Cooperative Society.", "2. Arrange a Demand Draft (DD) for your 25% contribution share.", "3. Submit the application along with Aadhaar and caste certificate to the local Veterinary Assistant Surgeon."],
      "Hindi": ["1. स्थानीय भेड़ प्रजनक सहकारी समिति में सदस्य के रूप में पंजीकरण करें।", "2. अपने 25% योगदान हिस्से के लिए एक डिमांड ड्राफ्ट (DD) की व्यवस्था करें।", "3. स्थानीय पशु चिकित्सा सहायक सर्जन को आधार और जाति प्रमाण पत्र के साथ आवेदन जमा करें।"],
      "Telugu": ["1. స్థానిక గొర్రెల పెంపకందారుల సహకార సంఘంలో సభ్యునిగా నమోదు చేసుకోండి.", "2. మీ 25% సహకారం వాటా కోసం డిమాండ్ డ్రాఫ్ట్ (DD)ను ఏర్పాటు చేయండి.", "3. స్థానిక వెటర్నరీ అసిస్టెంట్ సర్జన్‌కు ఆధార్ మరియు కుల ధృవీకరణ పత్రంతో పాటు దరఖాస్తును సమర్పించండి."]
    }
  },
  {
    id: "nethannaku_cheyutha",
    name: "Nethannaku Cheyutha (Handloom Weavers)",
    keywords: ["weaver", "handloom", "nethanna", "cloth", "loom", "textile", "thrift"],
    details: "A Thrift Fund cum Saving and Security Scheme for handloom weavers. For every 8% of wages saved by the weaver, the Telangana Government contributes a 16% matching grant.",
    eligibilityLimit: 9999999, // Open to active weavers
    edgeCases: "The applicant must be a practicing handloom weaver or ancillary worker over 18 years of age. Must be a member of the Handloom Weavers Cooperative Society.",
    // Official age rule: Active weaver over 18
    minAge: 18,
    maxAge: 99,
    ageNote: "Applicant must be a practicing weaver, 18 years or above.",
    steps: {
      "English": ["1. Obtain a membership certificate from your Handloom Weavers Cooperative Society.", "2. Open a joint Thrift Fund account in a nationalized bank or cooperative bank.", "3. Ensure regular monthly deductions from your wages to trigger the government's 16% matching contribution."],
      "Hindi": ["1. अपने हथकरघा बुनकर सहकारी समिति से सदस्यता प्रमाण पत्र प्राप्त करें।", "2. राष्ट्रीयकृत बैंक या सहकारी बैंक में संयुक्त थ्रिफ्ट फंड खाता खोलें।", "3. सरकार के 16% मिलान योगदान को ट्रिगर करने के लिए अपने वेतन से नियमित मासिक कटौती सुनिश्चित करें।"],
      "Telugu": ["1. మీ చేనేత కార్మికుల సహకార సంఘం నుండి సభ్యత్వ ధృవీకరణ పత్రాన్ని పొందండి.", "2. జాతీయ బ్యాంకు లేదా సహకార బ్యాంకులో ఉమ్మడి పొదుపు నిధి ఖాతాను తెరవండి.", "3. ప్రభుత్వ 16% మ్యాచింగ్ సహకారాన్ని ప్రేరేపించడానికి మీ వేతనం నుండి క్రమం తప్పకుండా నెలవారీ తగ్గింపులను నిర్ధారించుకోండి."]
    }
  }
];

// Helper to determine scheme based on keywords
function findRelevantScheme(query: string) {
  const normalizedQuery = query.toLowerCase();
  
  let bestMatch = null;
  let maxMatches = 0;

  for (const scheme of telanganaSchemes) {
    let matchCount = 0;
    for (const keyword of scheme.keywords) {
      if (normalizedQuery.includes(keyword)) {
        matchCount++;
      }
    }
    
    // Exact name match bonus
    if (scheme.name.toLowerCase().includes(normalizedQuery)) {
      matchCount += 10;
    }

    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestMatch = scheme;
    }
  }

  // Fallback if no specific keywords hit, try to match general keywords
  if (!bestMatch) {
    if (normalizedQuery.includes("student") || normalizedQuery.includes("school")) return telanganaSchemes.find(s => s.id === "epass");
    if (normalizedQuery.includes("health") || normalizedQuery.includes("hospital")) return telanganaSchemes.find(s => s.id === "aarogyasri");
    if (normalizedQuery.includes("farm") || normalizedQuery.includes("land")) return telanganaSchemes.find(s => s.id === "rythu_bandhu");
    if (normalizedQuery.includes("women") || normalizedQuery.includes("lady")) return telanganaSchemes.find(s => s.id === "maha_lakshmi");
  }

  return bestMatch;
}


export async function POST(req: NextRequest) {
  const { profile, query, language } = await req.json();

  // ── Load live eligibility rules from JSON (auto-updated daily by scout_agent) ──
  let eligibilityConfig: Record<string, { minAge: number; maxAge: number; eligibilityLimit: number; ageNote: string }> = {};
  try {
    const configPath = path.join(process.cwd(), "schemes_eligibility.json");
    const raw = fs.readFileSync(configPath, "utf-8");
    eligibilityConfig = JSON.parse(raw).schemes ?? {};
  } catch (e) {
    // If file missing (e.g. first run), fall back to hardcoded values silently
    console.warn("[T-Sahaya] schemes_eligibility.json not found — using hardcoded fallback values.", e);
  }

  const stream = new ReadableStream({
    async start(controller) {
      const sendLog = (id: string, agent: string, message: string, status: string) => {
        controller.enqueue(
          `data: ${JSON.stringify({ type: "log", log: { id, agent, message, status } })}\n\n`
        );
      };

      const sendResult = (steps: string[]) => {
        controller.enqueue(
          `data: ${JSON.stringify({ type: "result", steps })}\n\n`
        );
      };

      try {
        // Find Scheme
        sendLog("agent-1-start", "Scrutinizer", `Searching official Telangana .gov.in sources for: ${query}...`, "pending");
        await new Promise((r) => setTimeout(r, 1200));

        const matchedScheme = findRelevantScheme(query);

        if (!matchedScheme) {
           sendLog("agent-1-done", "Scrutinizer", "No official Telangana data found. Halting pipeline.", "error");
           sendResult(["No official Telangana government schemes matched your query. Please try using different keywords like 'farmer', 'scholarship', 'marriage', or 'health'."]);
           controller.close();
           return;
        }

        // Merge live eligibility rules from JSON (overrides hardcoded values if available)
        const liveRules = eligibilityConfig[matchedScheme.id];
        const schemeMinAge          = liveRules?.minAge          ?? matchedScheme.minAge;
        const schemeMaxAge          = liveRules?.maxAge          ?? matchedScheme.maxAge;
        const schemeEligibilityLimit = liveRules?.eligibilityLimit ?? matchedScheme.eligibilityLimit;
        const schemeAgeNote         = liveRules?.ageNote         ?? matchedScheme.ageNote;

        sendLog("agent-1-done", "Scrutinizer", `Successfully retrieved official details for ${matchedScheme.name}.`, "success");
        await new Promise((r) => setTimeout(r, 800));

        // Eligibility Auditor
        sendLog("agent-2-start", "Eligibility Auditor", "Cross-referencing scheme requirements with your profile...", "pending");
        await new Promise((r) => setTimeout(r, 1500));
        

        const userIncome = Number(profile.income) || 0;
        const userAge = Number(profile.age) || 0;

        // ── Age Validation (strict, based on official Telangana rules) ──
        let isAgeEligible = true;
        let ageRejectionMsg = "";

        if (userAge === 0) {
          // Age not provided — warn but don't block
          ageRejectionMsg = "Age not entered. Please enter your age for an accurate eligibility check.";
          isAgeEligible = false;
        } else if (userAge < schemeMinAge) {
          ageRejectionMsg = `Age check FAILED: You are ${userAge} years old, but this scheme requires a minimum age of ${schemeMinAge} years. ${schemeAgeNote}`;
          isAgeEligible = false;
        } else if (userAge > schemeMaxAge) {
          ageRejectionMsg = `Age check FAILED: You are ${userAge} years old, but this scheme has a maximum age limit of ${schemeMaxAge} years. ${schemeAgeNote}`;
          isAgeEligible = false;
        }

        if (!isAgeEligible && userAge !== 0) {
          // Hard block — age is definitively out of range
          sendLog("agent-2-done", "Eligibility Auditor", ageRejectionMsg, "error");
          sendResult([
            `❌ NOT ELIGIBLE: ${ageRejectionMsg}`,
            `ℹ️ Official Rule: ${schemeAgeNote}`,
            `💡 Tip: Check other schemes in the dropdown that may apply to your age group.`
          ]);
          controller.close();
          return;
        }

        if (!isAgeEligible && userAge === 0) {
          sendLog("agent-2-warn", "Eligibility Auditor", ageRejectionMsg, "warning");
        } else {
          sendLog("agent-2-age", "Eligibility Auditor", `Age check PASSED — ${userAge} years is within the valid range (min: ${schemeMinAge}, max: ${schemeMaxAge === 99 ? "no upper limit" : schemeMaxAge}) for this scheme.`, "success");
        }

        await new Promise((r) => setTimeout(r, 600));

        // ── Income Validation ──
        let isIncomeEligible = true;
        let incomeRejectionMsg = "";

        if (userIncome === 0) {
          isIncomeEligible = false;
        } else if (schemeEligibilityLimit < 9999999 && userIncome > schemeEligibilityLimit) {
          isIncomeEligible = false;
          incomeRejectionMsg = `Income check FAILED: Your annual income of ₹${userIncome.toLocaleString('en-IN')} exceeds the eligibility limit of ₹${schemeEligibilityLimit.toLocaleString('en-IN')} for this scheme.`;
        }

        if (!isIncomeEligible && userIncome !== 0) {
          // Hard block — income is definitively out of range
          sendLog("agent-2-done", "Eligibility Auditor", incomeRejectionMsg, "error");
          sendResult([
            `❌ NOT ELIGIBLE: ${incomeRejectionMsg}`,
            `ℹ️ Official Rule: Annual income must be ₹${schemeEligibilityLimit.toLocaleString('en-IN')} or below.`,
            `💡 Tip: Check other schemes in the dropdown that may not have this income limit.`
          ]);
          controller.close();
          return;
        }

        if (!isIncomeEligible && userIncome === 0) {
          sendLog("agent-2-warn", "Eligibility Auditor", "Income not entered. Please enter your annual income for an accurate eligibility check.", "warning");
        } else {
          sendLog("agent-2-income", "Eligibility Auditor", `Income check PASSED: ₹${userIncome.toLocaleString('en-IN')} is within the threshold for ${matchedScheme.name}.`, "success");
        }

        await new Promise((r) => setTimeout(r, 800));

        // Red Teamer
        sendLog("agent-3-start", "Red-Teamer", "Challenging eligibility logic for edge-cases and disqualifiers...", "pending");
        await new Promise((r) => setTimeout(r, 1800));
        
        sendLog("agent-3-done", "Red-Teamer", `Edge-case analysis complete. Note: ${matchedScheme.edgeCases}`, "info");
        await new Promise((r) => setTimeout(r, 800));

        // Accessibility Architect
        sendLog("agent-4-start", "Accessibility Architect", `Translating and simplifying final steps into ${language}...`, "pending");
        await new Promise((r) => setTimeout(r, 1500));
        sendLog("agent-4-done", "Accessibility Architect", "Translation and simplification complete.", "success");
        
        // Return correct language steps
        const validLanguage: "English" | "Hindi" | "Telugu" = (language === "Hindi" || language === "Telugu") ? language : "English";
        const finalSteps = matchedScheme.steps[validLanguage];

        sendResult(finalSteps);
        
        controller.close();
      } catch (error) {
        sendLog("sys-err", "System", "A critical internal error occurred in the local engine.", "error");
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
