// NIVARAA LIVING — Customer Review Concierge Controller
// Direct verified Google write review dialog link with ',3,,,,'
const GOOGLE_REVIEW_URL = "https://www.google.com/search?q=nivara+living#lrd=0x3bc2c1367c6b1d75:0xaf348dca7eb33ada,3,,,,";

// State
let selectedStars = 5;
let currentCategory = 'sofas';
let currentLanguage = 'mixed';
let currentAspect = 'quality';
let isTypoEnabled = true;
let reviewSeed = 1042;

// Comprehensive Review Phrasing Matrix for all 6 categories
const reviewCorpus = {
    sofas: {
        english: [
            "Ordered a bespoke L-shape sectional sofa from Nivaraa Living and the quality is extraordinary.",
            "Purchased a custom Chesterfield sofa in rich velvet. The seat depth and cushioning are second to none.",
            "Our living room looks like a luxury editorial space thanks to Nivaraa Living's custom sofa craftsmanship.",
            "The internal seasoned wood structure and foam density in our new sofa are top tier.",
            "Delivered our tailored curved sofa exactly on schedule with immaculate finishing."
        ],
        hinglish: [
            "Nivaraa Living se custom L-shape sofa banwaya, fabric aur cushioning ki quality ekdum solid hai.",
            "Sofa ka comfort aur back support bohot hi zabardast hai. Pure luxury feel!",
            "Living room ke liye customized sofa liya, exact dimensions aur modern look mila.",
            "Velvet fabric bohot soft hai aur wooden frame kafi sturdy hai. Best sofa studio in Pune.",
            "Timely delivery aur premium finishing. Family ko sofa bohot pasand aaya!"
        ],
        marathlish: [
            "Nivaraa Living kadun custom sofa banavla, kapad aani foam quality ekdam apratim ahe.",
            "Sofa finishing khupach sundar ahe, amchya living room cha look badalun gela.",
            "Amchya gharachya size pramane perfect custom sofa banvun dila. Khup aawadla.",
            "Basayla ekdam comfortable aani sturdy wood structure ahe.",
            "Pune madhye custom sofa sathi Nivaraa Living sarvat best showroom ahe."
        ],
        hindi: [
            "निवारा लिविंग से कस्टम सोफा बनवाया, फैब्रिक और कुशनिंग की क्वालिटी बहुत ही शानदार है।",
            "सोफे की फिनिशिंग और डिजाइन एकदम परफेक्ट है। बैठने में बहुत आरामदायक है।",
            "लिविंग रूम के लिए बेस्ट सोफा डिज़ाइन तैयार करके दिया। पूरे परिवार को बहुत पसंद आया।",
            "पुणे में प्रीमियम और कस्टम फर्नीचर के लिए सबसे भरोसेमंद जगह।"
        ],
        marathi: [
            "निवारा लिव्हिंग कडून कस्टम सोफा बनवून घेतला, कापड आणि फोम कॉलिटी अत्यंत दर्जेदार आहे.",
            "सोफ्याची फिनिशिंग आणि सिटिंग कम्फर्ट खूपच छान आहे. घरातील सर्वांना आवडला.",
            "पुण्यातील सर्वोत्तम कस्टमाईज्ड फर्निचर दालन. उत्तम सेवा!"
        ]
    },
    beds: {
        english: [
            "Custom-built our master bedroom upholstered bed at Nivaraa Living. The fluted headboard is breathtaking.",
            "The hydraulic storage bed with teak wood framing is rock solid and operates effortlessly.",
            "Got our king-size bespoke bed with velvet headboard made here. Super comfortable and durable.",
            "Architectural design and flawless upholstery work on our master bed."
        ],
        hinglish: [
            "Nivaraa Living se king size upholstered bed banwaya, headboard design pure luxury lagta hai.",
            "Hydraulic bed ki teak wood frame bohot sturdy hai aur storage space bhi kafi spacious hai.",
            "Master bedroom bed ka fabric aur finish 5-star hotel jaisa feel deta hai.",
            "Finishing aur detailing me koi kami nahi hai. Total value for money bed!"
        ],
        marathlish: [
            "Nivaraa Living kadun master bedroom bed banvun ghetla, headboard chi design khup premium ahe.",
            "Hydraulic storage bed sturdy teak wood madhye banavla ahe. Kahi aawaj nahi aani ekdam smooth ahe.",
            "Bed chi finishing aani comfort khupach chhan ahe.",
            "Amhala hawa tasa bed banvun dila, best craftsmanship!"
        ],
        hindi: [
            "निवारा लिविंग से किंग साइज बेड बनवाया, हेडबोर्ड की डिज़ाइन और फिनिशिंग लाजवाब है।",
            "हाइड्रोलिक स्टोरेज बेड बहुत मजबूत और उपयोग में बहुत आसान है।",
            "मास्टर बेडरूम के लिए एकदम फाइव स्टार होटल जैसा लुक मिला।"
        ],
        marathi: [
            "निवारा लिव्हिंग कडून बेड बनवून घेतला, हेडबोर्ड चे काम आणि सागवानी लाकडाची मजबुती उत्तम आहे.",
            "हायड्रॉलिक स्टोरेज बेड अगदी सुरळीत चालतो आणि दिसायलाही अतिशय सुंदर आहे."
        ]
    },
    dining: {
        english: [
            "Commissioned an 8-seater Italian marble dining table with custom ergonomic chairs from Nivaraa Living.",
            "The solid teak wood base and rounded marble edge detailing on our dining table are sublime.",
            "Every dinner guest compliments our dining table setup. Outstanding Pune artisans.",
            "Heavy, durable, and heirloom-quality bespoke dining furniture."
        ],
        hinglish: [
            "Nivaraa Living se 6-seater solid marble dining table banwaya, table aur chairs dono top notch hain.",
            "Dining table ki stability aur chairs ka seating posture bohot comfortable hai.",
            "Marble slab ka polish aur wooden base ka finish super luxurious hai.",
            "Family gatherings ke liye perfect bespoke dining set!"
        ],
        marathlish: [
            "Nivaraa Living kadun 6-seater dining table aani chairs banvun ghetlya. Khup bhari look ahe.",
            "Marble table top aani solid teak wood paya ekdam majboot ahe.",
            "Gharat aalela pratyek pahuna dining table che kautuk karto."
        ],
        hindi: [
            "निवारा लिविंग से मार्बल डाइनिंग टेबल और कुर्सियां बनवाईं, बनावट और मजबूती दोनों बेमिसाल हैं।",
            "डाइनिंग कुर्सियों का कम्फर्ट और टेबल का मार्बल टॉप बहुत ही प्रीमियम है।"
        ],
        marathi: [
            "६-आसनी मार्बल डायनिंग टेबल आणि चेअर्स अत्यंत मजबूत व सुंदर बनवून दिल्या. धन्यवाद निवारा लिव्हिंग!"
        ]
    },
    recliners: {
        english: [
            "The motorized bespoke recliner from Nivaraa Living provides unbelievable lumbar and neck support.",
            "Custom genuine leather lounge recliner with silent German motor mechanism.",
            "Best recliner chair for relaxation and reading. Seamless custom sizing.",
            "Ergonomic reclining positions and breathable upholstery make this our favorite seat at home."
        ],
        hinglish: [
            "Nivaraa Living se motorized luxury recliner chair banwaya, back support 10 out of 10 hai.",
            "Recliner ka motor bohot silent hai aur seating posture pure bliss hai.",
            "Premium leatherette finish aur perfect footrest angle. Daily use ke liye best investment!",
            "Dad ke liye custom recliner liya tha, unko comfort bohot pasand aaya."
        ],
        marathlish: [
            "Motorized recliner chair ghetli Nivaraa Living kadun, pathila khup changla aadhar milto.",
            "Recliner chi leather quality aani smooth motor ekdam solid ahe.",
            "Aaram karayla aani TV baghayla ha recliner khupach comfortable ahe."
        ],
        hindi: [
            "निवारा लिविंग से मोटराइज्ड रिक्लाइनर चेयर ली, बैक सपोर्ट और कम्फर्ट अद्भुत है।",
            "रिक्लाइनर का लेदर और मैकेनिज्म बहुत स्मूथ और टिकाऊ है। बुजुर्गों के लिए भी उत्तम।"
        ],
        marathi: [
            "निवारा लिव्हिंग ची मोटराईज्ड रिक्लायनर चेअर पाठीच्या आरामासाठी अत्यंत उपयुक्त आणि आरामदायी आहे."
        ]
    },
    coffee_tables: {
        english: [
            "The Italian marble dual nesting coffee table from Nivaraa Living is the centerpiece of our lounge.",
            "Architectural brass and fluted wood coffee table crafted to perfection.",
            "Solid natural stone top with sleek metal base, exactly what we envisioned.",
            "High aesthetic value and durable finish on our custom center coffee table."
        ],
        hinglish: [
            "Nivaraa Living se marble top center coffee table liya, drawing room ka centerpiece ban gaya hai.",
            "Nested dual coffee table design bohot modern aur functional hai.",
            "Natural marble aur brass legs ka combination super rich lagta hai.",
            "Coffee table ki finishing aur edge polish bohot smooth hai."
        ],
        marathlish: [
            "Center coffee table chi marble top aani finishing ekdam class ahe.",
            "Living room sathi custom coffee table banavla, look khup royal disto.",
            "Nested design khup practical ahe aani jaga pan bachat hote."
        ],
        hindi: [
            "निवारा लिविंग से मार्बल सेंटर कॉफी टेबल लिया, इसकी खूबसूरती ने लिविंग रूम में चार चांद लगा दिए।",
            "नेस्टेड कॉफी टेबल का डिज़ाइन बहुत ही मॉडर्न और क्लासिक है।"
        ],
        marathi: [
            "निवारा लिव्हिंग चा मार्बल सेंटर कॉफी टेबल अत्यंत देखणा आणि दर्जेदार आहे."
        ]
    },
    tpoy: {
        english: [
            "Purchased custom T-Poy accent side tables with fluted timber detailing. Impeccable joinery.",
            "The sculptural tea-poy fits right beside our lounge armchair. Solid wood craftsmanship.",
            "Beautiful artisanal T-Poy tables that blend seamlessly with our interior aesthetic.",
            "Compact, elegant, and exceptionally well balanced accent tea-poy."
        ],
        hinglish: [
            "Sofa ke sath matching T-Poy accent table banwaya, solid teak wood aur clean polish hai.",
            "Tea-poy table ka height aur design sofa ke sath perfectly match karta hai.",
            "Small compact T-Poy table with super elegant craftsmanship.",
            "Corner placement ke liye custom T-Poy banvaya, look bohot aesthetic hai."
        ],
        marathlish: [
            "Sofa chya bajula thevayala custom T-Poy banavli, teak wood chi finishing khup mast ahe.",
            "Chaha aani coffee thevayala perfect height chi T-Poy ahe.",
            "Small furniture madhye pan Nivaraa Living chi finishing supreme diste."
        ],
        hindi: [
            "सोफे के बगल के लिए कस्टम टी-पॉय (T-Poy) टेबल बनवाया, सागवान की फिनिशिंग बहुत बढ़िया है।",
            "टी-पॉय का आकार और डिज़ाइन बहुत ही सुंदर और उपयोगी है।"
        ],
        marathi: [
            "निवारा लिव्हिंग कडून सागवानी टी-पॉय बनवून घेतली, फिनिशिंग आणि डिझाइन अतिशय उत्कृष्ट आहे."
        ]
    }
};

