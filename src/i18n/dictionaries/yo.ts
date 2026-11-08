import type { Dictionary } from "./en";

/*
 * Yorùbá. Machine-drafted — have a native speaker read it before launch.
 * Brand names (ÀṢỌKÉ, Paystack) and place names stay as they are.
 */

export const yo: Dictionary = {
  meta: {
    shop: "Ọjà",
    shopDescription: "Gbogbo aṣọ wa, tí a hun láti inú aṣọ òkè Yorùbá.",
    craft: "Iṣẹ́ ọwọ́",
    craftDescription:
      "Bí a ṣe ń hun aṣọ òkè, àwọn tó ń hun ún, àti ìdí tí a fi ń gé e bí a ṣe ń gé e.",
    book: "Ṣe ìpinnu àbẹ̀wò",
    bookDescription: "Béèrè fún ìjíròrò tàbí ìwọ̀n aṣọ ní ilé iṣẹ́ ÀṢỌKÉ ní Èkó.",
    contact: "Kàn sí wa",
    contactDescription: "Kàn sí ilé iṣẹ́ ÀṢỌKÉ.",
    bag: "Àpò rẹ",
    checkout: "Sanwó",
    confirm: "Ìfìdímúlẹ̀ ọjà",
    signIn: "Wọlé",
    signUp: "Ṣí àkọọ́lẹ̀ tuntun",
    account: "Àkọọ́lẹ̀ rẹ",
    orders: "Àwọn ọjà tí o rà",
    notFound: "A kò rí i",
  },

  /** The line under the wordmark, in the header and on the opening curtain. */
  brand: {
    tagline: "A Hun Ún Fún Un",
  },

  language: {
    label: "Èdè",
  },

  nav: {
    shop: "Ọjà",
    scarves: "Ìborùn",
    craft: "Iṣẹ́ Ọwọ́",
    book: "Ṣe Àbẹ̀wò",
    contact: "Kàn Sí Wa",
    openMenu: "Ṣí àtòjọ",
    account: "Àkọọ́lẹ̀",
    home: "ÀṢỌKÉ, {tagline}, ojú ìwé àkọ́kọ́",
    bagOne: "Àpò, ohun kan",
    bagMany: "Àpò, ohun {count}",
  },

  footer: {
    blurb:
      "Aṣọ tí a hun lórí òfì Yorùbá, tí a gé fún obìnrin tó ń gbé àṣà rẹ̀ síwájú.",
    shop: "Ọjà",
    house: "Ilé",
    care: "Ìtọ́jú",
    allPieces: "Gbogbo aṣọ",
    scarves: "Ìborùn",
    readyToWear: "Aṣọ tí a ti rán",
    craft: "Iṣẹ́ ọwọ́",
    book: "Ṣe àbẹ̀wò",
    contact: "Kàn sí wa",
    shipping: "Ìfiránṣẹ́",
    returns: "Ìdápadà",
    privacy: "Àṣírí",
    tagline: "A hun ún fún un.",
    place: "Èkó, Nàìjíríà · Paystack ló ń dáàbò bo ìsanwó",
  },

  bag: {
    title: "Àpò rẹ",
    close: "Pa àpò dé",
    empty: "Kò sí nǹkan nínú àpò rẹ.",
    browse: "Wo àwọn aṣọ wa",
    loading: "À ń gbé àpò rẹ wá…",
    decrease: "Dín iye kù",
    increase: "Fi kún iye",
    remove: "Yọ ọ́ kúrò",
    summary: "Àkópọ̀",
    subtotal: "Àpapọ̀",
    shippingNote: "A ó ṣírò owó ìfiránṣẹ́ nígbà ìsanwó.",
    checkout: "Sanwó",
    viewFull: "Wo gbogbo àpò",
  },

  product: {
    select: "Yàn",
    addToBag: "Fi sínú àpò",
    soldOut: "Ó ti tán",
    unavailable: "Aṣọ yìí kò tíì ṣeé rà.",
    onlyLeft: "Ó ku {count} péré. Lẹ́yìn èyí, a ó hun ún lẹ́yìn tí o bá béèrè.",
    addNamed: "Fi {name} sínú àpò",
    soldOutNamed: "{name} ti tán",
    imageComing: "Àwòrán ń bọ̀",
    story: "Ìtàn rẹ̀",
    front: "Iwájú",
    back: "Ẹ̀yìn",
    detail: "Kúlẹ̀kúlẹ̀",
    inMotion: "Ní ìṣísẹ̀",
    emptyGrid: "Àwọn aṣọ tuntun wà lórí òfì. Padà wá láìpẹ́.",
  },

  home: {
    thisSeason: "Ti àsìkò yìí",
    viewAll: "Wo gbogbo rẹ̀",

    hero: {
      eyebrow: "A hun ún ní Nàìjíríà",
      titleLead: "A hun ún fún un,",
      titleTail: "okùn kan lẹ́yìn òmíràn.",
      body: "Aṣọ òkè jẹ́ aṣọ tó ní ìrántí, ìró tí a hun lórí òfì tóóró, tí obìnrin Yorùbá ń wọ̀ ní gbogbo ìpele ayé rẹ̀. A gé e fún bí ó ṣe ń gbé ayé lónìí.",
      explore: "Wo àwọn aṣọ wa",
      craft: "Iṣẹ́ ọwọ́",
      scroll: "Sọ̀kalẹ̀",
      scrollLabel: "Sọ̀kalẹ̀ sí àwọn aṣọ wa",
    },

    showcase: {
      label: "Àwọn aṣọ wa, ní àwọ̀ márùn-ún",
      plateAlt: "Àwọn aṣọ wa ní àwọ̀ márùn-ún",
      eyebrow: "Aṣọ kan, gbogbo ayẹyẹ",
      title: "Láti aṣọ àdáni dé aṣọ ìyàwó.",
      body: "Aṣọ kan náà, a kò sì fi í mọ sí ibì kan. Aṣọ tí a hun náà di aṣọ ìyàwó tí a wọ̀n fún ọ̀sẹ̀ mẹ́jọ, ìró fún ọjọ́ Ìṣẹ́gun lásán, gèlè fún ìsọmọlórúkọ, ẹ̀wù tó ń lọ síbi iṣẹ́ ní ọjọ́ Ajé. Aṣọ àdáni, aṣọ tí a ti rán àti aṣọ ìyàwó, gbogbo rẹ̀ ni a gé fún obìnrin, gbogbo mítà ni a hun lórí òfì Yorùbá.",
      footnote: "Obìnrin márùn-ún · Àwọ̀ márùn-ún · Aṣọ kan",
      cta: "Wo àwọn aṣọ wa",
    },

    pieces: {
      label: "Àwọn aṣọ",
      eyebrow: "Àwọn aṣọ",
      title: "Àkójọ tuntun ASỌKÉ",
    },

    bespoke: {
      eyebrow: "Aṣọ àdáni",
      title: "Aṣọ rẹ. Ìrísí rẹ. Ìtàn rẹ.",
      body: "Kò sí nǹkan tí a ń ṣe lẹ́ẹ̀mejì níbí. Iṣẹ́ àdáni bẹ̀rẹ̀ pẹ̀lú aṣọ, ó sì parí pẹ̀lú ẹ̀wù tí a gé sí ìwọ̀n kan ṣoṣo, ìgbésẹ̀ mẹ́rin, ilé iṣẹ́ wa yóò sì bá ọ rìn gbogbo rẹ̀.",
      cta: "Bẹ̀rẹ̀ iṣẹ́ àdáni",
      stages: [
        {
          title: "Yan aṣọ rẹ",
          copy: "Aṣọ-òkè, àdìrẹ, akwa ocha, akwete. Aṣọ tí a fi ọwọ́ hun, tí a yàn láti orí òfì, àwọ̀, ìwúwo àti ìhun ni a ó yàn kí a tó gé nǹkan.",
        },
        {
          title: "Ṣàlàyé ìrísí rẹ",
          copy: "Ayẹyẹ náà, bí ó ṣe máa bá ọ mu, ìmọ̀lára rẹ. Sọ ibi tí ẹ̀wù náà ń lọ fún wa, a ó sì gé e fún yàrá yẹn, ìmọ́lẹ̀ yẹn, ọjọ́ yẹn.",
        },
        {
          title: "A ṣe é",
          copy: "A gé ẹ̀wù rẹ, a rán an, a sì parí rẹ̀ pẹ̀lú ọwọ́ ní ilé iṣẹ́ wa. A so ìró pọ̀, a ká etí, a sì pa gbogbo ojú ìránṣọ ní ọ̀nà ìbílẹ̀.",
        },
        {
          title: "A fi ránṣẹ́",
          copy: "A lọ̀ ọ́, a wé e, a sì fi ránṣẹ́ sí ọ, ó ti parí, ó sì ti ṣetán fún àsìkò tí a ṣe é fún.",
        },
      ],
    },

    craft: {
      label: "Iṣẹ́ ọwọ́",
      eyebrow: "Iṣẹ́ ọwọ́",
      title: "Kí ó tó di aṣọ, ìtàn ni ó kọ́kọ́ jẹ́.",
      body1:
        "Aṣọ òkè ń jáde láti orí òfì tóóró ní ìró tí kò fẹ̀ ju àtẹ́lẹwọ́ lọ. A ń hun ọ̀kọ̀ọ̀kan, a ń gé e, a sì ń fi ọwọ́ so ó pọ̀, mítà aṣọ kan lè gba ahunṣọ ní ọjọ́ méjì. A ń bá àwọn ìdílé ahunṣọ ní Ìséyìn àti Ìlọrin ṣiṣẹ́, a sì ń sanwó fún ìró kọ̀ọ̀kan, kì í ṣe fún wákàtí.",
      body2:
        "Ohun tó yí padà ni ìgé rẹ̀. Òfì náà ti wà fún irínwó ọdún, ṣùgbọ́n ìrísí aṣọ náà kò tó bẹ́ẹ̀: aṣọ kan náà tí ìyá-ìyá wọ̀ ní ọjọ́ ìgbéyàwó rẹ̀ ni a so pọ̀ níbí di ẹ̀wù fún ọjọ́ Ìṣẹ́gun. A kò dín ohunkóhun kù nínú ọ̀nà ìhun láti ṣe èyí.",
      cta: "Pàdé àwọn ahunṣọ",
      imageAlt:
        "Aṣọ òkè lórí òfì tóóró, ní àárín ìhun, lẹ́gbẹ̀ẹ́ òwú, àlùmọ́gàjí àti àwo idẹ",
      hands: [
        "A hun ún",
        "A ká a",
        "A ṣe ọnà sí i",
        "A rán an",
        "A wé e",
        "A ṣe é lọ́ṣọ̀ọ́",
      ],
    },

    timeline: {
      eyebrow: "Láti ilé iṣẹ́ dé ọ̀dọ̀ rẹ",
      title: "Ìdúró márùn-ún láàrin òfì àti ilẹ̀kùn rẹ.",
      stops: [
        {
          title: "Ìjíròrò",
          copy: "A gba èrò rẹ, ìwọ̀n ara rẹ àti ọjọ́ tí ó gbọ́dọ̀ ti ṣetán.",
        },
        {
          title: "Yíyan aṣọ",
          copy: "A yan aṣọ láti orí òfì, ìhun, ìwúwo àti àwọ̀ ni a fìdí múlẹ̀ kí a tó gé e.",
        },
        {
          title: "Ìránṣọ",
          copy: "Ẹ̀wù rẹ bẹ̀rẹ̀ sí í di ṣíṣe. A so ìró pọ̀, ìrísí rẹ̀ sì ń jáde.",
        },
        {
          title: "Ìparí",
          copy: "A ká etí, a fi aṣọ inú sí i, ọwọ́ tó ṣe é sì yẹ gbogbo kúlẹ̀kúlẹ̀ wò.",
        },
        {
          title: "Ìfiránṣẹ́",
          copy: "A lọ̀ ọ́, a wé e, a sì fi ránṣẹ́, o lè tọpinpin rẹ̀ títí dé ilẹ̀kùn rẹ, níbikíbi tí a bá ń fi ránṣẹ́ sí.",
        },
      ],
      turnaround: "Àkókò tó sábà máa ń gbà:",
      defaultTurnaround: "ọjọ́ iṣẹ́ 7–14",
      note: "Iṣẹ́ àdáni lè gba àkókò díẹ̀ sí i ní ìbámu pẹ̀lú bí ó ṣe le tó. A ó fi ọjọ́ kan múlẹ̀ pẹ̀lú rẹ nígbà ìjíròrò, a ó sì dúró lé e.",
    },

    moments: {
      eyebrow: "Fún gbogbo àsìkò",
      title: "Aṣọ kan. Ọ̀nà púpọ̀.",
      items: [
        { label: "Ìyàwó", copy: "Fún ìgbéyàwó àti ayẹyẹ ìbílẹ̀." },
        { label: "Àlejò", copy: "Aṣọ tó ń fa ojú fún ayẹyẹ." },
        { label: "Ojoojúmọ́", copy: "Aṣọ òde òní tó ní gbòǹgbò nínú àṣà." },
        {
          label: "Obìnrin òde òní",
          copy: "Ìrísí tó wà níwájú nínú àṣà ìmúra.",
        },
      ],
    },

    reach: {
      label: "Kàn sí wa",
      eyebrow: "Kàn sí wa",
      title: "Kọ̀wé sí ilé iṣẹ́ wa.",
      body: "Ìbéèrè nípa aṣọ kan, ìwọ̀n, iṣẹ́ àdáni tàbí ọjà tó ti wà lójú ọ̀nà. Fi ránṣẹ́ síbí, ẹnìkan láti ilé iṣẹ́ wa yóò sì dáhùn láàrin ọjọ́ iṣẹ́ kan.",
      hours: "Àkókò iṣẹ́",
      visit: "Ibi tí a wà",
      book: "Ṣe àbẹ̀wò",
    },
  },

  about: {
    eyebrow: "Iṣẹ́ ọwọ́",
    title: "Aṣọ tó rántí ibi tí ó ti wá.",
    intro:
      "Àṣọ òkè túmọ̀ sí “aṣọ tí a ń wọ̀ sókè”, aṣọ tí o ń wọ̀ sí òde, èyí tí àwọn ènìyàn ń rí. Láti ìran dé ìran, òun ni ó ń ṣàmì sí àwọn ọjọ́ ńlá jùlọ nínú ayé obìnrin. A gbà pé ó yẹ fún àwọn ọjọ́ lásán pẹ̀lú.",
    chapters: [
      {
        title: "Òfì",
        body: "Òfì tóóró Yorùbá ń hun aṣọ tó fẹ̀ tó ínṣì mẹ́rin. Ohunkóhun tó tóbi ju ìborùn lọ jẹ́ iṣẹ́ àkójọpọ̀, a ń hun ìró lọ́kọ̀ọ̀kan, a ó tò wọ́n, a ó sì so wọ́n pọ̀ kí àpẹẹrẹ rẹ̀ lè máa bá a lọ láìdáwọ́dúró. Bí ìtòlẹ́sẹẹsẹ bá ṣì ní okùn kan, gbogbo aṣọ náà ni yóò fi hàn.",
      },
      {
        title: "Àwọn ahunṣọ",
        body: "A ń rà láti ọwọ́ àwọn ìdílé ahunṣọ ní Ìséyìn àti Ìlọrin, àwọn ìlú tí iṣẹ́ náà ti ń kọjá láti ìran dé ìran nínú ilé, kì í ṣe nínú ilé ẹ̀kọ́. A ń san owó ìró kọ̀ọ̀kan nígbà tí wọ́n bá fi jíṣẹ́, kí ọ̀sẹ̀ tí iṣẹ́ kò yá lórí òfì má di owó tí ó sọnù.",
      },
      {
        title: "Ìgé",
        body: "Aṣọ òkè ti jẹ́ aṣọ ayẹyẹ láti ọjọ́ pípẹ́, a ń wọ̀ ọ́ níbi ìgbéyàwó, ìsọmọlórúkọ, ìsìnkú. A tún ń gé e fún ọjọ́ lásán: ìborùn tó jókòó sábẹ́ kọ́là, ìró tó ń rìn, ẹ̀wù tí kò ní kéde ara rẹ̀ àyàfi tí o bá wò ó dáadáa.",
      },
    ],
    closing: "Gbogbo aṣọ ló ń gbé ọwọ́ tó ṣe é.",
    cta: "Wo àwọn aṣọ wa",
  },

  shop: {
    title: "Àwọn aṣọ wa",
    all: "Gbogbo rẹ̀",
  },

  contact: {
    title: "Kàn sí wa",
    intro:
      "Fún iṣẹ́ àdáni, ìmọ̀ràn lórí ìwọ̀n, tàbí ohunkóhun nípa ọjà tí o ti rà, kọ̀wé sí wa. A máa ń dáhùn láàrin ọjọ́ iṣẹ́ kan.",
    orders: "Ọjà àti ìwọ̀n",
    whatsapp: "WhatsApp",
    phone: "Fóònù",
    instagram: "Instagram",
    atelier: "Ilé iṣẹ́ wa",
    place: "Èkó, Nàìjíríà",
    byAppointment: "Pẹ̀lú àdéhùn nìkan",
    book: "Ṣe àbẹ̀wò",
    shipping:
      "A ń fi aṣọ ránṣẹ́ láti Èkó. Ìfiránṣẹ́ máa ń gba ọjọ́ iṣẹ́ 2–4 nínú Nàìjíríà, ó sì máa ń pẹ́ jù bẹ́ẹ̀ lọ fún aṣọ tí a ń hun lẹ́yìn tí a bá béèrè.",
  },

  book: {
    title: "Ṣe àbẹ̀wò",
    intro:
      "Ilé iṣẹ́ wa ń ṣiṣẹ́ pẹ̀lú àdéhùn. Wá yan aṣọ, sọ̀rọ̀ nípa iṣẹ́ àdáni, tàbí wá wọ̀n aṣọ tí ó ti wà lọ́wọ́.",
    note: "Yan wákàtí tó bá ọ mu, a ó sì fìdí rẹ̀ múlẹ̀, tàbí fún ọ ní èyí tó sún mọ́ ọn jù, láàrin ọjọ́ iṣẹ́ kan. Gbogbo àkókò jẹ́ ti Èkó.",
    visit: "Àbẹ̀wò náà",
    visitPlaceholder: "Kí ni ó wà fún?",
    minutes: "ìṣẹ́jú",
    date: "Ọjọ́",
    time: "Àkókò · Èkó",
    timePlaceholder: "Yan àkókò",
    details: "Àlàyé rẹ",
    fullName: "Orúkọ rẹ ní kíkún",
    email: "Àdírẹ́sì ímeèlì",
    phone: "Fóònù (kò pọn dandan)",
    notes:
      "Ohunkóhun tí ó yẹ kí a mọ̀, ayẹyẹ náà, aṣọ tí o ní lọ́kàn, aṣọ tí o ń mú bọ̀",
    submit: "Béèrè fún àbẹ̀wò yìí",
    sending: "À ń fi ránṣẹ́…",
    thanksTitle: "A dúpẹ́",
    thanksBody:
      "A ti gba ìbéèrè rẹ: {visit}, {when}. Ilé iṣẹ́ wa yóò fìdí àkókò náà múlẹ̀ pẹ̀lú rẹ nípasẹ̀ ímeèlì tàbí fóònù láàrin ọjọ́ iṣẹ́ kan.",
    kinds: {
      "Bespoke consultation": "Ìjíròrò aṣọ àdáni",
      "Fabric consultation": "Ìjíròrò nípa aṣọ",
      "Wedding consultation": "Ìjíròrò ìgbéyàwó",
      Fitting: "Ìwọ̀n aṣọ",
    },
    errors: {
      name: "Sọ orúkọ rẹ fún wa.",
      email: "Kọ àdírẹ́sì ímeèlì tó tọ́.",
      kind: "Yan ohun tí àbẹ̀wò náà wà fún.",
      date: "Yan ọjọ́ kan.",
      time: "Yan àkókò kan.",
      tooSoon: "Yan ọjọ́ láti ọ̀la lọ.",
      tooFar:
        "Ìwé àdéhùn wa ṣí sílẹ̀ fún ọjọ́ {days} síwájú. Yan ọjọ́ tó súnmọ́ jù.",
      notConnected:
        "Ìforúkọsílẹ̀ kò tíì so pọ̀, fi àwọn kọ́kọ́rọ́ Supabase rẹ sínú .env.local láti gba ìbéèrè.",
      failed: "A kò lè fi ìbéèrè rẹ ránṣẹ́. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i láìpẹ́.",
    },
  },

  enquiry: {
    fullName: "Orúkọ rẹ ní kíkún",
    email: "Àdírẹ́sì ímeèlì",
    phone: "Fóònù (kò pọn dandan)",
    subject: "Àkọlé (kò pọn dandan)",
    message: "Ọ̀rọ̀ rẹ",
    submit: "Fi ọ̀rọ̀ ránṣẹ́",
    sending: "À ń fi ránṣẹ́…",
    thanksTitle: "A ti gba ọ̀rọ̀ rẹ",
    thanksBody: "A dúpẹ́, {name}. A ó dáhùn sí {email} láàrin ọjọ́ iṣẹ́ kan.",
    errors: {
      name: "Sọ orúkọ rẹ fún wa.",
      email: "Kọ àdírẹ́sì ímeèlì tó tọ́.",
      message: "Kọ ọ̀rọ̀ tí ó kéré tán ní lẹ́tà mẹ́wàá.",
      notConnected:
        "Ọ̀rọ̀ kò tíì so pọ̀. Fi àwọn kọ́kọ́rọ́ Supabase rẹ sínú .env.local láti gbà wọ́n.",
      failed: "A kò lè fi ọ̀rọ̀ rẹ ránṣẹ́. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i láìpẹ́.",
    },
  },

  checkout: {
    title: "Sanwó",
    contact: "Ìkànsí",
    email: "Àdírẹ́sì ímeèlì",
    fullName: "Orúkọ rẹ ní kíkún",
    phone: "Nọ́ńbà fóònù",
    delivery: "Ìfiránṣẹ́",
    street: "Àdírẹ́sì òpópónà",
    apartment: "Ilé, yàrá (kò pọn dandan)",
    city: "Ìlú",
    state: "Ìpínlẹ̀",
    yourOrder: "Ọjà rẹ",
    subtotal: "Àpapọ̀",
    chooseState: "Yan ìpínlẹ̀",
    total: "Àpapọ̀ gbogbo",
    plusDelivery: "{amount} + ìfiránṣẹ́",
    deliveryNote:
      "Ìfiránṣẹ́ jẹ́ ₦2,500 nínú Èkó àti ₦5,000 ní ibòmíràn ní Nàìjíríà.",
    pay: "Sanwó pẹ̀lú Paystack",
    opening: "À ń ṣí Paystack…",
    redirectNote: "A ó gbé ọ lọ sí Paystack láti sanwó láìléwu.",
    errors: {
      details: "Ṣàyẹ̀wò àlàyé rẹ.",
      fields: {
        email: "Kọ àdírẹ́sì ímeèlì tó tọ́.",
        fullName: "Kọ orúkọ rẹ ní kíkún.",
        phone: "Kọ nọ́ńbà fóònù tí a lè fi pè ọ́.",
        street: "Kọ àdírẹ́sì òpópónà rẹ.",
        city: "Kọ ìlú rẹ.",
        state: "Yan ìpínlẹ̀ rẹ.",
        empty: "Kò sí nǹkan nínú àpò rẹ.",
      },
      notConnected:
        "Ìsanwó kò tíì so pọ̀, fi àwọn kọ́kọ́rọ́ Supabase àti Paystack rẹ sínú .env.local láti gba owó gidi.",
      price: "A kò lè ṣírò owó àpò rẹ. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.",
      unavailable: "Ohun kan nínú àpò rẹ kò sí mọ́.",
      stock: "{name} kò ní iye tó tó mọ́.",
      open: "A kò lè ṣí ọjà rẹ. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.",
      save: "A kò lè fi ọjà rẹ pamọ́. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.",
      payment: "Ìsanwó kò lè bẹ̀rẹ̀. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.",
    },
  },

  confirm: {
    failedEyebrow: "A kò fìdí ìsanwó múlẹ̀",
    failedTitle: "Nǹkan kan dí ọjà rẹ lọ́wọ́.",
    failures: {
      "unknown-order": "A kò rí ọjà náà. Jọ̀wọ́ kàn sí wa.",
      "not-successful": "Ìsanwó rẹ kò lọ. A kò gba owó kankan.",
      "amount-mismatch":
        "Iye owó tí o san kò bá ọjà rẹ mu. A ti sọ fún àwọn òṣìṣẹ́ wa, wọn yóò sì kàn sí ọ.",
      error: "A kò tíì lè fìdí ìsanwó rẹ múlẹ̀. Jọ̀wọ́ kàn sí wa.",
    },
    tryAgain: "Gbìyànjú lẹ́ẹ̀kan sí i",
    contactUs: "Kàn sí wa",
    okEyebrow: "A ti gba owó",
    okTitle: "A dúpẹ́. À ń pèsè aṣọ rẹ.",
    okBefore: "Ìfìdímúlẹ̀ ń bọ̀ sínú ímeèlì rẹ. Nọ́ńbà ọjà rẹ ni",
    okAfter: "Pa á mọ́ fún ìbánisọ̀rọ̀ èyíkéyìí pẹ̀lú wa.",
    viewOrders: "Wo àwọn ọjà rẹ",
    continue: "Máa bá ìrajà lọ",
  },

  auth: {
    signInTitle: "Ẹ káàbọ̀ padà",
    signInSub: "Wọlé láti rí àwọn ọjà rẹ àti àdírẹ́sì tí o fi pamọ́.",
    signIn: "Wọlé",
    newHere: "Ṣé tuntun ni ọ́?",
    createLink: "Ṣí àkọọ́lẹ̀ tuntun",
    signUpTitle: "Ṣí àkọọ́lẹ̀ tuntun",
    signUpSub: "Tọpinpin àwọn ọjà rẹ kí o sì sanwó kíákíá nígbà míì.",
    createAccount: "Ṣí àkọọ́lẹ̀",
    haveOne: "Ṣé o ti ní àkọọ́lẹ̀?",
    fullName: "Orúkọ rẹ ní kíkún",
    email: "Àdírẹ́sì ímeèlì",
    password: "Ọ̀rọ̀ aṣínà",
    showPassword: "Fi ọ̀rọ̀ aṣínà hàn",
    hidePassword: "Fi ọ̀rọ̀ aṣínà pamọ́",
    wait: "Dúró díẹ̀…",
    confirmNotice:
      "Wo ímeèlì rẹ láti fìdí àdírẹ́sì rẹ múlẹ̀, lẹ́yìn náà kí o wọlé.",
    errors: {
      email: "Kọ àdírẹ́sì ímeèlì tó tọ́.",
      password: "Ọ̀rọ̀ aṣínà gbọ́dọ̀ ní ó kéré tán lẹ́tà mẹ́jọ.",
      unconfirmed: "Kọ́kọ́ fìdí ímeèlì rẹ múlẹ̀, wo àpótí ímeèlì rẹ.",
      rateLimit: "O ti gbìyànjú jù. Dúró fún ìṣẹ́jú kan kí o tún gbìyànjú.",
      mismatch: "Ímeèlì àti ọ̀rọ̀ aṣínà yẹn kò bára mu.",
    },
  },

  account: {
    title: "Àkọọ́lẹ̀ rẹ",
    details: "Àlàyé",
    email: "Ímeèlì",
    phone: "Fóònù",
    signOut: "Jáde",
    orders: "Àwọn ọjà",
    ordersBody: "Gbogbo aṣọ tí o ti rà, pẹ̀lú ipò rẹ̀ lọ́wọ́lọ́wọ́.",
    viewOrders: "Wo àwọn ọjà",
    atelier: "Ilé iṣẹ́",
    atelierBody:
      "Pẹpẹ ìṣàkóso, àwọn ọjà, àwọn ìrajà, iṣẹ́ àdáni àti ìwé àdéhùn.",
    dashboard: "Ṣí pẹpẹ ìṣàkóso",
  },

  orders: {
    title: "Àwọn ọjà tí o rà",
    none: "O kò tíì ra nǹkan kankan.",
    browse: "Wo àwọn aṣọ wa",
    stages: {
      pending: "À ń dúró de ìsanwó",
      processing: "À ń pèsè rẹ̀",
      cutting: "À ń gé aṣọ náà",
      fitting: "Ní ìwọ̀n",
      finishing: "Ìparí iṣẹ́",
      ready: "Ó ti ṣetán láti fi ránṣẹ́",
      shipped: "Ó wà lójú ọ̀nà",
      delivered: "Ó ti dé",
      cancelled: "A ti fagilé e",
    },
  },

  notFound: {
    title: "Okùn yìí kò yọrí síbì kankan.",
    home: "Padà sí ojú ìwé àkọ́kọ́",
  },
};
