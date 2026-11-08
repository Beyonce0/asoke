import type { Dictionary } from "./en";

/*
 * Nigerian Pidgin (Naijá). Machine-drafted — have a native speaker read it
 * before launch. Brand names (ÀṢỌKÉ, Paystack) and place names stay as they
 * are.
 */

export const pcm: Dictionary = {
  meta: {
    shop: "Shop",
    shopDescription:
      "All our pieces, wey dem weave with hand from Yoruba aso-oke.",
    craft: "Di work",
    craftDescription:
      "How dem dey weave aso-oke, who dey weave am, and why we dey cut am di way we dey cut am.",
    book: "Book visit",
    bookDescription:
      "Ask for consultation or fitting for di ÀṢỌKÉ atelier for Lagos.",
    contact: "Contact us",
    contactDescription: "Reach di ÀṢỌKÉ atelier.",
    bag: "Your bag",
    checkout: "Pay",
    confirm: "Order don confirm",
    signIn: "Sign in",
    signUp: "Open account",
    account: "Your account",
    orders: "Your orders",
    notFound: "We no see am",
  },

  /** The line under the wordmark, in the header and on the opening curtain. */
  brand: {
    tagline: "We Weave Am For Her",
  },

  language: {
    label: "Language",
  },

  nav: {
    shop: "Shop",
    scarves: "Scarf Dem",
    craft: "Di Work",
    book: "Book Visit",
    contact: "Contact Us",
    openMenu: "Open menu",
    account: "Account",
    home: "ÀṢỌKÉ, {tagline}, go house",
    bagOne: "Bag, 1 tin",
    bagMany: "Bag, {count} tins",
  },

  footer: {
    blurb:
      "Cloth wey dem weave for Yoruba loom, cut for di woman wey dey carry her culture go front.",
    shop: "Shop",
    house: "House",
    care: "Care",
    allPieces: "All di pieces",
    scarves: "Scarf dem",
    readyToWear: "Ready to wear",
    craft: "Di work",
    book: "Book visit",
    contact: "Contact us",
    shipping: "Delivery",
    returns: "Return am",
    privacy: "Privacy",
    tagline: "We weave am for her.",
    place: "Lagos, Naija · Paystack dey secure di payment",
  },

  bag: {
    title: "Your bag",
    close: "Close bag",
    empty: "Nothing dey your bag.",
    browse: "Check di collection",
    loading: "Your bag dey load…",
    decrease: "Reduce am",
    increase: "Add more",
    remove: "Comot am",
    summary: "Summary",
    subtotal: "Subtotal",
    shippingNote: "We go calculate delivery money when you wan pay.",
    checkout: "Pay",
    viewFull: "See di whole bag",
  },

  product: {
    select: "Choose",
    addToBag: "Put am for bag",
    soldOut: "E don finish",
    unavailable: "You never fit order dis piece yet.",
    onlyLeft:
      "Na only {count} remain. After dis one, na when you order we go weave am.",
    addNamed: "Put {name} for bag",
    soldOutNamed: "{name} don finish",
    imageComing: "Picture dey come",
    story: "Im story",
    front: "Front",
    back: "Back",
    detail: "Detail",
    inMotion: "As e dey move",
    emptyGrid: "New pieces dey for loom. Come back soon.",
  },

  home: {
    thisSeason: "Dis season",
    viewAll: "See all",

    hero: {
      eyebrow: "Dem weave am with hand for Naija",
      titleLead: "We weave am for her,",
      titleTail: "thread by thread.",
      body: "Aso-oke na cloth wey get memory, strips wey dem weave for narrow loom, wey Yoruba woman dey wear for every big step for her life. We dey cut am for how she dey live now.",
      explore: "Check di collection",
      craft: "Di work",
      scroll: "Scroll",
      scrollLabel: "Scroll go di collection",
    },

    showcase: {
      label: "Di collection, for five colour",
      plateAlt: "Di collection for five colour",
      eyebrow: "One cloth, every occasion",
      title: "From bespoke reach bridal.",
      body: "Na one material, and we no gree make am small. Di same cloth wey dem weave with hand fit turn bridal set wey we measure for eight weeks, wrapper skirt for ordinary Tuesday, gèlè wey dem tie for naming ceremony, jacket wey dey go work on Monday. Bespoke, ready-to-wear and full bridal, every piece na for women, every metre na Yoruba narrow loom weave am.",
      footnote: "Five women · Five colour · One cloth",
      cta: "See di collection",
    },

    pieces: {
      label: "Pieces",
      eyebrow: "Di pieces",
      title: "Latest collection of ASỌKÉ",
    },

    bespoke: {
      eyebrow: "Bespoke",
      title: "Your cloth. Your shape. Your story.",
      body: "Nothing here we dey make two times. Bespoke work dey start with cloth and e go end with piece wey we cut for only your measurement, four steps, and di atelier go waka all of dem with you.",
      cta: "Start your own",
      stages: [
        {
          title: "Choose your cloth",
          copy: "Aṣọ-òkè, adire, akwa ocha, akwete. Cloth wey dem weave with hand, pick am from loom, colour, weight and weave, we go choose dem before we cut anything.",
        },
        {
          title: "Talk your shape",
          copy: "Di occasion, how e go fit you, di vibe. Tell us where di piece dey go and we go cut am for dat room, dat light, dat day.",
        },
        {
          title: "We go make am",
          copy: "We go cut your piece, sew am and finish am with hand for di atelier. We join di strips, fold di edge, close every seam di traditional way.",
        },
        {
          title: "E don reach you",
          copy: "We iron am, wrap am, send am give you, e don finish, e ready for di moment wey we make am for.",
        },
      ],
    },

    craft: {
      label: "Di work",
      eyebrow: "Di work",
      title: "Before e turn cloth, na story e first be.",
      body1:
        "Aso-oke dey comot from narrow loom as strips wey no too pass your hand for width. Dem dey weave each one, cut am, join am with hand, one metre of cloth fit take weaver two days. We dey work with weaving families for Iseyin and Ilorin, and we dey pay by strip, no be by hour.",
      body2:
        "Wetin dey change na di cut. Di loom don dey for four hundred years but di style no old like dat: di same cloth wey grandma wear for her wedding, na im we join here make am jacket for Tuesday. We no reduce anything for di weaving to fit do am.",
      cta: "Meet di weavers",
      imageAlt:
        "Aso-oke for narrow loom, as dem dey weave am, near thread, scissors and brass plate",
      hands: ["Weave", "Fold", "Embroider", "Stitch", "Drape", "Style"],
    },

    timeline: {
      eyebrow: "From atelier reach you",
      title: "Five stops between di loom and your door.",
      stops: [
        {
          title: "Consultation",
          copy: "We go collect your idea, your measurement and di date wey e must ready.",
        },
        {
          title: "Choose cloth",
          copy: "We go pick di cloth from loom, weave, weight and colour, we go settle dem before we cut.",
        },
        {
          title: "Sewing",
          copy: "Your piece don enter work. We dey join di strips and di shape dey come out.",
        },
        {
          title: "Finishing",
          copy: "We fold di edge, put lining, and di same hand wey make am go check every small detail.",
        },
        {
          title: "Delivery",
          copy: "We iron am, wrap am, send am, you fit track am reach your door, anywhere we dey deliver.",
        },
      ],
      turnaround: "Normal time e dey take:",
      defaultTurnaround: "7–14 working days",
      note: "Bespoke work fit take more time depending on how hard e be. We go agree one date with you for consultation and we go hold am.",
    },

    moments: {
      eyebrow: "For every moment",
      title: "One cloth. Plenty ways.",
      items: [
        { label: "Di bride", copy: "For wedding and traditional ceremony." },
        { label: "Di guest", copy: "Correct looks for party." },
        { label: "Every day", copy: "Modern pieces wey get culture for root." },
        { label: "Di modern woman", copy: "Styles wey dey front for fashion." },
      ],
    },

    reach: {
      label: "Contact us",
      eyebrow: "Contact us",
      title: "Write di atelier.",
      body: "Question about one piece, size, bespoke work or order wey dey road. Send am here and person from di atelier go answer inside one working day.",
      hours: "Opening time",
      visit: "Where we dey",
      book: "Book visit",
    },
  },

  about: {
    eyebrow: "Di work",
    title: "Cloth wey remember where e come from.",
    intro:
      "Àṣọ òkè mean “top cloth”, di cloth wey you dey wear for outside, di one wey people dey see. For many generations na im dey mark di biggest days for woman life. We believe say e deserve di ordinary days too.",
    chapters: [
      {
        title: "Di loom",
        body: "Di Yoruba narrow loom dey make cloth wey be like four inches wide. Anything wey big pass scarf na joining work, dem dey weave strips one by one, then arrange am and join am so di pattern go flow like one. If di arrangement miss by one thread, di whole cloth go show am.",
      },
      {
        title: "Di weavers",
        body: "We dey buy from weaving families for Iseyin and Ilorin, towns wey di work dey pass from parent to pikin for house, no be for school. We dey order by strip and pay when dem deliver, so slow week for loom no go mean say person lose im pay.",
      },
      {
        title: "Di cut",
        body: "Aso-oke don always be ceremony cloth, dem dey wear am for wedding, naming ceremony, burial. We dey cut am for ordinary days too: scarf wey fit sit under collar, wrapper skirt wey dey move, jacket wey no dey shout until you look am well.",
      },
    ],
    closing: "Every piece dey carry di hand wey make am.",
    cta: "See di collection",
  },

  shop: {
    title: "Di collection",
    all: "All",
  },

  contact: {
    title: "Contact us",
    intro:
      "For bespoke work, advice on size, or anything about order wey you don already put, write us. We dey answer inside one working day.",
    orders: "Orders & size",
    whatsapp: "WhatsApp",
    phone: "Phone",
    instagram: "Instagram",
    atelier: "Di atelier",
    place: "Lagos, Naija",
    byAppointment: "Na by appointment only",
    book: "Book visit",
    shipping:
      "We dey send pieces from Lagos. Delivery dey take 2–4 working days inside Naija, e dey take longer for cloth wey we go weave after you order.",
  },

  book: {
    title: "Book visit",
    intro:
      "Di atelier dey work by appointment. Come choose cloth, talk about bespoke work, or come make we measure you for piece wey don ready.",
    note: "Choose di time wey good for you and we go confirm am, or give you di nearest one wey dey free, inside one working day. All di time na Lagos time.",
    visit: "Di visit",
    visitPlaceholder: "Wetin e be for?",
    minutes: "min",
    date: "Date",
    time: "Time · Lagos",
    timePlaceholder: "Choose time",
    details: "Your details",
    fullName: "Your full name",
    email: "Email address",
    phone: "Phone (if you like)",
    notes:
      "Anything wey we suppose know, di occasion, di piece wey dey your mind, cloth wey you dey bring come",
    submit: "Book dis visit",
    sending: "E dey send…",
    thanksTitle: "Thank you",
    thanksBody:
      "We don get your request: {visit}, {when}. Di atelier go confirm di time with you by email or phone inside one working day.",
    kinds: {
      "Bespoke consultation": "Bespoke consultation",
      "Fabric consultation": "Cloth consultation",
      "Wedding consultation": "Wedding consultation",
      Fitting: "Fitting",
    },
    errors: {
      name: "Tell us your name.",
      email: "Put correct email address.",
      kind: "Choose wetin di visit be for.",
      date: "Choose date.",
      time: "Choose time.",
      tooSoon: "Choose date from tomorrow go front.",
      tooFar:
        "Our diary open reach {days} days from now. Choose date wey near pass.",
      notConnected:
        "Booking never connect, put your Supabase keys for .env.local make e fit collect requests.",
      failed: "We no fit send your request. Abeg try again small time.",
    },
  },

  enquiry: {
    fullName: "Your full name",
    email: "Email address",
    phone: "Phone (if you like)",
    subject: "Wetin e concern (if you like)",
    message: "Your message",
    submit: "Send message",
    sending: "E dey send…",
    thanksTitle: "Message don go",
    thanksBody:
      "Thank you, {name}. We go reply {email} inside one working day.",
    privacyNote: "We go use your details only to answer your question.",
    errors: {
      name: "Tell us your name.",
      email: "Put correct email address.",
      message: "Write message wey reach at least 10 letters.",
      notConnected:
        "Messages never connect. Put your Supabase keys for .env.local make e fit receive dem.",
      failed: "Sorry, your message no go. Abeg send email to {email}.",
    },
  },

  checkout: {
    title: "Pay",
    contact: "Contact",
    email: "Email address",
    fullName: "Your full name",
    phone: "Phone number",
    delivery: "Delivery",
    street: "Street address",
    apartment: "Flat, room (if e dey)",
    city: "City",
    state: "State",
    yourOrder: "Your order",
    subtotal: "Subtotal",
    chooseState: "Choose state",
    total: "Total",
    plusDelivery: "{amount} + delivery",
    deliveryNote:
      "Delivery na ₦2,500 inside Lagos and ₦5,000 for other places for Naija.",
    pay: "Pay with Paystack",
    opening: "Paystack dey open…",
    redirectNote: "We go carry you go Paystack make you pay safe.",
    errors: {
      details: "Check your details.",
      fields: {
        email: "Put correct email address.",
        fullName: "Put your full name.",
        phone: "Put phone number wey we fit call.",
        street: "Put your street address.",
        city: "Put your city.",
        state: "Choose your state.",
        empty: "Nothing dey your bag.",
      },
      notConnected:
        "Payment never connect, put your Supabase and Paystack keys for .env.local make e fit collect real money.",
      price: "We no fit calculate di price for your bag. Abeg try again.",
      unavailable: "One tin for your bag no dey again.",
      stock: "{name} no get enough remain again.",
      open: "We no fit open your order. Abeg try again.",
      save: "We no fit save your order. Abeg try again.",
      payment: "Payment no fit start. Abeg try again.",
    },
  },

  confirm: {
    failedEyebrow: "Payment never confirm",
    failedTitle: "Something stop your order.",
    failures: {
      "unknown-order": "We no fit find dat order. Abeg contact us.",
      "not-successful": "Your payment no go through. Dem no remove any money.",
      "amount-mismatch":
        "Di money wey you pay no match your order. We don tell our team and dem go reach you.",
      error: "We never fit confirm your payment. Abeg contact us.",
    },
    tryAgain: "Try again",
    contactUs: "Contact us",
    okEyebrow: "We don receive di money",
    okTitle: "Thank you. We dey prepare your cloth.",
    okBefore: "Confirmation dey come your email. Your order number na",
    okAfter: "Keep am for any talk wey you go get with us.",
    viewOrders: "See your orders",
    continue: "Continue to shop",
  },

  auth: {
    signInTitle: "Welcome back",
    signInSub: "Sign in make you see your orders and di address wey you save.",
    signIn: "Sign in",
    newHere: "You be new person?",
    createLink: "Open account",
    signUpTitle: "Open account",
    signUpSub: "Track your orders and pay quick next time.",
    createAccount: "Open account",
    haveOne: "You don get one?",
    fullName: "Your full name",
    email: "Email address",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    wait: "Hold on small…",
    confirmNotice: "Check your email make you confirm am, then sign in.",
    errors: {
      email: "Put correct email address.",
      password: "Password must reach at least 8 letters.",
      unconfirmed: "Confirm your email first, check your inbox.",
      rateLimit: "You don try too many times. Wait one minute, then try again.",
      mismatch: "Dat email and password no match.",
    },
  },

  account: {
    title: "Your account",
    details: "Details",
    email: "Email",
    phone: "Phone",
    signOut: "Sign out",
    orders: "Orders",
    ordersBody: "Every piece wey you don order, and where e dey now.",
    viewOrders: "See orders",
    atelier: "Atelier",
    atelierBody: "Di dashboard, products, orders, bespoke work and di diary.",
    dashboard: "Open di dashboard",
  },

  orders: {
    title: "Your orders",
    none: "You never order anything yet.",
    browse: "Check di collection",
    stages: {
      pending: "E dey wait for payment",
      processing: "We dey prepare am",
      cutting: "We dey cut di cloth",
      fitting: "E dey for fitting",
      finishing: "Last touches",
      ready: "E ready to send",
      shipped: "E dey road",
      delivered: "E don reach",
      cancelled: "E don cancel",
    },
  },

  notFound: {
    title: "Dis thread no dey lead anywhere.",
    home: "Go back house",
  },
};