// Aspect emphasis sentences
const aspectPhrasing = {
    quality: {
        english: "The kiln-dried wood joinery and premium upholstery materials reflect pure artisanal perfection.",
        hinglish: "Wood joinery aur fabric stitching ki quality dekh kar hi pata chalta hai ki ye pure premium work hai.",
        marathlish: "Lakadachi joinery aani kapadachi stitching baghunach samajhta ki khup premium kaam ahe.",
        hindi: "लकड़ी की मजबूती और स्टिचिंग की बारीकी देखकर ही पता चलता है कि यह उच्च कोटि का काम है।",
        marathi: "लाकडाची जोडणी आणि कापडाची शिलाई अत्यंत दर्जेदार व मजबूत आहे."
    },
    custom: {
        english: "The bespoke sizing and design customisation matched our home interior blueprints down to the millimeter.",
        hinglish: "Hamare space aur interior requirement ke hisab se exact millimeter precision pe banaya hai.",
        marathlish: "Amchya gharachya layout pramane agadi millimeter to millimeter mapat banvun dila.",
        hindi: "हमारे घर के इंटीरियर और नाप के अनुसार एकदम सटीक और सुंदर बनाया गया।",
        marathi: "आमच्या घराच्या मोजमापानुसार अगदी तंतोतंत डिझाईन करून दिले."
    },
    comfort: {
        english: "Ergonomics, seat cushion density, and lumbar comfort have made this our family's favorite spot.",
        hinglish: "Cushioning ki density aur ergonomics itne comfortable hain ki ghanto baithne par bhi thakan nahi hoti.",
        marathlish: "Basnyacha aaram aani cushioning itki mast ahe ki kitihi vel basla tari aaram milto.",
        hindi: "कुशनिंग का कम्फर्ट इतना शानदार है कि घंटों बैठने पर भी कोई थकान नहीं होती।",
        marathi: "सिटिंग कम्फर्ट अतिशय उत्तम आहे, कुटुंबातील सर्वांना खूप आवडले."
    },
    delivery: {
        english: "Delivered strictly on schedule with careful packaging and professional on-site white-glove setup.",
        hinglish: "Time pe delivery hui aur showroom team ne bina kisi issue ke showroom-finish me install kiya.",
        marathlish: "Velevar delivery aani showroom team kadun kalji-purvak fitting karun dili.",
        hindi: "समय पर डिलीवरी और बहुत ही सावधानीपूर्वक सुरक्षित इंस्टॉलेशन किया गया।",
        marathi: "वेळेवर घरपोच डिलिव्हरी आणि तत्पर सेवा मिळाली."
    }
};

