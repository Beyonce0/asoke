import type { Dictionary } from "./en";

/*
 * Igbo. Machine-drafted — have a native speaker read it before launch.
 * Brand names (ÀṢỌKÉ, Paystack) and place names stay as they are.
 */

export const ig: Dictionary = {
  meta: {
    shop: "Ahịa",
    shopDescription:
      "Uwe niile anyị, e ji aka kpaa site na aso-oke ndị Yoruba.",
    craft: "Nka aka",
    craftDescription:
      "Otu e si akpa aso-oke, ndị na-akpa ya, na ihe mere anyị ji akpụ ya otú anyị si akpụ ya.",
    book: "Dee oge nleta",
    bookDescription:
      "Rịọ maka mkparịta ụka ma ọ bụ nleta nha uwe n'ụlọ ọrụ ÀṢỌKÉ dị na Lagos.",
    contact: "Kpọtụrụ anyị",
    contactDescription: "Kpọtụrụ ụlọ ọrụ ÀṢỌKÉ.",
    bag: "Akpa gị",
    checkout: "Kwụọ ụgwọ",
    confirm: "Nkwenye ahịa",
    signIn: "Banye",
    signUp: "Mepụta akaụntụ",
    account: "Akaụntụ gị",
    orders: "Ihe ị zụrụ",
    notFound: "Ahụghị ya",
  },

  /** The line under the wordmark, in the header and on the opening curtain. */
  brand: {
    tagline: "E Kpara Ya Maka Ya",
  },

  language: {
    label: "Asụsụ",
  },

  nav: {
    shop: "Ahịa",
    scarves: "Ịchafụ",
    craft: "Nka Aka",
    book: "Dee Oge Nleta",
    contact: "Kpọtụrụ Anyị",
    openMenu: "Mepee menu",
    account: "Akaụntụ",
    home: "ÀṢỌKÉ, {tagline}, ibe mbụ",
    bagOne: "Akpa, otu ihe",
    bagMany: "Akpa, ihe {count}",
  },

  footer: {
    blurb:
      "Akwa e kpara n'akwa ndị Yoruba, a kpụrụ maka nwanyị na-ebu omenala ya n'ihu.",
    shop: "Ahịa",
    house: "Ụlọ",
    care: "Nlekọta",
    allPieces: "Uwe niile",
    scarves: "Ịchafụ",
    readyToWear: "Uwe a dụrụ adụ",
    craft: "Nka aka",
    book: "Dee oge nleta",
    contact: "Kpọtụrụ anyị",
    shipping: "Mbupu",
    returns: "Nlaghachi",
    privacy: "Nzuzo",
    tagline: "E kpara ya maka ya.",
    place: "Lagos, Naịjirịa · Paystack na-echekwa ịkwụ ụgwọ",
  },

  bag: {
    title: "Akpa gị",
    close: "Mechie akpa",
    empty: "Ọ dịghị ihe dị n'akpa gị.",
    browse: "Lelee uwe anyị",
    loading: "A na-ebubata akpa gị…",
    decrease: "Belata ọnụ ọgụgụ",
    increase: "Mee ka ọnụ ọgụgụ baa ụba",
    remove: "Wepụ ya",
    summary: "Nchịkọta",
    subtotal: "Ngụkọta",
    shippingNote: "A ga-agbakọ ego mbupu mgbe ị na-akwụ ụgwọ.",
    checkout: "Kwụọ ụgwọ",
    viewFull: "Lee akpa niile",
  },

  product: {
    select: "Họrọ",
    addToBag: "Tinye n'akpa",
    soldOut: "Ọ gwụla",
    unavailable: "Enweghị ike ịzụ uwe a ugbu a.",
    onlyLeft:
      "Naanị {count} fọdụrụ. Mgbe nke a gasịrị, a ga-akpa ya ma i nyere iwu.",
    addNamed: "Tinye {name} n'akpa",
    soldOutNamed: "{name} agwụla",
    imageComing: "Foto na-abịa",
    story: "Akụkọ ya",
    front: "Ihu",
    back: "Azụ",
    detail: "Nkọwa",
    inMotion: "Ka ọ na-agagharị",
    emptyGrid: "Uwe ọhụrụ nọ n'akwa. Lọghachi n'oge na-adịghị anya.",
  },

  home: {
    thisSeason: "Oge a",
    viewAll: "Lee ha niile",

    hero: {
      eyebrow: "E ji aka kpaa ya na Naịjirịa",
      titleLead: "E kpara ya maka ya,",
      titleTail: "eriri n'eriri.",
      body: "Aso-oke bụ akwa nwere ncheta, mpempe e kpara n'akwa dị warara, nke nwanyị Yoruba na-eyi n'oge ọ bụla dị mkpa na ndụ ya. Anyị na-akpụ ya maka otu o si ebi ndụ taa.",
      explore: "Lelee uwe anyị",
      craft: "Nka aka",
      scroll: "Gbadata",
      scrollLabel: "Gbadata gaa n'uwe anyị",
    },

    showcase: {
      label: "Uwe anyị, n'agba ise",
      plateAlt: "Uwe anyị gosiri n'agba ise",
      eyebrow: "Otu akwa, emume ọ bụla",
      title: "Site na uwe a kpụrụ maka gị ruo n'uwe nwunye ọhụrụ.",
      body: "Otu akwa, anyị anaghịkwa ejide ya n'otu ebe. Otu akwa ahụ e ji aka kpaa na-aghọ uwe nwunye ọhụrụ a tụrụ nha ruo izu asatọ, uwe ogwe maka Tuzde nkịtị, gèlè e kere maka emume ịgụ aha, jaket na-aga ọrụ na Mọnde. Uwe a kpụrụ maka gị, uwe a dụrụ adụ na uwe nwunye ọhụrụ, e kpụrụ uwe ọ bụla maka ụmụ nwanyị, e kpara mita ọ bụla n'akwa Yoruba dị warara.",
      footnote: "Ụmụ nwanyị ise · Agba ise · Otu akwa",
      cta: "Lelee uwe anyị",
    },

    pieces: {
      label: "Uwe",
      eyebrow: "Uwe anyị",
      title: "Uwe ọhụrụ kacha ọhụrụ nke ASỌKÉ",
    },

    bespoke: {
      eyebrow: "Uwe a kpụrụ maka gị",
      title: "Akwa gị. Ọdịdị gị. Akụkọ gị.",
      body: "Ọ dịghị ihe anyị na-eme ugboro abụọ ebe a. Ọrụ a kpụrụ maka gị na-amalite n'akwa ma kwụsị n'uwe a kpụrụ n'otu nha, nzọụkwụ anọ, ụlọ ọrụ anyị ga-eso gị jee ha niile.",
      cta: "Malite ọrụ maka gị",
      stages: [
        {
          title: "Họrọ akwa gị",
          copy: "Aṣọ-òkè, adire, akwa ocha, akwete. Akwa e ji aka kpaa, a họpụtara n'akwa, agba, ịdị arọ na ụdị akpa ka a na-ahọrọ tupu a kpụọ ihe ọ bụla.",
        },
        {
          title: "Kọwaa ọdịdị gị",
          copy: "Emume ahụ, otú o kwesịrị isi dabara gị, mmụọ ya. Gwa anyị ebe uwe ahụ na-aga, a ga-akpụ ya maka ọnụ ụlọ ahụ, ìhè ahụ, ụbọchị ahụ.",
        },
        {
          title: "Anyị na-akpụ ya",
          copy: "A na-akpụ uwe gị, dụọ ya ma mechaa ya n'aka n'ụlọ ọrụ anyị. A na-ejikọ mpempe, tụgharịa ọnụ ya, mechie akara ọ bụla n'ụzọ ọdịnala.",
        },
        {
          title: "E zigara ya",
          copy: "A gbachara ya ígwè, kechie ya ma zitere gị, o mechara, dịkwa njikere maka oge e mere ya maka ya.",
        },
      ],
    },

    craft: {
      label: "Nka aka",
      eyebrow: "Nka aka",
      title: "Tupu ọ ghọọ uwe, ọ na-amalite dị ka akụkọ.",
      body1:
        "Aso-oke na-esi n'akwa dị warara apụta dị ka mpempe na-esighị ike karịa obosara aka. A na-akpa nke ọ bụla, kpụọ ya, jiri aka jikọọ ya, otu mita akwa nwere ike were onye na-akpa akwa ụbọchị abụọ. Anyị na-arụ ọrụ na ezinụlọ ndị na-akpa akwa na Iseyin na Ilorin, anyị na-akwụkwa ụgwọ maka mpempe ọ bụla, ọ bụghị maka awa.",
      body2:
        "Ihe na-agbanwe bụ ụdị ịkpụ. Akwa ahụ adịla narị afọ anọ, ma ọdịdị uwe adịghị otú ahụ: otu akwa ahụ nne nne yiri n'agbamakwụkwọ ya ka e jikọtara ebe a ka ọ bụrụ jaket maka Tuzde. Anyị adịghị ebelata ihe ọ bụla na usoro ịkpa akwa iji mee nke a.",
      cta: "Zute ndị na-akpa akwa",
      imageAlt:
        "Aso-oke n'akwa dị warara, n'etiti ịkpa ya, n'akụkụ eriri, mma ịkpụ akwa na efere ọla",
      hands: [
        "E kpara ya",
        "E pịara ya",
        "E kpụchiri ya ọnụ",
        "A dụrụ ya",
        "E kechiri ya",
        "A chọrọ ya mma",
      ],
    },

    timeline: {
      eyebrow: "Site n'ụlọ ọrụ ruo n'aka gị",
      title: "Nkwụsị ise n'etiti akwa na ọnụ ụzọ gị.",
      stops: [
        {
          title: "Mkparịta ụka",
          copy: "Anyị na-anata echiche gị, nha ahụ gị na ụbọchị o kwesịrị ịdị njikere.",
        },
        {
          title: "Nhọrọ akwa",
          copy: "A na-ahọrọ akwa n'akwa, ụdị akpa, ịdị arọ na agba ka a na-ekpebi tupu a kpụọ ya.",
        },
        {
          title: "Ịdụ uwe",
          copy: "Uwe gị na-abanye n'ọrụ. A na-ejikọ mpempe, ọdịdị ya na-apụtakwa.",
        },
        {
          title: "Imecha",
          copy: "A tụgharịrị ọnụ, tinye akwa ime, aka mere ya na-enyochakwa ihe ọ bụla.",
        },
        {
          title: "Mbupu",
          copy: "A gbachara ya ígwè, kechie ya ma ziga ya, ị nwere ike soro ya ruo n'ọnụ ụzọ gị, ebe ọ bụla anyị na-ezigara.",
        },
      ],
      turnaround: "Oge ọ na-ewekarị:",
      defaultTurnaround: "ụbọchị ọrụ 7–14",
      note: "Ọrụ a kpụrụ maka gị nwere ike iwe oge karịa dabere n'otú o si sie ike. Anyị ga-ekwenye ụbọchị gị n'oge mkparịta ụka ma jidesie ya ike.",
    },

    moments: {
      eyebrow: "Maka oge ọ bụla",
      title: "Otu akwa. Ọtụtụ ụzọ.",
      items: [
        {
          label: "Nwunye ọhụrụ",
          copy: "Maka agbamakwụkwọ na emume ọdịnala.",
        },
        { label: "Ọbịa", copy: "Uwe na-adọta anya maka emume." },
        {
          label: "Kwa ụbọchị",
          copy: "Uwe ọgbara ọhụrụ nwere mgbọrọgwụ omenala.",
        },
        { label: "Nwanyị ọgbara ọhụrụ", copy: "Ọdịdị uwe dị n'ihu n'ejiji." },
      ],
    },

    reach: {
      label: "Kpọtụrụ anyị",
      eyebrow: "Kpọtụrụ anyị",
      title: "Deere ụlọ ọrụ anyị.",
      body: "Ajụjụ gbasara uwe, nha, ọrụ a kpụrụ maka gị ma ọ bụ ahịa nọ n'ụzọ. Ziga ya ebe a, onye si n'ụlọ ọrụ anyị ga-aza n'ime otu ụbọchị ọrụ.",
      hours: "Oge ọrụ",
      visit: "Ebe anyị nọ",
      book: "Dee oge nleta",
    },
  },

  about: {
    eyebrow: "Nka aka",
    title: "Akwa na-echeta ebe o si bịa.",
    intro:
      "Àṣọ òkè pụtara “akwa elu”, akwa ị na-eyi n'elu, nke ndị mmadụ na-ahụ. Ruo ọtụtụ ọgbọ, ọ na-egosi ụbọchị kachasị ukwuu na ndụ nwanyị. Anyị kwenyere na o kwesịrị ụbọchị nkịtị kwa.",
    chapters: [
      {
        title: "Akwa ịkpa",
        body: "Akwa ịkpa Yoruba dị warara na-emepụta akwa ihe dị ka inch anọ n'obosara. Ihe ọ bụla buru ibu karịa ịchafụ bụ ọrụ njikọ, a na-akpa mpempe otu otu, wee hazie ma jikọọ ha ka ụkpụrụ ya pụta n'otu. Ọ bụrụ na nhazi ezighi ezi otu eriri, akwa niile ga-egosi ya.",
      },
      {
        title: "Ndị na-akpa akwa",
        body: "Anyị na-azụ site n'aka ezinụlọ ndị na-akpa akwa na Iseyin na Ilorin, obodo ebe nka a na-agafe n'ime ezinụlọ karịa n'ụlọ akwụkwọ. Anyị na-enye iwu maka mpempe ọ bụla ma kwụọ ụgwọ mgbe e wetara ya, ka izu ọrụ adịghị ọsọ n'akwa ghara ịbụ ụgwọ ọrụ furu efu.",
      },
      {
        title: "Ịkpụ",
        body: "Aso-oke abụrụla akwa emume mgbe niile, a na-eyi ya n'agbamakwụkwọ, emume ịgụ aha, olili ozu. Anyị na-akpụkwa ya maka ụbọchị nkịtị: ịchafụ na-anọdụ n'okpuru olu uwe, uwe ogwe na-agagharị, jaket anaghị ekwupụta onwe ha ruo mgbe ị lekwasịrị ha anya nke ọma.",
      },
    ],
    closing: "Uwe ọ bụla na-ebu aka mere ya.",
    cta: "Lelee uwe anyị",
  },

  shop: {
    title: "Uwe anyị",
    all: "Ha niile",
  },

  contact: {
    title: "Kpọtụrụ anyị",
    intro:
      "Maka ọrụ a kpụrụ maka gị, ndụmọdụ gbasara nha, ma ọ bụ ihe ọ bụla gbasara ihe ị zụlarị, deere anyị. Anyị na-aza n'ime otu ụbọchị ọrụ.",
    orders: "Ahịa na nha",
    whatsapp: "WhatsApp",
    phone: "Ekwentị",
    instagram: "Instagram",
    atelier: "Ụlọ ọrụ anyị",
    place: "Lagos, Naịjirịa",
    byAppointment: "Naanị site na nhọpụta oge",
    book: "Dee oge nleta",
    shipping:
      "A na-ezipụ uwe site na Lagos. Mbupu na-ewe ụbọchị ọrụ 2–4 n'ime Naịjirịa, ọ na-ewekwa ogologo oge maka akwa a na-akpa mgbe i nyere iwu.",
  },

  book: {
    title: "Dee oge nleta",
    intro:
      "Ụlọ ọrụ anyị na-arụ ọrụ site na nhọpụta oge. Bịa họrọ akwa, kparịta maka ọrụ a kpụrụ maka gị, ma ọ bụ bịa ka a tụọ gị nha maka uwe dịlarị.",
    note: "Họrọ awa dabara gị, anyị ga-ekwenye ya, ma ọ bụ nye gị nke kacha nso nke tọgbọ chakoo, n'ime otu ụbọchị ọrụ. Oge niile bụ oge Lagos.",
    visit: "Nleta ahụ",
    visitPlaceholder: "Gịnị ka ọ bụ maka?",
    minutes: "nkeji",
    date: "Ụbọchị",
    time: "Oge · Lagos",
    timePlaceholder: "Họrọ oge",
    details: "Nkọwa gị",
    fullName: "Aha gị zuru ezu",
    email: "Adreesị email",
    phone: "Ekwentị (ọ bụghị iwu)",
    notes:
      "Ihe ọ bụla anyị kwesịrị ịma, emume ahụ, uwe ị nwere n'uche, akwa ị na-ebute",
    submit: "Rịọ maka nleta a",
    sending: "A na-eziga ya…",
    thanksTitle: "Daalụ",
    thanksBody:
      "Anyị anatala arịrịọ gị: {visit}, {when}. Ụlọ ọrụ anyị ga-ekwenye oge ahụ gị site na email ma ọ bụ ekwentị n'ime otu ụbọchị ọrụ.",
    kinds: {
      "Bespoke consultation": "Mkparịta ụka uwe a kpụrụ maka gị",
      "Fabric consultation": "Mkparịta ụka gbasara akwa",
      "Wedding consultation": "Mkparịta ụka agbamakwụkwọ",
      Fitting: "Ntụle nha uwe",
    },
    errors: {
      name: "Gwa anyị aha gị.",
      email: "Tinye adreesị email ziri ezi.",
      kind: "Họrọ ihe nleta ahụ bụ maka.",
      date: "Họrọ ụbọchị.",
      time: "Họrọ oge.",
      tooSoon: "Họrọ ụbọchị malite echi gaa n'ihu.",
      tooFar:
        "Akwụkwọ nhọpụta anyị mepere ruo ụbọchị {days} n'ihu. Họrọ ụbọchị dị nso karịa.",
      notConnected:
        "Edebeghị njikọ ndebanye, tinye igodo Supabase gị na .env.local ka i nwee ike ịnata arịrịọ.",
      failed:
        "Anyị enweghị ike iziga arịrịọ gị. Biko nwaa ọzọ n'oge na-adịghị anya.",
    },
  },

  enquiry: {
    fullName: "Aha gị zuru ezu",
    email: "Adreesị email",
    phone: "Ekwentị (ọ bụghị iwu)",
    subject: "Isiokwu (ọ bụghị iwu)",
    message: "Ozi gị",
    submit: "Ziga ozi",
    sending: "A na-eziga ya…",
    thanksTitle: "E zigala ozi gị",
    thanksBody: "Daalụ, {name}. Anyị ga-aza {email} n'ime otu ụbọchị ọrụ.",
    privacyNote: "Anyị na-eji nkọwa gị naanị iji zaa ajụjụ gị.",
    errors: {
      name: "Gwa anyị aha gị.",
      email: "Tinye adreesị email ziri ezi.",
      message: "Dee ozi nwere opekata mpe mkpụrụedemede iri.",
      notConnected:
        "Edebeghị njikọ ozi. Tinye igodo Supabase gị na .env.local ka i nwee ike ịnata ha.",
      failed: "Ndo, ozi gị agaghị. Biko zitere anyị email na {email}.",
    },
  },

  checkout: {
    title: "Kwụọ ụgwọ",
    contact: "Kọntaktị",
    email: "Adreesị email",
    fullName: "Aha gị zuru ezu",
    phone: "Nọmba ekwentị",
    delivery: "Mbupu",
    street: "Adreesị okporo ụzọ",
    apartment: "Ụlọ, ọnụ ụlọ (ọ bụghị iwu)",
    city: "Obodo",
    state: "Steeti",
    yourOrder: "Ihe ị zụrụ",
    subtotal: "Ngụkọta",
    chooseState: "Họrọ steeti",
    total: "Ngụkọta niile",
    plusDelivery: "{amount} + mbupu",
    deliveryNote:
      "Mbupu bụ ₦2,500 n'ime Lagos na ₦5,000 n'ebe ndị ọzọ na Naịjirịa.",
    pay: "Kwụọ site na Paystack",
    opening: "A na-emepe Paystack…",
    redirectNote: "A ga-ebuga gị na Paystack ka ị kwụọ ụgwọ n'enweghị nsogbu.",
    errors: {
      details: "Lelee nkọwa gị.",
      fields: {
        email: "Tinye adreesị email ziri ezi.",
        fullName: "Tinye aha gị zuru ezu.",
        phone: "Tinye nọmba ekwentị a ga-eji kpọọ gị.",
        street: "Tinye adreesị okporo ụzọ gị.",
        city: "Tinye obodo gị.",
        state: "Họrọ steeti gị.",
        empty: "Ọ dịghị ihe dị n'akpa gị.",
      },
      notConnected:
        "Edebeghị njikọ ịkwụ ụgwọ, tinye igodo Supabase na Paystack gị na .env.local ka i nwee ike ịnata ezigbo ego.",
      price: "Anyị enweghị ike ịgbakọ ọnụ ahịa akpa gị. Biko nwaa ọzọ.",
      unavailable: "Otu ihe dị n'akpa gị adịghịzi.",
      stock: "{name} enweghịzi ọnụ ọgụgụ zuru ezu.",
      open: "Anyị enweghị ike imepe ahịa gị. Biko nwaa ọzọ.",
      save: "Anyị enweghị ike ichekwa ahịa gị. Biko nwaa ọzọ.",
      payment: "Enweghị ike ịmalite ịkwụ ụgwọ. Biko nwaa ọzọ.",
    },
  },

  confirm: {
    failedEyebrow: "Akwadobeghị ịkwụ ụgwọ",
    failedTitle: "Ihe kwụsịrị ahịa gị.",
    failures: {
      "unknown-order": "Anyị ahụghị ahịa ahụ. Biko kpọtụrụ anyị.",
      "not-successful": "Ịkwụ ụgwọ gị agaghị. Ewereghị ego ọ bụla.",
      "amount-mismatch":
        "Ego ị kwụrụ adabaghị n'ahịa gị. A gwala ndị ọrụ anyị, ha ga-akpọtụrụ gị.",
      error: "Anyị enwebeghị ike ikwenye ịkwụ ụgwọ gị. Biko kpọtụrụ anyị.",
    },
    tryAgain: "Nwaa ọzọ",
    contactUs: "Kpọtụrụ anyị",
    okEyebrow: "Anyị anatala ego",
    okTitle: "Daalụ. A na-akwado akwa gị.",
    okBefore: "Nkwenye na-abịa n'email gị. Nọmba ahịa gị bụ",
    okAfter: "Debe ya maka mkparịta ụka ọ bụla gị na anyị.",
    viewOrders: "Lee ihe ị zụrụ",
    continue: "Gaa n'ihu ịzụ ahịa",
  },

  auth: {
    signInTitle: "Nnọọ ọzọ",
    signInSub: "Banye ka ị hụ ihe ị zụrụ na adreesị ị chekwara.",
    signIn: "Banye",
    newHere: "Ị bụ onye ọhụrụ?",
    createLink: "Mepụta akaụntụ",
    signUpTitle: "Mepụta akaụntụ",
    signUpSub: "Soro ihe ị zụrụ ma kwụọ ụgwọ ngwa ngwa oge ọzọ.",
    createAccount: "Mepụta akaụntụ",
    haveOne: "Ị nweelarị otu?",
    fullName: "Aha gị zuru ezu",
    email: "Adreesị email",
    password: "Okwuntughe",
    showPassword: "Gosi okwuntughe",
    hidePassword: "Zoo okwuntughe",
    wait: "Chere obere oge…",
    confirmNotice: "Lelee email gị ka i kwenye adreesị gị, wee banye.",
    errors: {
      email: "Tinye adreesị email ziri ezi.",
      password: "Okwuntughe ga-enwerịrị opekata mpe mkpụrụedemede asatọ.",
      unconfirmed: "Buru ụzọ kwenye email gị, lelee igbe ozi gị.",
      rateLimit: "Ị nwalela ọtụtụ ugboro. Chere otu nkeji wee nwaa ọzọ.",
      mismatch: "Email na okwuntughe ahụ adabaghị.",
    },
  },

  account: {
    title: "Akaụntụ gị",
    details: "Nkọwa",
    email: "Email",
    phone: "Ekwentị",
    signOut: "Pụọ",
    orders: "Ihe ị zụrụ",
    ordersBody: "Uwe niile ị zụrụ, ya na ọnọdụ ya ugbu a.",
    viewOrders: "Lee ihe ị zụrụ",
    atelier: "Ụlọ ọrụ",
    atelierBody:
      "Ebe njikwa, ngwaahịa, ihe ndị mmadụ zụrụ, ọrụ a kpụrụ maka ndị mmadụ na akwụkwọ nhọpụta oge.",
    dashboard: "Mepee ebe njikwa",
  },

  orders: {
    title: "Ihe ị zụrụ",
    none: "Ị zụbeghị ihe ọ bụla.",
    browse: "Lelee uwe anyị",
    stages: {
      pending: "A na-eche ịkwụ ụgwọ",
      processing: "A na-akwado ya",
      cutting: "A na-akpụ akwa ahụ",
      fitting: "Na ntụle nha",
      finishing: "Mmecha ikpeazụ",
      ready: "Ọ dị njikere iziga",
      shipped: "Ọ nọ n'ụzọ",
      delivered: "O ruola",
      cancelled: "A kagburu ya",
    },
  },

  notFound: {
    title: "Eriri a anaghị eduga ebe ọ bụla.",
    home: "Laghachi n'ibe mbụ",
  },
};
