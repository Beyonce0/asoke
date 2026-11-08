/*
 * The source dictionary. Every other language is typed against this one, so a
 * key added here and forgotten elsewhere fails the typecheck rather than
 * rendering a blank on the page.
 *
 * `{name}` placeholders are filled by `fill()` in `i18n/config.ts`.
 */

export const en = {
  meta: {
    shop: "Shop",
    shopDescription: "Every piece, handwoven from Yoruba aso-oke.",
    craft: "The craft",
    craftDescription:
      "How aso-oke is woven, who weaves it, and why we cut it the way we do.",
    book: "Book a visit",
    bookDescription:
      "Request a consultation or fitting at the ÀṢỌKÉ atelier in Lagos.",
    contact: "Contact",
    contactDescription: "Reach the ÀṢỌKÉ atelier.",
    bag: "Your bag",
    checkout: "Checkout",
    confirm: "Order confirmation",
    signIn: "Sign in",
    signUp: "Create an account",
    account: "Your account",
    orders: "Your orders",
    notFound: "Not found",
  },

  /** The line under the wordmark, in the header and on the opening curtain. */
  brand: {
    tagline: "Woven For Her",
  },

  language: {
    label: "Language",
  },

  nav: {
    shop: "Shop",
    scarves: "Scarves",
    craft: "The Craft",
    book: "Book a Visit",
    contact: "Contact",
    openMenu: "Open menu",
    account: "Account",
    home: "ÀṢỌKÉ, {tagline}, home",
    bagOne: "Bag, 1 item",
    bagMany: "Bag, {count} items",
  },

  footer: {
    blurb:
      "Cloth woven on Yoruba looms, cut for the woman who wears her heritage forward.",
    shop: "Shop",
    house: "House",
    care: "Care",
    allPieces: "All pieces",
    scarves: "Scarves",
    readyToWear: "Ready to wear",
    craft: "The craft",
    book: "Book a visit",
    contact: "Contact",
    shipping: "Shipping",
    returns: "Returns",
    privacy: "Privacy",
    tagline: "Woven for her.",
    place: "Lagos, Nigeria · Secured by Paystack",
  },

  bag: {
    title: "Your bag",
    close: "Close bag",
    empty: "Your bag is empty.",
    browse: "Browse the collection",
    loading: "Loading your bag…",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    remove: "Remove",
    summary: "Summary",
    subtotal: "Subtotal",
    shippingNote: "Shipping calculated at checkout.",
    checkout: "Checkout",
    viewFull: "View full bag",
  },

  product: {
    select: "Select",
    addToBag: "Add to bag",
    soldOut: "Sold out",
    unavailable: "This piece is not available to order yet.",
    onlyLeft: "Only {count} left. After this, each piece is woven to order.",
    addNamed: "Add {name} to bag",
    soldOutNamed: "{name} is sold out",
    imageComing: "Image coming",
    story: "Its story",
    front: "Front",
    back: "Back",
    detail: "Detail",
    inMotion: "In motion",
    emptyGrid: "New pieces are on the loom. Check back shortly.",
  },

  home: {
    thisSeason: "This season",
    viewAll: "View all",

    hero: {
      eyebrow: "Handwoven in Nigeria",
      titleLead: "Woven for her,",
      titleTail: "thread by thread.",
      body: "Aso-oke is cloth with memory: strips woven on narrow looms, worn at every threshold a Yoruba woman crosses. We cut it for the way she lives now.",
      explore: "Explore collection",
      craft: "The craft",
      scroll: "Scroll",
      scrollLabel: "Scroll to the collection",
    },

    showcase: {
      label: "The collection, in five colourways",
      plateAlt: "The collection shown across five colourways",
      eyebrow: "One cloth, every occasion",
      title: "From bespoke to bridal.",
      body: "One material, and a refusal to be narrow with it. The same handwoven cloth becomes a bridal set measured over eight weeks, a wrap skirt for an ordinary Tuesday, a gèlè tied for a naming ceremony, a jacket that goes to work on Monday. Bespoke commissions, ready-to-wear and full bridal. Every piece cut for women, every metre woven on a Yoruba narrow loom.",
      footnote: "Five women · Five colourways · One cloth",
      cta: "See the collection",
    },

    pieces: {
      label: "Pieces",
      eyebrow: "The pieces",
      title: "Latest collection of ASỌKÉ",
    },

    bespoke: {
      eyebrow: "Bespoke",
      title: "Your fabric. Your silhouette. Your story.",
      body: "Nothing here is made twice. A commission begins with cloth and ends with a piece cut to one set of measurements. Four steps, and the atelier walks all of them with you.",
      cta: "Begin a commission",
      stages: [
        {
          title: "Choose your fabric",
          copy: "Aṣọ-òkè, adire, akwa ocha, akwete. Handwoven cloth, picked off the loom by hand. Colour, weight and weave are chosen before anything is cut.",
        },
        {
          title: "Define your silhouette",
          copy: "The occasion, the fit, the mood. Tell us where the piece is going and it is cut for that room, that light, that day.",
        },
        {
          title: "We craft",
          copy: "Your piece is cut, tailored and finished by hand in the atelier. Strips joined, edges turned, every seam closed the traditional way.",
        },
        {
          title: "Delivered",
          copy: "Pressed, wrapped and sent to you, finished and ready for the moment it was made for.",
        },
      ],
    },

    craft: {
      label: "The craft",
      eyebrow: "The craft",
      title: "Before it becomes an outfit, it begins as a story.",
      body1:
        "Aso-oke comes off a narrow loom in strips barely wider than a hand. Each one is woven, cut, and joined by hand. A metre of cloth can take a weaver two days. We work with weaving families in Iseyin and Ilorin, and we pay by the strip, not by the hour.",
      body2:
        "What changes is the cut. The loom is four hundred years old and the silhouette is not: the same cloth that dressed a grandmother for her wedding is joined here into a jacket cut for a Tuesday. Nothing about the technique is softened to make that work.",
      cta: "Meet the weavers",
      imageAlt:
        "A length of aso-oke on the narrow loom, mid-weave, beside spools, shears and a brass dish",
      hands: ["Woven", "Folded", "Embroidered", "Stitched", "Draped", "Styled"],
    },

    timeline: {
      eyebrow: "From atelier to you",
      title: "Five stops between the loom and your door.",
      stops: [
        {
          title: "Consultation",
          copy: "We take your vision, your measurements and the date it has to be ready for.",
        },
        {
          title: "Fabric selection",
          copy: "Cloth is chosen off the loom. Weave, weight and colour are settled before a cut is made.",
        },
        {
          title: "Tailoring",
          copy: "Your piece enters production. Strips are joined and the silhouette takes shape.",
        },
        {
          title: "Finishing",
          copy: "Edges turned, linings set, every detail inspected by the hand that made it.",
        },
        {
          title: "Delivery",
          copy: "Pressed, wrapped and sent, then tracked to your door anywhere we ship.",
        },
      ],
      turnaround: "Typical turnaround:",
      defaultTurnaround: "7–14 working days",
      note: "Bespoke commissions may require additional time depending on complexity. We confirm a date with you at consultation and hold to it.",
    },

    moments: {
      eyebrow: "For every moment",
      title: "One fabric. Many expressions.",
      items: [
        {
          label: "The bride",
          copy: "For weddings and traditional ceremonies.",
        },
        { label: "The guest", copy: "Statement looks for celebrations." },
        {
          label: "The everyday",
          copy: "Contemporary pieces with cultural roots.",
        },
        { label: "The modern woman", copy: "Fashion-forward silhouettes." },
      ],
    },

    reach: {
      label: "Contact us",
      eyebrow: "Contact us",
      title: "Write to the atelier.",
      body: "A question about a piece, a size, a commission or an order already on its way. Send it here and someone at the atelier replies within one working day.",
      hours: "Hours",
      visit: "Where we are",
      book: "Book a visit",
    },
  },

  about: {
    eyebrow: "The craft",
    title: "Cloth that remembers where it came from.",
    intro:
      "Àṣọ òkè means “top cloth”: the cloth you wear on the outside, the one people see. For generations it marked the biggest days of a woman’s life. We think it deserves the ordinary ones as well.",
    chapters: [
      {
        title: "The loom",
        body: "The Yoruba narrow loom produces cloth roughly four inches wide. Everything larger than a scarf is an act of assembly: strips woven one at a time, then aligned and joined so the pattern reads as continuous. Get the alignment wrong by a thread and the whole panel shows it.",
      },
      {
        title: "The weavers",
        body: "We buy from weaving families in Iseyin and Ilorin, towns where the craft passes down inside households rather than schools. We commission by the strip and pay on delivery, so a slow week at the loom is not a lost wage.",
      },
      {
        title: "The cut",
        body: "Aso-oke has always been ceremonial cloth, worn at weddings, naming ceremonies, burials. We cut it for Tuesdays too: scarves that sit under a collar, wrap skirts that move, jackets that do not announce themselves until you look closely.",
      },
    ],
    closing: "Every piece carries the hand that made it.",
    cta: "See the collection",
  },

  shop: {
    title: "The collection",
    all: "All",
  },

  contact: {
    title: "Contact",
    intro:
      "For bespoke commissions, sizing advice, or anything about an order already placed, write to us. We answer within one working day.",
    orders: "Orders & sizing",
    whatsapp: "WhatsApp",
    phone: "Phone",
    instagram: "Instagram",
    atelier: "The atelier",
    place: "Lagos, Nigeria",
    byAppointment: "By appointment only",
    book: "Book a visit",
    shipping:
      "Pieces ship from Lagos. Delivery is 2–4 working days within Nigeria, longer for woven-to-order commissions.",
  },

  book: {
    title: "Book a visit",
    intro:
      "The atelier works by appointment. Come to choose cloth, talk through a commission, or be fitted for a piece already in hand.",
    note: "Choose the hour that suits you and we will confirm it, or offer the nearest one free, within one working day. All times are Lagos time.",
    visit: "The visit",
    visitPlaceholder: "What is it for?",
    minutes: "min",
    date: "Date",
    time: "Time · Lagos",
    timePlaceholder: "Choose a time",
    details: "Your details",
    fullName: "Full name",
    email: "Email address",
    phone: "Phone (optional)",
    notes:
      "Anything we should know: the occasion, a piece you have in mind, cloth you are bringing",
    submit: "Request this visit",
    sending: "Sending…",
    thanksTitle: "Thank you",
    thanksBody:
      "We have your request: {visit}, {when}. The atelier will confirm the time with you by email or phone within one working day.",
    kinds: {
      "Bespoke consultation": "Bespoke consultation",
      "Fabric consultation": "Fabric consultation",
      "Wedding consultation": "Wedding consultation",
      Fitting: "Fitting",
    },
    errors: {
      name: "Tell us your name.",
      email: "Enter a valid email address.",
      kind: "Choose what the visit is for.",
      date: "Choose a date.",
      time: "Choose a time.",
      tooSoon: "Choose a date from tomorrow onwards.",
      tooFar: "The diary is open {days} days ahead. Choose an earlier date.",
      notConnected:
        "Booking is not connected yet. Add your Supabase keys to .env.local to take requests.",
      failed: "We could not send your request. Please try again in a moment.",
    },
  },

  enquiry: {
    fullName: "Full name",
    email: "Email address",
    phone: "Phone (optional)",
    subject: "Subject (optional)",
    message: "Your message",
    submit: "Send message",
    sending: "Sending…",
    thanksTitle: "Message sent",
    thanksBody:
      "Thank you, {name}. We will reply to {email} within one working day.",
    privacyNote: "We use your details only to reply to your enquiry.",
    errors: {
      name: "Tell us your name.",
      email: "Enter a valid email address.",
      message: "Write a message of at least 10 characters.",
      notConnected:
        "Messages are not connected yet. Add your Supabase keys to .env.local to receive them.",
      failed: "Sorry, your message didn't go through. Please email {email}.",
    },
  },

  checkout: {
    title: "Checkout",
    contact: "Contact",
    email: "Email address",
    fullName: "Full name",
    phone: "Phone number",
    delivery: "Delivery",
    street: "Street address",
    apartment: "Apartment, suite (optional)",
    city: "City",
    state: "State",
    yourOrder: "Your order",
    subtotal: "Subtotal",
    chooseState: "Choose a state",
    total: "Total",
    plusDelivery: "{amount} + delivery",
    deliveryNote:
      "Delivery is ₦2,500 within Lagos and ₦5,000 elsewhere in Nigeria.",
    pay: "Pay with Paystack",
    opening: "Opening Paystack…",
    redirectNote: "You will be redirected to Paystack to pay securely.",
    errors: {
      details: "Check your details.",
      fields: {
        email: "Enter a valid email address.",
        fullName: "Enter your full name.",
        phone: "Enter a reachable phone number.",
        street: "Enter your street address.",
        city: "Enter your city.",
        state: "Select your state.",
        empty: "Your bag is empty.",
      },
      notConnected:
        "Checkout is not connected yet. Add your Supabase and Paystack keys to .env.local to take real payments.",
      price: "We could not price your bag. Please try again.",
      unavailable: "An item in your bag is no longer available.",
      stock: "{name} does not have enough stock left.",
      open: "We could not open your order. Please try again.",
      save: "We could not save your order. Please try again.",
      payment: "Payment could not be started. Please try again.",
    },
  },

  confirm: {
    failedEyebrow: "Payment not confirmed",
    failedTitle: "Something interrupted your order.",
    failures: {
      "unknown-order": "We could not find that order. Please contact us.",
      "not-successful": "Your payment did not go through. Nothing was charged.",
      "amount-mismatch":
        "The amount paid does not match your order. Our team has been alerted and will reach out.",
      error: "We could not confirm your payment yet. Please contact us.",
    },
    tryAgain: "Try again",
    contactUs: "Contact us",
    okEyebrow: "Payment received",
    okTitle: "Thank you. Your cloth is being prepared.",
    okBefore:
      "A confirmation is on its way to your inbox. Your order reference is",
    okAfter: "Keep it for any correspondence with us.",
    viewOrders: "View your orders",
    continue: "Continue shopping",
  },

  auth: {
    signInTitle: "Welcome back",
    signInSub: "Sign in to see your orders and saved addresses.",
    signIn: "Sign in",
    newHere: "New here?",
    createLink: "Create an account",
    signUpTitle: "Create an account",
    signUpSub: "Track your orders and check out faster next time.",
    createAccount: "Create account",
    haveOne: "Already have one?",
    fullName: "Full name",
    email: "Email address",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    wait: "One moment…",
    confirmNotice: "Check your inbox to confirm your email, then sign in.",
    errors: {
      email: "Enter a valid email address.",
      password: "Passwords must be at least 8 characters.",
      unconfirmed: "Confirm your email address first. Check your inbox.",
      rateLimit: "Too many attempts. Wait a minute and try again.",
      mismatch: "That email and password do not match.",
    },
  },

  account: {
    title: "Your account",
    details: "Details",
    email: "Email",
    phone: "Phone",
    signOut: "Sign out",
    orders: "Orders",
    ordersBody: "Every piece you have ordered, with its current status.",
    viewOrders: "View orders",
    atelier: "Atelier",
    atelierBody: "The dashboard: products, orders, commissions and the diary.",
    dashboard: "Open the dashboard",
  },

  orders: {
    title: "Your orders",
    none: "You have not ordered yet.",
    browse: "Browse the collection",
    stages: {
      pending: "Awaiting payment",
      processing: "Being prepared",
      cutting: "Cloth being cut",
      fitting: "In fitting",
      finishing: "Final touches",
      ready: "Ready to send",
      shipped: "On its way",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
  },

  notFound: {
    title: "This thread leads nowhere.",
    home: "Return home",
  },
};

export type Dictionary = typeof en;