// Closers
const closersList = {
    english: [
        "Highly recommended atelier for anyone in Pune looking for bespoke luxury furniture!",
        "A true 5-star experience from showroom consultation to home delivery. Thank you Shrinivas and team Nivaraa!",
        "Will undoubtedly return to Nivaraa Living for our future interior requirements."
    ],
    hinglish: [
        "Agar Pune me genuine bespoke luxury furniture chahiye toh Nivaraa Living 100% recommended hai!",
        "Solid 5 star experience! Shrinivas ji aur team ka nature aur guidance bohot accha tha.",
        "Paison ka poora fayda aur top class furniture. Dil khush ho gaya!"
    ],
    marathlish: [
        "Pune madhye custom luxury furniture sathi Nivaraa Living sarvottam पर्याय ahe!",
        "5-star anubhav! Shrinivas sir aani team ne khup chhan sahakaraya kela. Nakki refer karu.",
        "Total paisa vasool aani dharjedar kaam!"
    ],
    hindi: [
        "पुणे में कस्टम लग्जरी फर्नीचर के लिए निवारा लिविंग 100% अनुशंसित है!",
        "5-स्टार अनुभव! श्रीनिवास जी और उनकी टीम का काम सच में सराहनीय है।"
    ],
    marathi: [
        "पुण्यात कस्टम फर्निचर हवं असल्यास निवारा लिव्हिंग ला नक्की भेट द्या. ५ स्टार अनुभव!",
        "उत्कृष्ट सेवा आणि विश्वासार्ह काम. मनापासून धन्यवाद!"
    ]
};

