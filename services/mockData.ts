import { FAQItem, Hospital, GuideItem, JobItem, TransportService, HealthGuideItem, SkillResource, CommunityEvent, CommunityItem, Specialist, Notification, LanguageData, DoctorProfile } from '../types';

// Helper to generate dynamic dates
const getDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long' });
};

// Expanded Location Data (Shared)
export const districts: Record<string, string[]> = {
  "Dhaka": ["Gulshan", "Mirpur", "Dhanmondi", "Uttara", "Savar", "Keraniganj", "Dohar", "Nawabganj", "Dhamrai", "Motijheel", "Tejgaon", "Ramna", "Khilgaon", "Mohammadpur", "Badda"],
  "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj", "Tongi"],
  "Narayanganj": ["Narayanganj Sadar", "Araihazar", "Sonargaon", "Bandar", "Rupganj", "Siddhirganj"],
  "Chattogram": ["Kotwali", "Pahartali", "Panchlaish", "Hathazari", "Sitakunda", "Mirsharai", "Patiya", "Raozan", "Rangunia", "Boalkhali", "Anwara", "Chandanaish", "Satkania", "Lohagara", "Banshkhali", "Halishahar", "Double Mooring"],
  "Comilla": ["Comilla Sadar", "Laksham", "Daudkandi", "Muradnagar", "Debidwar", "Chandina", "Homna", "Burichang", "Brahmanpara", "Nangalkot", "Barura", "Titas", "Monohorgonj"],
  "Sylhet": ["Sylhet Sadar", "Beanibazar", "Golapganj", "Bishwanath", "Osmani Nagar", "Balaganj", "Fenchuganj", "Zakiganj", "Kanaighat", "Gowainghat", "Jaintiapur", "Companiganj"],
  "Rajshahi": ["Boalia", "Motihar", "Puthia", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Tanore", "Rajpara"],
  "Khulna": ["Khulna Sadar", "Sonadanga", "Dumuria", "Phultala", "Dacope", "Batiaghata", "Dighelia", "Koyra", "Paikgachha", "Rupsha", "Terokhada", "Khalishpur", "Daulatpur"],
  "Barishal": ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara", "Agailjhara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi"],
  "Rangpur": ["Rangpur Sadar", "Kaunia", "Pirgacha", "Mithapukur", "Badarganj", "Gangachara", "Pirganj", "Taraganj"],
  "Mymensingh": ["Mymensingh Sadar", "Muktagacha", "Valuka", "Trishal", "Gafargaon", "Bhaluka", "Dhobaura", "Fulbaria", "Haluaghat", "Ishwarganj", "Nandail", "Phulpur"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Maheshkhali", "Ramu", "Teknaf", "Ukhia", "Kutubdia", "Pekua"],
  "Bogra": ["Bogra Sadar", "Sherpur", "Sariakandi", "Gabtali", "Shibganj", "Dhupchanchia"],
  "Jessore": ["Jessore Sadar", "Benapole", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"]
};

// Interface for Local Helpline Data
export interface LocalHelpline {
    police: string;
    fire: string;
    uno: string;
    hospital: string;
}

// Mock Data for Specific Upazilas (Fallback logic used in component)
export const localHelplines: Record<string, LocalHelpline> = {
    "Gulshan": { police: "01713373166", fire: "01730002233", uno: "N/A (Metro)", hospital: "02-9855953" },
    "Mirpur": { police: "01713373180", fire: "01730336655", uno: "N/A (Metro)", hospital: "02-9005650" },
    "Savar": { police: "01713373352", fire: "01730002244", uno: "01733333333", hospital: "01777777777" },
    "Gazipur Sadar": { police: "01713373260", fire: "01730002255", uno: "01755555555", hospital: "01788888888" },
    "Kotwali": { police: "01713373620", fire: "01730002400", uno: "N/A", hospital: "031-619400" },
    "Dhanmondi": { police: "01713373168", fire: "01730002235", uno: "N/A (Metro)", hospital: "02-9676356" },
    "Uttara": { police: "01713373156", fire: "01730002238", uno: "N/A (Metro)", hospital: "02-58955500" }
};

// Generate Mock Events
const generateEvents = (lang: 'bn' | 'en'): CommunityEvent[] => {
    const events: CommunityEvent[] = [
        {
            id: '1',
            title: lang === 'bn' ? "ফ্রি মেডিকেল ক্যাম্প" : "Free Medical Camp",
            date: getDate(2), 
            time: "10:00 AM - 4:00 PM",
            location: lang === 'bn' ? "ধানমন্ডি কমিউনিটি সেন্টার, ঢাকা" : "Dhanmondi Community Center, Dhaka",
            district: "Dhaka",
            description: lang === 'bn' 
                ? "দরিদ্র রোগীদের জন্য বিনামূল্যে চিকিৎসা ও ওষুধ বিতরণ। অভিজ্ঞ ডাক্তাররা উপস্থিত থাকবেন।"
                : "Free treatment and medicine distribution for poor patients. Experienced doctors will be present.",
            organizer: "Health For All",
            contact: "01711223344",
            type: "medical"
        },
        {
            id: '2',
            title: lang === 'bn' ? "শীতবস্ত্র বিতরণ" : "Winter Clothes Distribution",
            date: getDate(4),
            time: "3:00 PM",
            location: lang === 'bn' ? "রংপুর সদর হাই স্কুল মাঠ" : "Rangpur Sadar High School Field",
            district: "Rangpur",
            description: lang === 'bn' 
                ? "উত্তরবঙ্গের শীতার্ত মানুষের মাঝে কম্বল বিতরণ কর্মসূচি। আপনারাও অংশগ্রহণ করতে পারেন।"
                : "Blanket distribution program for cold-stricken people of North Bengal. You can also participate.",
            organizer: "Manobota Foundation",
            contact: "01811223344",
            type: "relief"
        },
        {
            id: '3',
            title: lang === 'bn' ? "রক্তদান কর্মসূচি" : "Blood Donation Drive",
            date: getDate(7),
            time: "9:00 AM - 5:00 PM",
            location: lang === 'bn' ? "টিএসসি, ঢাকা বিশ্ববিদ্যালয়" : "TSC, Dhaka University",
            district: "Dhaka",
            description: lang === 'bn' ? "বাঁধন এর উদ্যোগে স্বেচ্ছায় রক্তদান কর্মসূচি।" : "Voluntary blood donation drive organized by Badhan.",
            organizer: "Badhan",
            contact: "01521112233",
            type: "medical"
        },
        {
            id: '4',
            title: lang === 'bn' ? "বৃক্ষরোপণ অভিযান" : "Tree Plantation Campaign",
            date: getDate(10),
            time: "10:00 AM",
            location: lang === 'bn' ? "সিআরবি, চট্টগ্রাম" : "CRB, Chattogram",
            district: "Chattogram",
            description: lang === 'bn' ? "পরিবেশ রক্ষায় ১০০০ গাছ লাগানোর উদ্যোগ।" : "Initiative to plant 1000 trees to save the environment.",
            organizer: "Green Saver",
            contact: "01822334455",
            type: "other"
        }
    ];
    return events;
};

// Community Helpers Data (Expanded)
const communityHelpersBn: CommunityItem[] = [
    {
        id: 'as-sunnah',
        name: "আস-সুন্নাহ ফাউন্ডেশন",
        type: 'donation',
        role: "চ্যারিটি ও ত্রাণ",
        description: `আস-সুন্নাহ ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক সরকার-নিবন্ধিত প্রতিষ্ঠান। নিবন্ধন নম্বর: এস-১৩১১১/২০১৯। ২০১৭ সালে শায়খ আহমাদুল্লাহ এটি প্রতিষ্ঠা করেন। তিনি প্রতিষ্ঠানটির চেয়ারম্যান হিসেবে প্রত্যক্ষভাবে পরিচালনা করছেন।`,
        location: "মাদানী এভিনিউ, ঢাকা",
        contact: "09610-001089",
        website: "https://assunnahfoundation.org",
        verified: true,
        totalHelped: 500000,
        donationDetails: `অনলাইন ডোনেশন: https://assunnahfoundation.org/donate`
    },
    {
        id: '1',
        name: "আব্দুর রহমান",
        type: 'volunteer',
        role: "স্বেচ্ছাসেবী",
        description: "জরুরি প্রয়োজনে রক্তদান ও যেকোনো শারীরিক শ্রমে সাহায্য করি।",
        location: "মিরপুর, ঢাকা",
        contact: "০১৭০০০০০০০০",
        lastActive: "২ ঘণ্টা আগে",
        verified: true,
        totalHelped: 15
    },
    {
        id: '2',
        name: "রক্তদাতা ক্লাব (বাঁধন)",
        type: 'blood',
        role: "রক্তদান সংস্থা",
        description: "বিশ্ববিদ্যালয় ভিত্তিক রক্তদাতাদের সংগঠন।",
        location: "ঢাকা বিশ্ববিদ্যালয় এলাকা",
        contact: "০১৫২১-০০০০০০",
        lastActive: "১০ মিনিট আগে",
        verified: true,
        totalHelped: 5000
    },
    {
        id: '3',
        name: "রফিকুল ইসলাম",
        type: 'blood',
        role: "রক্তদাতা",
        description: "বি+ (B+) রক্তদানে প্রস্তুত।",
        location: "ধানমন্ডি, ঢাকা",
        contact: "০১৯০০০০০০০০",
        bloodGroup: "B+",
        lastActive: "১ দিন আগে",
        totalHelped: 8
    },
    {
        id: '4',
        name: "সুমাইয়া আক্তার",
        type: 'volunteer',
        role: "খাদ্য সহায়তা",
        description: "এলাকার দরিদ্রদের মাঝে রান্না করা খাবার পৌঁছে দেই।",
        location: "উত্তরা, ঢাকা",
        contact: "০১৬০০০০০০০০",
        lastActive: "৫ ঘণ্টা আগে",
        verified: true,
        totalHelped: 50
    },
    {
        id: '5',
        name: "আহমেদ শফিক",
        type: 'blood',
        role: "রক্তদাতা",
        description: "ও+ (O+) রক্ত লাগলে কল দিবেন।",
        location: "চান্ধগাও, চট্টগ্রাম",
        contact: "০১৮০০০০০০০০",
        bloodGroup: "O+",
        lastActive: "৩ ঘণ্টা আগে",
        totalHelped: 3
    }
];

const communityHelpersEn: CommunityItem[] = [
    {
        id: 'as-sunnah',
        name: "As-Sunnah Foundation",
        type: 'donation',
        role: "Charity & Relief",
        description: "As-Sunnah Foundation is a non-political, non-profit government-registered organization dedicated to education, da'wah, and full human welfare. Founded by Shaykh Ahmadullah in 2017.",
        location: "Madani Avenue, Dhaka",
        contact: "09610-001089",
        website: "https://assunnahfoundation.org",
        verified: true,
        totalHelped: 500000,
        donationDetails: `Online Donation: https://assunnahfoundation.org/donate`
    },
    {
        id: '1',
        name: "Abdur Rahman",
        type: 'volunteer',
        role: "Volunteer",
        description: "Ready to help in emergency and donate blood.",
        location: "Mirpur, Dhaka",
        contact: "01700000000",
        lastActive: "2h ago",
        verified: true,
        totalHelped: 15
    },
    {
        id: '2',
        name: "Badhan Blood Donor Club",
        type: 'blood',
        role: "Organization",
        description: "University based voluntary blood donors.",
        location: "Dhaka University Area",
        contact: "01521-000000",
        lastActive: "10m ago",
        verified: true,
        totalHelped: 5000
    },
    {
        id: '3',
        name: "Rafiqul Islam",
        type: 'blood',
        role: "Blood Donor",
        description: "Ready to donate B+ blood.",
        location: "Dhanmondi, Dhaka",
        contact: "01900000000",
        bloodGroup: "B+",
        lastActive: "1d ago",
        totalHelped: 8
    },
    {
        id: '4',
        name: "Sumaiya Akter",
        type: 'volunteer',
        role: "Food Support",
        description: "Distributing cooked food to the poor.",
        location: "Uttara, Dhaka",
        contact: "01600000000",
        lastActive: "5h ago",
        verified: true,
        totalHelped: 50
    },
    {
        id: '5',
        name: "Ahmed Shafiq",
        type: 'blood',
        role: "Blood Donor",
        description: "Available for O+ blood.",
        location: "Chandgaon, Chattogram",
        contact: "01800000000",
        bloodGroup: "O+",
        lastActive: "3h ago",
        totalHelped: 3
    }
];

const doctorsBn: DoctorProfile[] = [
    { id: '1', name: "অধ্যাপক ডাঃ এবিএম আব্দুল্লাহ", degrees: "এমবিবিএস, এফসিপিএস (মেডিসিন), এফআরসিপি (ইউকে)", specialty: "মেডিসিন", designation: "অধ্যাপক", hospital: "ল্যাবএইড স্পেশালাইজড হাসপাতাল", district: "Dhaka", phone: "১০৬০৬", fee: "২০০০ টাকা", visitingHours: "বিকাল ৫টা - রাত ৯টা" },
    { id: '2', name: "ডাঃ সামিনা চৌধুরী", degrees: "এমবিবিএস, এফসিপিএস (গাইনি)", specialty: "গাইনি", designation: "সিনিয়র কনসালটেন্ট", hospital: "স্কয়ার হাসপাতাল", district: "Dhaka", phone: "১০৬১৬", fee: "১৫০০ টাকা", visitingHours: "সন্ধ্যা ৬টা - রাত ১০টা" },
    { id: '3', name: "ডাঃ আব্দুল্লাহ আল মামুন", degrees: "এমবিবিএস, ডিসিএইচ", specialty: "শিশু", designation: "সহযোগী অধ্যাপক", hospital: "ঢাকা শিশু হাসপাতাল", district: "Dhaka", phone: "০২-৯১১০৬৫২", fee: "১০০০ টাকা", visitingHours: "বিকাল ৪টা - সন্ধ্যা ৭টা" },
    { id: '4', name: "ডাঃ এম এ হাসান", degrees: "এমবিবিএস, এমএস (অর্থো)", specialty: "অর্থোপেডিকস", designation: "অধ্যাপক", hospital: "পঙ্গু হাসপাতাল", district: "Dhaka", phone: "০২-৯১১২১৫০", fee: "১২০০ টাকা" },
    { id: '5', name: "ডাঃ সুফিয়া রহমান", degrees: "এমবিবিএস, এফসিপিএস", specialty: "গাইনি", designation: "অধ্যাপক", hospital: "সিএসসিআর", district: "Chattogram", phone: "০৩১-৬৫৬৫৬৫", fee: "১০০০ টাকা" },
    { id: '6', name: "ডাঃ রবিউল হোসেন", degrees: "এমবিবিএস, ডিসিএইচ", specialty: "শিশু", designation: "কনসালটেন্ট", hospital: "চEVron চট্টগ্রাম", district: "Chattogram", phone: "০৩১-২৫৫২৫৫০", fee: "৮০০ টাকা" },
    { id: '7', name: "ডাঃ মোঃ আবুল কালাম", degrees: "এমবিবিএস, এফসিপিএস (কার্ডিওলজি)", specialty: "হৃদরোগ", designation: "অধ্যাপক", hospital: "সিলেট ওসমানী মেডিকেল", district: "Sylhet", phone: "০৮২১-৭১৩৬৩৭", fee: "১০০০ টাকা" },
    { id: '8', name: "ডাঃ ফারহানা আহমেদ", degrees: "এমবিবিএস, ডিডিভি", specialty: "চর্ম ও যৌন", designation: "সহকারী অধ্যাপক", hospital: "পপুলার ডায়াগনস্টিক", district: "Sylhet", phone: "০৯৬১৩৭৮৭৮০৯", fee: "৮০০ টাকা" },
    { id: '9', name: "ডাঃ এস এম মোস্তফা", degrees: "এমবিবিএস, এফসিপিএস", specialty: "মেডিসিন", designation: "অধ্যাপক", hospital: "রাজশাহী মেডিকেল", district: "Rajshahi", phone: "০৭২১-৭৭৪৩২৫", fee: "১০০০ টাকা" },
    { id: '10', name: "ডাঃ কানিজ ফাতেমা", degrees: "এমবিবিএস, এমএস", specialty: "চক্ষু", designation: "কনসালটেন্ট", hospital: "খুলনা আই হসপিটাল", district: "Khulna", phone: "০৪১-২৮৩০৫৫৫", fee: "৭০০ টাকা" },
    { id: '11', name: "ডাঃ তারেকুর রহমান", degrees: "এমবিবিএস, এমডি (নিউরো)", specialty: "নিউরোলজি", designation: "সহকারী অধ্যাপক", hospital: "ন্যাশনাল ইন্সটিটিউট অব নিউরোসায়েন্সেস", district: "Dhaka", phone: "০২-৯১১২১৫০", fee: "১২০০ টাকা" }
];

const doctorsEn: DoctorProfile[] = [
    { id: '1', name: "Prof. Dr. ABM Abdullah", degrees: "MBBS, FCPS (Medicine), FRCP (UK)", specialty: "Medicine", designation: "Professor", hospital: "Labaid Specialized Hospital", district: "Dhaka", phone: "10606", fee: "2000 TK", visitingHours: "5 PM - 9 PM" },
    { id: '2', name: "Dr. Samina Chowdhury", degrees: "MBBS, FCPS (Gynae)", specialty: "Gynecology", designation: "Senior Consultant", hospital: "Square Hospital", district: "Dhaka", phone: "10616", fee: "1500 TK", visitingHours: "6 PM - 10 PM" },
    { id: '3', name: "Dr. Abdullah Al Mamun", degrees: "MBBS, DCH", specialty: "Pediatrician", designation: "Associate Professor", hospital: "Dhaka Shishu Hospital", district: "Dhaka", phone: "02-9110652", fee: "1000 TK", visitingHours: "4 PM - 7 PM" },
    { id: '4', name: "Dr. M A Hasan", degrees: "MBBS, MS (Ortho)", specialty: "Orthopedics", designation: "Professor", hospital: "NITOR (Pangu Hospital)", district: "Dhaka", phone: "02-9112150", fee: "1200 TK" },
    { id: '5', name: "Dr. Sufia Rahman", degrees: "MBBS, FCPS", specialty: "Gynecology", designation: "Professor", hospital: "CSCR", district: "Chattogram", phone: "031-656565", fee: "1000 TK" },
    { id: '6', name: "Dr. Rabiul Hossain", degrees: "MBBS, DCH", specialty: "Pediatrician", designation: "Consultant", hospital: "Chevron Chittagong", district: "Chattogram", phone: "031-2552550", fee: "800 TK" },
    { id: '7', name: "Dr. Md. Abul Kalam", degrees: "MBBS, FCPS (Cardiology)", specialty: "Cardiology", designation: "Professor", hospital: "Sylhet Osmani Medical", district: "Sylhet", phone: "0821-713637", fee: "1000 TK" },
    { id: '8', name: "Dr. Farhana Ahmed", degrees: "MBBS, DDV", specialty: "Dermatology", designation: "Assistant Professor", hospital: "Popular Diagnostic", district: "Sylhet", phone: "09613787809", fee: "800 TK" },
    { id: '9', name: "Dr. S M Mostafa", degrees: "MBBS, FCPS", specialty: "Medicine", designation: "Professor", hospital: "Rajshahi Medical", district: "Rajshahi", phone: "0721-774325", fee: "1000 TK" },
    { id: '10', name: "Dr. Kaniz Fatema", degrees: "MBBS, MS", specialty: "Ophthalmology", designation: "Consultant", hospital: "Khulna Eye Hospital", district: "Khulna", phone: "041-2830555", fee: "700 TK" },
    { id: '11', name: "Dr. Tarequr Rahman", degrees: "MBBS, MD (Neuro)", specialty: "Neurology", designation: "Assistant Professor", hospital: "National Institute of Neurosciences", district: "Dhaka", phone: "02-9112150", fee: "1200 TK" }
];

const bnData: LanguageData = {
  hospitals: [
    { id: '1', name: "ঢাকা মেডিকেল কলেজ হাসপাতাল", address: "সেগুনবাগিচা, ঢাকা", phone: "০২-৫৫১৬৫০", type: 'govt', website: "http://dmc.gov.bd/" },
    { id: '2', name: "স্কয়ার হাসপাতাল", address: "পান্থপথ, ঢাকা", phone: "১০৬১৬", type: 'private', website: "https://www.squarehospital.com/" },
    { id: '3', name: "কুর্মিটোলা জেনারেল হাসপাতাল", address: "কুর্মিটোলা, ঢাকা", phone: "০২-৫৫০৯৮", type: 'govt', website: "http://kgh.gov.bd/" },
    { id: '4', name: "ইবনে সিনা হাসপাতাল", address: "ধানমন্ডি, ঢাকা", phone: "০৯৬১০০০১০১০", type: 'private', website: "https://www.ibnsinatrust.com/" },
    { id: '5', name: "জাতীয় হৃদরোগ ইনস্টিটিউট", address: "শেরেবাংলা নগর, ঢাকা", phone: "০২-৯১২২৫৬০", type: 'govt', website: "http://nicvd.gov.bd/" },
    { id: '6', name: "এভারকেয়ার হাসপাতাল", address: "বসুন্ধরা, ঢাকা", phone: "১০৬৭৮", type: 'private', website: "https://evercarebd.com/" },
    { id: '7', name: "বারডেম জেনারেল হাসপাতাল", address: "শাহবাগ, ঢাকা", phone: "০২-৯৬৬১৫৫১", type: 'private', website: "https://www.badas-bd.org/" },
    { id: '8', name: "পঙ্গু হাসপাতাল (নিটোর)", address: "শ্যামলী, ঢাকা", phone: "০২-৯১১২১৫০", type: 'govt', website: "http://nitorbd.org/" },
    { id: '9', name: "ইউনাইটেড হাসপাতাল", address: "গুলশান ২, ঢাকা", phone: "১০৬৬৬", type: 'private', website: "https://www.uhlbd.com/" },
    { id: '10', name: "ল্যাবএইড হাসপাতাল", address: "ধানমন্ডি, ঢাকা", phone: "১০৬০৬", type: 'private', website: "https://labaid.com.bd/" },
    { id: '11', name: "চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল", address: "পাঁচলাইশ, চট্টগ্রাম", phone: "০৩১-৬১৯৪০১", type: 'govt' },
    { id: '12', name: "রাজশাহী মেডিকেল কলেজ হাসপাতাল", address: "রাজপাড়া, রাজশাহী", phone: "০৭২১-৭৭৪৩২৫", type: 'govt' },
    { id: '13', name: "খুলনা মেডিকেল কলেজ হাসপাতাল", address: "সোনাডাঙ্গা, খুলনা", phone: "০৪১-৭৬০৩৫০", type: 'govt' },
    { id: '14', name: "সিলেট এম এ জি ওসমানী মেডিকেল", address: "কাজলশাহ, সিলেট", phone: "০৮২১-৭১৩৬৩৭", type: 'govt' }
  ],

  healthGuides: [
    {
      title: "ডেঙ্গু জ্বর (Dengue)",
      symptoms: "তীব্র জ্বর, চোখের পেছনে ব্যথা, শরীরে র‍্যাশ, বমি।",
      action: "প্রচুর তরল খাবার খান, বিশ্রামে থাকুন। মশারির নিচে থাকুন।",
      warning: "পেটে তীব্র ব্যথা বা মাড়ি দিয়ে রক্ত পড়লে দ্রুত হাসপাতালে নিন।"
    },
    {
      title: "জ্বর (Fever)",
      symptoms: "শরীর গরম, মাথাব্যথা, শরীর ব্যথা।",
      action: "প্যারাসিটামল খান, প্রচুর পানি পান করুন, শরীর হালকা কাপড় দিয়ে মুছে দিন।",
      warning: "১০৪° এর বেশি জ্বর হলে দ্রুত ডাক্তার দেখান।"
    },
    {
      title: "হিট স্ট্রোক (Heat Stroke)",
      symptoms: "প্রচণ্ড মাথাব্যথা, ঘাম বন্ধ হওয়া, চামড়া লাল ও গরম হয়ে যাওয়া, অজ্ঞান হওয়া।",
      action: "দ্রুত ছায়ায় বা ঠান্ডা জায়গায় নিন। শরীরে পানি ঢালুন এবং বাতাস করুন।",
      warning: "অজ্ঞান হয়ে গেলে মুখে কিছু খাওয়াবেন না, দ্রুত হাসপাতালে নিন।"
    },
    {
      title: "খাদ্যে বিষক্রিয়া (Food Poisoning)",
      symptoms: "বমি, পাতলা পায়খানা, পেটে ব্যথা।",
      action: "খাবার স্যালাইন ও প্রচুর পানি পান করুন। হালকা খাবার খান।",
      warning: "রক্ত পায়খানা বা পানিশূন্যতা দেখা দিলে ডাক্তারের পরামর্শ নিন।"
    }
  ],

  faqs: [
    { category: "Emergency", question: "জরুরি নাম্বারে কল করতে টাকা লাগে?", answer: "না, ৯৯৯, ১০৯, ৩৩৩ ইত্যাদি জরুরি নাম্বারে কল করা সম্পূর্ণ ফ্রি।" },
    { category: "Emergency", question: "আগুন লাগলে কি করব?", answer: "দ্রুত নিরাপদ স্থানে যান এবং ফায়ার সার্ভিসে (১০২ অথবা ৯৯৯) কল দিন।" },
    { category: "Legal", question: "জিডি (GD) করতে কি টাকা লাগে?", answer: "না, থানায় জিডি করতে কোনো ফি লাগে না। যদি কেউ টাকা চায় তবে ঊর্ধ্বতন কর্মকর্তাকে জানান।" },
    { category: "Legal", question: "জমি খারিজ বা নামজারি করতে কত দিন লাগে?", answer: "সাধারণত ২৮ দিনের মধ্যে নামজারি সম্পন্ন হওয়ার নিয়ম। land.gov.bd তে আবেদন করুন।" },
    { category: "Health", question: "জ্বর হলে কি এন্টিবায়োটিক খাব?", answer: "ডাক্তারের পরামর্শ ছাড়া এন্টিবায়োটিক খাওয়া উচিত নয়। প্যারাসিটামল খেয়ে ৩ দিন দেখুন।" },
    { category: "Health", question: "ডেঙ্গু টেস্ট ফি কত?", answer: "সরকারি হাসপাতালে ১০০ টাকা এবং বেসরকারি হাসপাতালে সর্বোচ্চ ৫০০ টাকা (সরকারি নির্দেশনা অনুযায়ী)।" },
    { category: "Govt", question: "পাসপোর্ট রিনিউ করতে কি কি লাগে?", answer: "পুরাতন পাসপোর্ট এবং এনআইডি কার্ডের কপি লাগে। অনলাইনে আবেদন করে ফি জমা দিতে হয়।" },
    { category: "Govt", question: "নতুন ভোটার হতে কি লাগে?", answer: "জন্ম নিবন্ধন/SSC সনদ, পিতা-মাতার NID কপি, এবং স্থানীয় চেয়ারম্যান/কমিশনারের সনদ।" },
    { category: "Govt", question: "জন্ম নিবন্ধন অনলাইনে চেক করব কিভাবে?", answer: "everify.bdris.gov.bd ওয়েবসাইটে গিয়ে ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর ও জন্ম তারিখ দিন।" },
    { category: "Services", question: "ট্রেনের টিকেট ফেরত দিলে কত টাকা কাটে?", answer: "যাত্রা শুরুর ৪৮ ঘণ্টা আগে ফেরত দিলে সার্ভিস চার্জ বাদে বাকি টাকা ফেরত পাওয়া যায়।" },
    { category: "General", question: "বিকাশ পিন ভুলে গেলে কি করব?", answer: "১৬২৪৭ এ কল করুন অথবা এনআইডি কার্ড সাথে নিয়ে নিকটস্থ কাস্টমার কেয়ারে যান।" },
  ],

  legalGuides: [
    {
      title: "থানায় গেলে কী করবেন (জিডি/মামলা)",
      steps: [{ text: "ডিউটি অফিসারের সাথে কথা বলুন।" }, { text: "ঘটনার বিস্তারিত বিবরণ দিন।" }, { text: "জিডি বা মামলা করতে চাইলে লিখিত আবেদন দিন।" }, { text: "জিডি নম্বর লেখা রশিদ সংগ্রহ করুন।" }],
      website: "https://www.police.gov.bd/"
    },
    {
      title: "গ্রেপ্তার হলে আপনার অধিকার",
      steps: [{ text: "গ্রেপ্তারের কারণ জানার অধিকার।" }, { text: "আইনজীবীর সহায়তা পাওয়ার অধিকার।" }, { text: "২৪ ঘন্টার মধ্যে আদালতে হাজির হওয়ার অধিকার।" }, { text: "পুলিশ হেফাজতে নির্যাতন না পাওয়ার অধিকার।" }]
    },
    {
        title: "বিবাহ রেজিস্ট্রেশন (কাজী অফিস)",
        steps: [{ text: "উভয় পক্ষের এনআইডি/জন্ম নিবন্ধন লাগবে।" }, { text: "২ জন সাক্ষী উপস্থিত থাকতে হবে।" }, { text: "কাবিননামা অবশ্যই বুঝে নিবেন এবং ফি সরকারি তালিকা অনুযায়ী দিবেন।" }]
    },
    {
        title: "তালাক বা বিবাহ বিচ্ছেদ",
        steps: [{ text: "কাজী অফিসে গিয়ে লিখিত নোটিশ পাঠাতে হবে।" }, { text: "নোটিশের কপি অন্য পক্ষ এবং সিটি কর্পোরেশন/চেয়ারম্যানকে পাঠাতে হবে।" }, { text: "৯০ দিন পর তালাক কার্যকর হবে।" }]
    },
    {
        title: "জমি রেজিস্ট্রেশন খরচ",
        steps: [{ text: "দলিল মূল্যের ১% রেজিস্ট্রেশন ফি।" }, { text: "স্ট্যাম্প শুল্ক ১.৫%।" }, { text: "স্থানীয় সরকার কর ৩% (সিটি কর্পোরেশন) বা ২% (অন্যান্য)।" }],
        website: "http://www.land.gov.bd/"
    }
  ],

  govtGuides: [
    {
      title: "ড্রাইভিং লাইসেন্স (Driving License)",
      steps: [{ text: "BRTA পোর্টালে লার্নার কার্ডের জন্য আবেদন করুন।" }, { text: "লিখিত, মৌখিক ও ফিল্ড টেস্ট দিন।" }, { text: "বায়োমেট্রিক দিয়ে স্মার্ট কার্ড সংগ্রহ করুন।" }],
      website: "http://brta.gov.bd/"
    },
    {
      title: "জাতীয় পরিচয়পত্র (NID) সংশোধন",
      steps: [{ text: "services.nidw.gov.bd তে লগইন করুন।" }, { text: "সংশোধন ফি জমা দিন।" }, { text: "প্রমাণপত্র আপলোড করুন (SSC সনদ/জন্ম নিবন্ধন)।" }],
      website: "https://services.nidw.gov.bd/"
    },
    {
        title: "ই-পাসপোর্ট আবেদন",
        steps: [{ text: "epassport.gov.bd তে অনলাইন ফর্ম পূরণ করুন।" }, { text: "ব্যাংকে বা অনলাইনে ফি জমা দিন।" }, { text: "আবেদন কপি ও এনআইডি নিয়ে পাসপোর্ট অফিসে যান।" }],
        website: "https://www.epassport.gov.bd/"
    },
    {
        title: "জন্ম নিবন্ধন সংশোধন",
        steps: [{ text: "bdris.gov.bd তে অনলাইন আবেদন করুন।" }, { text: "প্রয়োজনীয় কাগজপত্র আপলোড করুন।" }, { text: "কাউন্সিলর/চেয়ারম্যান অফিসে যোগাযোগ করুন।" }],
        website: "https://bdris.gov.bd/"
    },
    {
        title: "ট্রেড লাইসেন্স",
        steps: [{ text: "সিটি কর্পোরেশন বা পৌরসভা অফিসে ফর্ম নিন।" }, { text: "ভাড়া রশিদ, এনআইডি ও ছবি জমা দিন।" }, { text: "নির্ধারিত ফি জমা দিয়ে লাইসেন্স সংগ্রহ করুন।" }]
    }
  ],
  
  medicineInfo: [
     { title: "প্যারাসিটামল (Paracetamol)", description: "জ্বর, মাথাব্যথা ও শরীর ব্যথায় কার্যকরী। ভরা পেটে খাওয়া ভালো। (যেমন: Napa, Ace)" },
     { title: "ওলাইন (Oral Saline)", description: "ডায়রিয়া বা বমি হলে শরীর থেকে বের হয়ে যাওয়া পানি পূরণ করতে ব্যবহার করুন।" },
     { title: "এন্টাসিড (Antacid)", description: "গ্যাস্ট্রিক বা বুক জ্বালাপোড়ায় চুষে বা চিবিয়ে খেতে হয়।" },
     { title: "এন্টিহিস্টামিন (Antihistamine)", description: "সর্দি, হাঁচি বা এলার্জি হলে খাওয়া যেতে পারে। (যেমন: Alastin, Fexo)" },
     { title: "সিলভার সালফাডায়াজিন", description: "পোড়া জায়গায় ব্যবহারের জন্য মলম।" },
     { title: "ওমিপ্রাজল (Omeprazole)", description: "গ্যাস্ট্রিক আলসার বা এসিডিটির জন্য। (যেমন: Seclo, Ometid)" },
     { title: "ডমপেরিডন (Domperidone)", description: "বমি বমি ভাব বা বদহজমে কার্যকরী। (যেমন: Motigut, Deflux)" }
  ],

  psychologyTips: [
    { title: "মানসিক চাপ কমানোর উপায়", description: "গভীর শ্বাস নিন, পর্যাপ্ত ঘুমান এবং বিশ্বস্ত কারো সাথে কথা বলুন।" },
    { title: "বিষণ্নতা লক্ষণ", description: "দীর্ঘদিন মন খারাপ থাকা, কাজে অনীহা, ঘুমের সমস্যা।" },
    { title: "আত্মবিশ্বাস বাড়ানোর উপায়", description: "ছোট ছোট লক্ষ্য ঠিক করুন এবং তা পূরণ করুন। নিজেকে সময় দিন।" },
    { title: "রাগ নিয়ন্ত্রণ", description: "রাগ উঠলে ১ থেকে ১০ পর্যন্ত গুনুন। স্থান ত্যাগ করুন এবং পানি পান করুন।" },
    { title: "ভালো ঘুমের টিপস", description: "শোয়ার ১ ঘন্টা আগে মোবাইল ব্যবহার বন্ধ করুন। প্রতিদিন একই সময়ে ঘুমানোর চেষ্টা করুন।" }
  ],

  womenSafety: [
    { title: "হেল্পলাইন ১০৯", description: "নারী ও শিশু নির্যাতনে তাৎক্ষণিক সহায়তার জন্য ১০৯ এ কল করুন (টোল ফ্রি)।" },
    { title: "পারিবারিক সহিংসতা আইন", description: "শারীরিক বা মানসিক নির্যাতনের শিকার হলে আপনি সুরক্ষা আদেশের জন্য আবেদন করতে পারেন।" },
    { title: "সাইবার হ্যারেসমেন্ট", description: "অনলাইনে হয়রানির শিকার হলে পুলিশ সাইবার সাপোর্ট ফর উইমেন পেজে অভিযোগ জানান।" },
    { title: "বাল্যবিবাহ রোধ", description: "বাল্যবিবাহের খবর পেলে ১০৯ বা ৯৯৯ এ কল করুন।" }
  ],

  womenSpecialists: [
      { id: '1', name: "ডাঃ ফাতেমা বেগম", specialty: "gynecologist", location: "ঢাকা মেডিকেল", phone: "০১৭********", hospital: "ঢাকা মেডিকেল কলেজ" },
      { id: '2', name: "ডাঃ নুসরাত জাহান", specialty: "gynecologist", location: "স্কয়ার হাসপাতাল", phone: "১০৬১৬", hospital: "স্কয়ার হাসপাতাল" },
      { id: '3', name: "ডাঃ রওশন আরা", specialty: "gynecologist", location: "মগবাজার", phone: "০১৯********", hospital: "আদ-দ্বীন হাসপাতাল" },
      { id: '4', name: "ডাঃ সামিনা চৌধুরী", specialty: "pediatrician", location: "ধানমন্ডি", phone: "০১৬********", hospital: "ল্যাবএইড" },
      { id: '5', name: "ডাঃ আব্দুল্লাহ আল মামুন", specialty: "pediatrician", location: "শিশু হাসপাতাল", phone: "০২-*********", hospital: "ঢাকা শিশু হাসপাতাল" }
  ],

  jobs: [
    { 
      id: '1', 
      title: "সিকিউরিটি গার্ড", 
      company: "এলিট ফোর্স", 
      location: "গুলশান, ঢাকা", 
      salary: "১২,০০০+ টাকা", 
      type: "ফুল-টাইম", 
      website: "https://eliteforcebd.com/career/", 
      phone: "02-9881245"
    },
    { 
      id: '2', 
      title: "ডেলিভারি ম্যান", 
      company: "পাঠাও", 
      location: "ধানমন্ডি, ঢাকা", 
      salary: "কমিশন ভিত্তিক", 
      type: "পার্ট-টাইম", 
      website: "https://pathao.com/careers/",
      phone: "09678100100"
    },
    { 
      id: '3', 
      title: "সেলস এক্সিকিউটিভ", 
      company: "প্রাণ আরএফএল", 
      location: "মিরপুর, ঢাকা", 
      salary: "১৫,০০০ টাকা", 
      type: "ফুল-টাইম", 
      website: "https://rflgroupbd.com/career",
      phone: "02-9881792"
    },
    { 
      id: '4', 
      title: "শ্রমিক/কর্মী", 
      company: "আকিজ গ্রুপ", 
      location: "তেজগাঁও, ঢাকা", 
      salary: "১৪,০০০ টাকা", 
      type: "ফুল-টাইম", 
      website: "https://www.akij.net/career", 
      phone: "08000016609" 
    },
    { 
      id: '5', 
      title: "ড্রাইভার (গাড়ি)", 
      company: "ব্যক্তিগত/উবার", 
      location: "ঢাকা", 
      salary: "১৮,০০০ টাকা", 
      type: "ফুল-টাইম", 
      phone: "অ্যাপ ব্যবহার করুন"
    },
    { 
      id: '6', 
      title: "বাবুর্চি / শেফ", 
      company: "স্টার কাবাব", 
      location: "ধানমন্ডি", 
      salary: "২০,০০০ টাকা", 
      type: "ফুল-টাইম", 
      phone: "সরাসরি যোগাযোগ"
    },
    { 
      id: '7', 
      title: "গ্রাফিক ডিজাইনার", 
      company: "ক্রিয়েটিভ আইটি", 
      location: "ধানমন্ডি", 
      salary: "২৫,০০০ টাকা", 
      type: "ফুল-টাইম", 
      website: "https://www.creativeitinstitute.com/career"
    },
    { 
      id: '8', 
      title: "টিউশন / গৃহশিক্ষক", 
      company: "Care Tutors", 
      location: "সারা দেশ", 
      salary: "নেগোশিয়েবল", 
      type: "পার্ট-টাইম", 
      website: "https://caretutors.com/"
    }
  ],

  skillResources: [
    { id: '1', title: "ফ্রিল্যান্সিং গাইড", provider: "10 Minute School", duration: "৩ মাস", description: "ঘরে বসে আয়ের উপায় শিখুন।", type: "online", website: "https://10minuteschool.com/" },
    { id: '2', title: "হাঁস-মুরগি পালন", provider: "যুব উন্নয়ন অধিদপ্তর", duration: "১ মাস", description: "গ্রামের বাড়িতে খামার তৈরির প্রশিক্ষণ।", type: "offline", website: "http://dyd.gov.bd/" },
    { id: '3', title: "মোবাইল সার্ভিসিং", provider: "কারিগরি শিক্ষা বোর্ড", duration: "৬ মাস", description: "মোবাইল ও ইলেকট্রনিক্স মেরামতের কাজ।", type: "offline", website: "http://www.bteb.gov.bd/" },
    { id: '4', title: "সেলাই প্রশিক্ষণ", provider: "ব্র্যাক", duration: "২ মাস", description: "মহিলাদের জন্য সেলাই ও হাতের কাজ।", type: "offline", website: "http://www.brac.net/" },
    { id: '5', title: "কম্পিউটার অফিস কোর্স", provider: "যুব উন্নয়ন", duration: "৩ মাস", description: "এমএস ওয়ার্ড, এক্সেল এবং বেসিক কম্পিউটার।", type: "offline" },
    { id: '6', title: "ডিজিটাল মার্কেটিং", provider: "শিখবে সবাই", duration: "৪ মাস", description: "ফেসবুক ও গুগল মার্কেটিং শিখুন।", type: "online", website: "https://shikhbeshobai.com/" },
    { id: '7', title: "ভিডিও এডিটিং", provider: "বোহুব্রীহি", duration: "৩ মাস", description: "ইউটিউব ও প্রফেশনাল ভিডিও এডিটিং।", type: "online", website: "https://bohubrihi.com/" },
    { id: '8', title: "ইলেকট্রিশিয়ান কোর্স", provider: "টিটিসি (TTC)", duration: "৬ মাস", description: "হাউজ ওয়্যারিং এবং ইলেকট্রিক কাজ।", type: "offline" }
  ],

  transportServices: [
    { name: "Rahim Auto Service", type: "Garage", phone: "01611-789012", location: "Mohakhali" },
    { name: "Dhaka Tow Service", type: "Tow Truck", phone: "01911-222222", location: "Uttara" },
    { name: "Highway Police (Comilla)", type: "Police", phone: "01733-398888", location: "Dhaka-Chittagong Highway", website: "https://www.police.gov.bd/" },
    { name: "Shyamoli Paribahan", type: "Bus Counter", phone: "02-9122222", location: "Kallyanpur", website: "https://shyamoliparibahan.com/" },
    { name: "Ena Transport", type: "Bus Counter", phone: "01700-000000", location: "Mohakhali", website: "https://enatransport.net/" },
    { name: "Uber Rent-A-Car", type: "Car Rental", phone: "Use App", location: "Online", website: "https://www.uber.com/bd/en/" },
    { name: "Green Line", type: "Bus Counter", phone: "02-8331453", location: "Rajarbag", website: "https://greenlinebd.com/" },
    { name: "Truck Lagbe", type: "Truck Rental", phone: "09638000244", location: "Online", website: "https://trucklagbe.com/" },
    { name: "Pathao Parcel", type: "Courier", phone: "09678100100", location: "Online", website: "https://pathao.com/" }
  ],

  seniorServices: [
    {
        title: "বয়স্ক ভাতা",
        steps: [{ text: "Contact Social Services office." }, { text: "Submit NID and Photo." }, { text: "Get recommendation from Councilor." }],
        website: "http://www.dss.gov.bd/"
    },
    {
        title: "Pension Withdrawal Help",
        steps: [{ text: "Go to bank for life verification." }, { text: "Keep nominee info with you." }, { text: "Do life verification every year." }]
    },
    {
        title: "Geriatric Welfare Association",
        steps: [{ text: "Located in Agargaon, Dhaka." }, { text: "Healthcare and housing for seniors." }, { text: "Contact: 02-9114065" }]
    }
  ],

  communityHelpers: communityHelpersEn,
  
  communityEvents: generateEvents('en'),
  
  notifications: [
      { id: '1', title: "Alert", message: "Chance of heavy rain tomorrow. Stay safe.", time: "2h ago", read: false },
      { id: '2', title: "New Service", message: "You can now book train tickets from the app.", time: "1d ago", read: false },
      { id: '3', title: "Community Event", message: "Free medical camp next Friday.", time: "2d ago", read: true }
  ],

  doctors: doctorsEn // Default
};

const enData: LanguageData = {
  hospitals: [
    { id: '1', name: "Dhaka Medical College Hospital", address: "Segunbagicha, Dhaka", phone: "02-551650", type: 'govt', website: "http://dmc.gov.bd/" },
    { id: '2', name: "Square Hospital", address: "Panthapath, Dhaka", phone: "10616", type: 'private', website: "https://www.squarehospital.com/" },
    { id: '3', name: "Kurmitola General Hospital", address: "Kurmitola, Dhaka", phone: "02-55098", type: 'govt', website: "http://kgh.gov.bd/" },
    { id: '4', name: "Ibn Sina Hospital", address: "Dhanmondi, Dhaka", phone: "09610001010", type: 'private', website: "https://www.ibnsinatrust.com/" },
    { id: '5', name: "National Institute of Cardiovascular Diseases", address: "Sher-e-Bangla Nagar, Dhaka", phone: "02-9122560", type: 'govt', website: "http://nicvd.gov.bd/" },
    { id: '6', name: "Evercare Hospital", address: "Bashundhara, Dhaka", phone: "10678", type: 'private', website: "https://evercarebd.com/" },
    { id: '7', name: "BIRDEM General Hospital", address: "Shahbag, Dhaka", phone: "02-9661551", type: 'private', website: "https://www.badas-bd.org/" },
    { id: '8', name: "NITOR (Pangu Hospital)", address: "Shyamoli, Dhaka", phone: "02-9112150", type: 'govt', website: "http://nitorbd.org/" },
    { id: '9', name: "United Hospital", address: "Gulshan 2, Dhaka", phone: "10666", type: 'private', website: "https://www.uhlbd.com/" },
    { id: '10', name: "Labaid Hospital", address: "Dhanmondi, Dhaka", phone: "10606", type: 'private', website: "https://labaid.com.bd/" },
    { id: '11', name: "Chattogram Medical College Hospital", address: "Panchlaish, Chattogram", phone: "031-619401", type: 'govt' },
    { id: '12', name: "Rajshahi Medical College Hospital", address: "Rajpara, Rajshahi", phone: "0721-774325", type: 'govt' },
    { id: '13', name: "Khulna Medical College Hospital", address: "Sonadanga, Khulna", phone: "041-760350", type: 'govt' },
    { id: '14', name: "Sylhet MAG Osmani Medical", address: "Kajalshah, Sylhet", phone: "0821-713637", type: 'govt' }
  ],

  healthGuides: [
    {
      title: "Dengue Fever",
      symptoms: "High fever, pain behind eyes, body rash, vomiting.",
      action: "Drink plenty of fluids, rest. Stay under mosquito net.",
      warning: "If severe stomach pain or bleeding gums occur, take to hospital immediately."
    },
    {
      title: "Fever",
      symptoms: "High temperature, headache, body ache.",
      action: "Take paracetamol, drink plenty of water, sponge body with lukewarm water.",
      warning: "If fever exceeds 104°F, see a doctor immediately."
    },
    {
      title: "Heat Stroke",
      symptoms: "Severe headache, lack of sweating, red and hot skin, fainting.",
      action: "Move to shade or cool place immediately. Pour water on body and fan.",
      warning: "If unconscious, do not feed anything by mouth, take to hospital immediately."
    },
    {
      title: "Food Poisoning",
      symptoms: "Vomiting, diarrhea, stomach pain.",
      action: "Drink oral saline and plenty of water. Eat light food.",
      warning: "Consult doctor if blood in stool or dehydration occurs."
    }
  ],

  faqs: [
    { category: "Emergency", question: "Is calling emergency numbers free?", answer: "Yes, calling 999, 109, 333 etc. is completely free." },
    { category: "Emergency", question: "What to do in case of fire?", answer: "Move to a safe place immediately and call Fire Service (102 or 999)." },
    { category: "Legal", question: "Does filing a GD cost money?", answer: "No, filing a GD at the police station is free. If someone asks for money, inform superior officers." },
    { category: "Legal", question: "How long for land mutation?", answer: "Usually it takes 28 days. Apply at land.gov.bd." },
    { category: "Health", question: "Should I take antibiotics for fever?", answer: "Do not take antibiotics without doctor's advice. Take paracetamol and observe for 3 days." },
    { category: "Health", question: "What is Dengue test fee?", answer: "100 TK in Govt hospitals and max 500 TK in private hospitals (as per govt order)." },
    { category: "Govt", question: "Requirements for passport renewal?", answer: "Old passport and copy of NID card. Apply online and pay fee." },
    { category: "Govt", question: "Requirements for new voter?", answer: "Birth certificate/SSC certificate, parents' NID copy, and local chairman/commissioner certificate." },
    { category: "Govt", question: "How to check birth registration online?", answer: "Visit everify.bdris.gov.bd and enter 17 digit registration number and date of birth." },
    { category: "Services", question: "Refund policy for train tickets?", answer: "If returned 48 hours before journey, full amount returned excluding service charge." },
    { category: "General", question: "Forgot bKash PIN?", answer: "Call 16247 or visit nearest customer care with NID card." },
  ],

  legalGuides: [
    {
      title: "Visiting Police Station (GD/Case)",
      steps: [{ text: "Talk to Duty Officer." }, { text: "Give details of the incident." }, { text: "Submit written application for GD or Case." }, { text: "Collect receipt with GD number." }],
      website: "https://www.police.gov.bd/"
    },
    {
      title: "Rights upon Arrest",
      steps: [{ text: "Right to know reason for arrest." }, { text: "Right to get legal counsel." }, { text: "Right to be produced before court within 24 hours." }, { text: "Right not to be tortured in police custody." }]
    },
    {
        title: "Marriage Registration (Kazi Office)",
        steps: [{ text: "NID/Birth Certificate of both parties required." }, { text: "2 witnesses must be present." }, { text: "Ensure Kabinnama is received and fee paid as per govt rate." }]
    },
    {
        title: "Divorce",
        steps: [{ text: "Send written notice via Kazi Office." }, { text: "Send copy of notice to other party and City Corp/Chairman." }, { text: "Divorce becomes effective after 90 days." }]
    },
    {
        title: "Land Registration Cost",
        steps: [{ text: "Registration fee 1% of deed value." }, { text: "Stamp duty 1.5%." }, { text: "Local govt tax 3% (City Corp) or 2% (Others)." }],
        website: "http://www.land.gov.bd/"
    }
  ],

  govtGuides: [
    {
      title: "Driving License",
      steps: [{ text: "Apply for Learner Card at BRTA portal." }, { text: "Appear for written, oral & field tests." }, { text: "Collect Smart Card after biometrics." }],
      website: "http://brta.gov.bd/"
    },
    {
      title: "NID Correction",
      steps: [{ text: "Log in to services.nidw.gov.bd." }, { text: "Pay correction fee." }, { text: "Upload documents (SSC certificate/Birth reg)." }],
      website: "https://services.nidw.gov.bd/"
    },
    {
        title: "E-Passport Application",
        steps: [{ text: "Fill online form at epassport.gov.bd." }, { text: "Pay fee online or at bank." }, { text: "Visit passport office with application copy & NID." }],
        website: "https://www.epassport.gov.bd/"
    },
    {
        title: "Birth Registration Correction",
        steps: [{ text: "Apply online at bdris.gov.bd." }, { text: "Upload required documents." }, { text: "Contact Councilor/Chairman office." }],
        website: "https://bdris.gov.bd/"
    },
    {
        title: "Trade License",
        steps: [{ text: "Collect form from City Corp or Municipality office." }, { text: "Submit rent receipt, NID & photo." }, { text: "Pay prescribed fee and collect license." }]
    }
  ],
  
  medicineInfo: [
     { title: "Paracetamol", description: "Effective for fever, headache and body ache. Best taken after food. (e.g. Napa, Ace)" },
     { title: "Oral Saline", description: "Use to replenish water lost from body due to diarrhea or vomiting." },
     { title: "Antacid", description: "Chew or suck for gastric or heartburn." },
     { title: "Antihistamine", description: "Can be taken for cold, sneezing or allergy. (e.g. Alastin, Fexo)" },
     { title: "Silver Sulfadiazine", description: "Ointment for burns." },
     { title: "Omeprazole", description: "For gastric ulcer or acidity. (e.g. Seclo, Ometid)" },
     { title: "Domperidone", description: "Effective for nausea or indigestion. (e.g. Motigut, Deflux)" }
  ],

  psychologyTips: [
    { title: "Ways to reduce stress", description: "Take deep breaths, get enough sleep and talk to someone you trust." },
    { title: "Symptoms of depression", description: "Feeling sad for long time, lack of interest in work, sleep problems." },
    { title: "Ways to increase confidence", description: "Set small goals and achieve them. Give yourself time." },
    { title: "Anger control", description: "Count from 1 to 10 when angry. Leave the place and drink water." },
    { title: "Tips for good sleep", description: "Stop using mobile 1 hour before bed. Try to sleep at same time daily." }
  ],

  womenSafety: [
    { title: "Helpline 109", description: "Call 109 (Toll Free) for immediate assistance regarding violence against women & children." },
    { title: "Domestic Violence Act", description: "If you are a victim of physical or mental abuse, you can apply for a protection order." },
    { title: "Cyber Harassment", description: "Report online harassment to Police Cyber Support for Women page." },
    { title: "Prevent Child Marriage", description: "Call 109 or 999 if you get news of child marriage." }
  ],

  womenSpecialists: [
      { id: '1', name: "Dr. Fatema Begum", specialty: "gynecologist", location: "Dhaka Medical", phone: "017********", hospital: "Dhaka Medical College" },
      { id: '2', name: "Dr. Nusrat Jahan", specialty: "gynecologist", location: "Square Hospital", phone: "10616", hospital: "Square Hospital" },
      { id: '3', name: "Dr. Rowshan Ara", specialty: "gynecologist", location: "Moghbazar", phone: "019********", hospital: "Ad-din Hospital" },
      { id: '4', name: "Dr. Samina Chowdhury", specialty: "pediatrician", location: "Dhanmondi", phone: "016********", hospital: "Labaid" },
      { id: '5', name: "Dr. Abdullah Al Mamun", specialty: "pediatrician", location: "Shishu Hospital", phone: "02-*********", hospital: "Dhaka Shishu Hospital" }
  ],

  jobs: [
    { 
      id: '1', 
      title: "Security Guard", 
      company: "Elite Force", 
      location: "Gulshan, Dhaka", 
      salary: "12,000+ TK", 
      type: "Full-Time", 
      website: "https://eliteforcebd.com/career/", 
      phone: "02-9881245"
    },
    { 
      id: '2', 
      title: "Delivery Man", 
      company: "Pathao", 
      location: "Dhanmondi, Dhaka", 
      salary: "Commission Based", 
      type: "Part-Time", 
      website: "https://pathao.com/careers/",
      phone: "09678100100"
    },
    { 
      id: '3', 
      title: "Sales Executive", 
      company: "PRAN-RFL", 
      location: "Mirpur, Dhaka", 
      salary: "15,000 TK", 
      type: "Full-Time", 
      website: "https://rflgroupbd.com/career",
      phone: "02-9881792"
    },
    { 
      id: '4', 
      title: "Worker", 
      company: "Akij Group", 
      location: "Tejgaon, Dhaka", 
      salary: "14,000 TK", 
      type: "Full-Time", 
      website: "https://www.akij.net/career", 
      phone: "08000016609" 
    },
    { 
      id: '5', 
      title: "Driver (Car)", 
      company: "Private/Uber", 
      location: "Dhaka", 
      salary: "18,000 TK", 
      type: "Full-Time", 
      phone: "Use App"
    },
    { 
      id: '6', 
      title: "Chef / Cook", 
      company: "Star Kabab", 
      location: "Dhanmondi", 
      salary: "20,000 TK", 
      type: "Full-Time", 
      phone: "Direct Contact"
    },
    { 
      id: '7', 
      title: "Graphic Designer", 
      company: "Creative IT", 
      location: "Dhanmondi", 
      salary: "25,000 TK", 
      type: "Full-Time", 
      website: "https://www.creativeitinstitute.com/career"
    },
    { 
      id: '8', 
      title: "Tutor", 
      company: "Care Tutors", 
      location: "Nationwide", 
      salary: "Negotiable", 
      type: "Part-Time", 
      website: "https://caretutors.com/"
    }
  ],

  skillResources: [
    { id: '1', title: "Freelancing Guide", provider: "10 Minute School", duration: "3 Months", description: "Learn how to earn from home.", type: "online", website: "https://10minuteschool.com/" },
    { id: '2', title: "Poultry Farming", provider: "Youth Development Dept", duration: "1 Month", description: "Training on farm setup in village.", type: "offline", website: "http://dyd.gov.bd/" },
    { id: '3', title: "Mobile Servicing", provider: "Technical Education Board", duration: "6 Months", description: "Mobile and electronics repair work.", type: "offline", website: "http://www.bteb.gov.bd/" },
    { id: '4', title: "Sewing Training", provider: "BRAC", duration: "2 Months", description: "Sewing and handicrafts for women.", type: "offline", website: "http://www.brac.net/" },
    { id: '5', title: "Computer Office Course", provider: "Youth Development", duration: "3 Months", description: "MS Word, Excel and Basic Computer.", type: "offline" },
    { id: '6', title: "Digital Marketing", provider: "Shikhbe Shobai", duration: "4 Months", description: "Learn Facebook and Google Marketing.", type: "online", website: "https://shikhbeshobai.com/" },
    { id: '7', title: "Video Editing", provider: "Bohubrihi", duration: "3 Months", description: "YouTube and Professional Video Editing.", type: "online", website: "https://bohubrihi.com/" },
    { id: '8', title: "Electrician Course", provider: "TTC", duration: "6 Months", description: "House wiring and electric works.", type: "offline" }
  ],

  transportServices: [
    { name: "Rahim Auto Service", type: "Garage", phone: "01611-789012", location: "Mohakhali" },
    { name: "Dhaka Tow Service", type: "Tow Truck", phone: "01911-222222", location: "Uttara" },
    { name: "Highway Police (Comilla)", type: "Police", phone: "01733-398888", location: "Dhaka-Chittagong Highway", website: "https://www.police.gov.bd/" },
    { name: "Shyamoli Paribahan", type: "Bus Counter", phone: "02-9122222", location: "Kallyanpur", website: "https://shyamoliparibahan.com/" },
    { name: "Ena Transport", type: "Bus Counter", phone: "01700-000000", location: "Mohakhali", website: "https://enatransport.net/" },
    { name: "Uber Rent-A-Car", type: "Car Rental", phone: "Use App", location: "Online", website: "https://www.uber.com/bd/en/" },
    { name: "Green Line", type: "Bus Counter", phone: "02-8331453", location: "Rajarbag", website: "https://greenlinebd.com/" },
    { name: "Truck Lagbe", type: "Truck Rental", phone: "09638000244", location: "Online", website: "https://trucklagbe.com/" },
    { name: "Pathao Parcel", type: "Courier", phone: "09678100100", location: "Online", website: "https://pathao.com/" }
  ],

  seniorServices: [
    {
        title: "Old Age Allowance",
        steps: [{ text: "Contact Social Services office." }, { text: "Submit NID and Photo." }, { text: "Get recommendation from Councilor." }],
        website: "http://www.dss.gov.bd/"
    },
    {
        title: "Pension Withdrawal Help",
        steps: [{ text: "Go to bank for life verification." }, { text: "Keep nominee info with you." }, { text: "Do life verification every year." }]
    },
    {
        title: "Geriatric Welfare Association",
        steps: [{ text: "Located in Agargaon, Dhaka." }, { text: "Healthcare and housing for seniors." }, { text: "Contact: 02-9114065" }]
    }
  ],

  communityHelpers: communityHelpersEn,
  
  communityEvents: generateEvents('en'),
  
  notifications: [
      { id: '1', title: "Alert", message: "Chance of heavy rain tomorrow. Stay safe.", time: "2h ago", read: false },
      { id: '2', title: "New Service", message: "You can now book train tickets from the app.", time: "1d ago", read: false },
      { id: '3', title: "Community Event", message: "Free medical camp next Friday.", time: "2d ago", read: true }
  ],

  doctors: doctorsEn // Default
};

export const offlineData = {
  bn: { ...bnData, doctors: doctorsBn },
  en: enData
};