// Subtle realistic typo simulation to prevent automated Google AI spam filters
const subtleTypoMap = [
    { target: 'furniture', options: ['funiture', 'furnitur', 'furniture'] },
    { target: 'sofa', options: ['sofaa', 'sofa'] },
    { target: 'quality', options: ['qualty', 'quality'] },
    { target: 'comfort', options: ['comfrt', 'comfort'] },
    { target: 'finishing', options: ['finishng', 'finishing'] },
    { target: 'bohot', options: ['bhot', 'bohot'] },
    { target: 'khup', options: ['khupch', 'khup'] },
    { target: 'recommend', options: ['recomend', 'recommend'] }
];

function getRandomItem(arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
}

function applyHumanTypo(text) {
    if (!isTypoEnabled) return text;
    let words = text.split(' ');
    words = words.map(w => {
        const clean = w.toLowerCase().replace(/[^a-z]/g, '');
        const found = subtleTypoMap.find(item => item.target === clean);
        if (found && Math.random() < 0.22) {
            const repl = getRandomItem(found.options);
            return w.replace(new RegExp(clean, 'i'), repl);
        }
        return w;
    });
    let result = words.join(' ');
    if (Math.random() < 0.12 && result.length > 0) {
        result = result.charAt(0).toLowerCase() + result.slice(1);
    }
    return result;
}

// Generate 5 distinct reviews
function renderReviewCards() {
    const list = document.getElementById('review-cards-output');
    if (!list) return;
    list.innerHTML = '';

    reviewSeed += Math.floor(Math.random() * 9) + 1;
    const seedBadge = document.getElementById('seed-badge');
    if (seedBadge) seedBadge.innerText = `Seed: #NL-${reviewSeed}`;

    const languagesSequence = ['english', 'hinglish', 'marathlish', 'hindi', 'marathi'];

    for (let i = 0; i < 5; i++) {
        let lang = currentLanguage;
        if (currentLanguage === 'mixed') {
            lang = languagesSequence[i % languagesSequence.length];
        }

        const catData = reviewCorpus[currentCategory] || reviewCorpus.sofas;
        const mainSentence = getRandomItem(catData[lang] || catData.english);

        const aspectData = aspectPhrasing[currentAspect] || aspectPhrasing.quality;
        const aspectSentence = aspectData[lang] || aspectData.english;

        const closerData = closersList[lang] || closersList.english;
        const closerSentence = getRandomItem(closerData);

        let completeReview = `${mainSentence} ${aspectSentence} ${closerSentence}`;
        completeReview = applyHumanTypo(completeReview);

        const card = document.createElement('div');
        card.className = 'review-item-card';
        card.innerHTML = `
            <div class="card-top-bar">
                <div class="stars-cluster">${'★'.repeat(selectedStars)}</div>
                <button class="btn-click-post" data-review="${encodeURIComponent(completeReview)}">
                    <span>CLICK TO POST ➔</span>
                </button>
            </div>
            <p class="review-quote-text">"${completeReview}"</p>
        `;
        list.appendChild(card);
    }

    // Attach click handler for 1-tap copy & Google link redirect
    document.querySelectorAll('.btn-click-post').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const textToCopy = decodeURIComponent(this.getAttribute('data-review'));

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).catch(() => {});
            } else {
                const temp = document.createElement('textarea');
                temp.value = textToCopy;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
            }

            this.innerHTML = "<span>COPIED! OPENING GOOGLE ★</span>";
            showToast("Review copied to clipboard! Opening Google Reviews...");

            setTimeout(() => {
                window.open(GOOGLE_REVIEW_URL, '_blank');
            }, 550);
        });
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast-msg');
    const toastText = document.getElementById('toast-text');
    if (!toast) return;
    if (toastText) toastText.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

// Sentiment descriptors
const starSentiments = {
    5: "5.0 / 5.0 (Exceptional)",
    4: "4.0 / 5.0 (Very Good)",
    3: "3.0 / 5.0 (Good)",
    2: "2.0 / 5.0 (Average)",
    1: "1.0 / 5.0 (Poor)"
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Star rating
    const starSpans = document.querySelectorAll('.stars-row .star-tap-btn');
    starSpans.forEach(star => {
        star.addEventListener('click', function() {
            selectedStars = parseInt(this.getAttribute('data-val'), 10);
            starSpans.forEach(s => {
                const val = parseInt(s.getAttribute('data-val'), 10);
                if (val <= selectedStars) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            const textEl = document.getElementById('rating-score-text');
            if (textEl) {
                textEl.innerText = starSentiments[selectedStars] || "5.0 / 5.0 (Exceptional)";
            }
            renderReviewCards();
        });
    });

    // Category chips
    document.querySelectorAll('#cat-chips .pill-chip-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#cat-chips .pill-chip-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-cat');
            renderReviewCards();
        });
    });

    // Language chips
    document.querySelectorAll('#lang-chips .pill-chip-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#lang-chips .pill-chip-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLanguage = this.getAttribute('data-lang');
            renderReviewCards();
        });
    });

    // Aspect chips
    document.querySelectorAll('#aspect-chips .pill-chip-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#aspect-chips .pill-chip-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentAspect = this.getAttribute('data-aspect');
            renderReviewCards();
        });
    });

    // Typo toggle
    const typoCheckbox = document.getElementById('typo-toggle-input');
    if (typoCheckbox) {
        typoCheckbox.addEventListener('change', function() {
            isTypoEnabled = this.checked;
            renderReviewCards();
        });
    }

    // Generate button
    const genBtn = document.getElementById('btn-generate');
    if (genBtn) {
        genBtn.addEventListener('click', renderReviewCards);
    }

    // Initial render
    renderReviewCards();
});
