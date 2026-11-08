import type { Dictionary } from "./en";

/*
 * Hausa. Machine-drafted — have a native speaker read it before launch.
 * Brand names (ÀṢỌKÉ, Paystack) and place names stay as they are.
 */

export const ha: Dictionary = {
  meta: {
    shop: "Kasuwa",
    shopDescription:
      "Dukkan kayanmu, an saƙa su da hannu daga aso-oke na Yarbawa.",
    craft: "Sana'ar hannu",
    craftDescription:
      "Yadda ake saƙa aso-oke, waɗanda suke saƙa shi, da dalilin da ya sa muke yanka shi yadda muke yi.",
    book: "Yi alƙawarin ziyara",
    bookDescription:
      "Nemi shawara ko auna kaya a ɗakin aikin ÀṢỌKÉ da ke Legas.",
    contact: "Tuntuɓe mu",
    contactDescription: "Tuntuɓi ɗakin aikin ÀṢỌKÉ.",
    bag: "Jakarki",
    checkout: "Biyan kuɗi",
    confirm: "Tabbatar da oda",
    signIn: "Shiga",
    signUp: "Buɗe asusu",
    account: "Asusunki",
    orders: "Odarki",
    notFound: "Ba a samu ba",
  },

  /** The line under the wordmark, in the header and on the opening curtain. */
  brand: {
    tagline: "An Saƙa Shi Dominta",
  },

  language: {
    label: "Harshe",
  },

  nav: {
    shop: "Kasuwa",
    scarves: "Gyale",
    craft: "Sana'a",
    book: "Yi Alƙawari",
    contact: "Tuntuɓe Mu",
    openMenu: "Buɗe menu",
    account: "Asusu",
    home: "ÀṢỌKÉ, {tagline}, shafin farko",
    bagOne: "Jaka, abu ɗaya",
    bagMany: "Jaka, abubuwa {count}",
  },

  footer: {
    blurb:
      "Zane da aka saƙa a kan masaƙar Yarbawa, an yanka shi don macen da ke ɗaukaka al'adarta.",
    shop: "Kasuwa",
    house: "Gida",
    care: "Kulawa",
    allPieces: "Dukkan kaya",
    scarves: "Gyale",
    readyToWear: "Kayan da aka ɗinka",
    craft: "Sana'ar hannu",
    book: "Yi alƙawarin ziyara",
    contact: "Tuntuɓe mu",
    shipping: "Aikawa",
    returns: "Mayarwa",
    privacy: "Sirri",
    tagline: "An saƙa shi dominta.",
    place: "Legas, Najeriya · Paystack ne ke tsare biyan kuɗi",
  },

  bag: {
    title: "Jakarki",
    close: "Rufe jaka",
    empty: "Babu komai a jakarki.",
    browse: "Duba kayanmu",
    loading: "Ana ɗauko jakarki…",
    decrease: "Rage yawa",
    increase: "Ƙara yawa",
    remove: "Cire",
    summary: "Taƙaitawa",
    subtotal: "Jimilla",
    shippingNote: "Za a lissafa kuɗin aikawa a lokacin biya.",
    checkout: "Biya",
    viewFull: "Duba jakar gaba ɗaya",
  },

  product: {
    select: "Zaɓi",
    addToBag: "Saka a jaka",
    soldOut: "An sayar duka",
    unavailable: "Ba a fara sayar da wannan kaya ba tukuna.",
    onlyLeft: "Saura {count} kawai. Bayan haka, sai an yi oda za a saƙa.",
    addNamed: "Saka {name} a jaka",
    soldOutNamed: "An sayar da {name} duka",
    imageComing: "Hoto na zuwa",
    story: "Labarinsa",
    front: "Gaba",
    back: "Baya",
    detail: "Dalla-dalla",
    inMotion: "Yana motsi",
    emptyGrid: "Sabbin kaya suna kan masaƙa. Ki dawo nan ba da jimawa ba.",
  },

  home: {
    thisSeason: "Na wannan lokaci",
    viewAll: "Duba duka",

    hero: {
      eyebrow: "An saƙa da hannu a Najeriya",
      titleLead: "An saƙa shi dominta,",
      titleTail: "zare bayan zare.",
      body: "Aso-oke zane ne mai tunawa, tsiri da aka saƙa a kan ƙunƙuntar masaƙa, wanda macen Yarbawa ke sawa a kowane muhimmin mataki na rayuwarta. Muna yanka shi don yadda take rayuwa a yau.",
      explore: "Duba kayanmu",
      craft: "Sana'ar hannu",
      scroll: "Gangara",
      scrollLabel: "Gangara zuwa kayanmu",
    },

    showcase: {
      label: "Kayanmu, a launuka biyar",
      plateAlt: "Kayanmu da aka nuna a launuka biyar",
      eyebrow: "Zane ɗaya, kowane biki",
      title: "Daga ɗinkin musamman zuwa kayan amarya.",
      body: "Abu ɗaya, ba tare da takura shi ba. Zanen nan da aka saƙa da hannu yakan zama kayan amarya da aka auna a cikin mako takwas, zani na ranar Talata ta yau da kullum, gèlè da aka ɗaura don bikin raɗin suna, jaket da ke zuwa aiki ranar Litinin. Ɗinkin musamman, kayan da aka ɗinka da kayan amarya, kowanne an yanka shi don mata, kowane mita an saƙa shi a kan ƙunƙuntar masaƙar Yarbawa.",
      footnote: "Mata biyar · Launuka biyar · Zane ɗaya",
      cta: "Duba kayanmu",
    },

    pieces: {
      label: "Kaya",
      eyebrow: "Kayanmu",
      title: "Sabbin kayan ASỌKÉ",
    },

    bespoke: {
      eyebrow: "Ɗinkin musamman",
      title: "Zaninki. Siffarki. Labarinki.",
      body: "Babu abin da muke yi sau biyu a nan. Aikin musamman yana farawa da zane kuma yana ƙarewa da kayan da aka yanka bisa awo ɗaya, matakai huɗu, kuma ɗakin aikinmu zai bi ki a dukkansu.",
      cta: "Fara aikin musamman",
      stages: [
        {
          title: "Zaɓi zaninki",
          copy: "Aṣọ-òkè, adire, akwa ocha, akwete. Zane da aka saƙa da hannu, aka zaɓa daga kan masaƙa, launi, nauyi da salon saƙa ana zaɓarsu kafin a yanka komai.",
        },
        {
          title: "Bayyana siffarki",
          copy: "Bikin, yadda zai dace da ke, yanayin. Faɗa mana inda kayan za su je, za a yanka su don wannan ɗaki, wannan haske, wannan rana.",
        },
        {
          title: "Muna ƙerawa",
          copy: "Ana yanka kayanki, a ɗinka, a kammala su da hannu a ɗakin aikinmu. Ana haɗa tsiri, a naɗe gefe, a rufe kowane ɗinki ta hanyar gargajiya.",
        },
        {
          title: "An kawo",
          copy: "An goge, an naɗe, an aiko miki, an kammala, kuma a shirye don lokacin da aka yi shi saboda shi.",
        },
      ],
    },

    craft: {
      label: "Sana'ar hannu",
      eyebrow: "Sana'ar hannu",
      title: "Kafin ya zama kaya, yana farawa ne a matsayin labari.",
      body1:
        "Aso-oke yana fitowa daga ƙunƙuntar masaƙa a tsiri da bai fi faɗin tafin hannu ba. Ana saƙa kowanne, a yanka, a haɗa da hannu, mita ɗaya na zane na iya ɗaukar mai saƙa kwana biyu. Muna aiki da iyalan masu saƙa a Iseyin da Ilorin, kuma muna biya bisa tsiri, ba bisa awa ba.",
      body2:
        "Abin da ke canzawa shi ne yanka. Masaƙar ta kai shekara ɗari huɗu, amma siffar ba haka ba: zanen nan da kaka ta sa a ranar aurenta shi ne aka haɗa a nan ya zama jaket don ranar Talata. Ba a rage komai a hanyar saƙa don yin hakan ba.",
      cta: "Haɗu da masu saƙa",
      imageAlt:
        "Aso-oke a kan ƙunƙuntar masaƙa, a tsakiyar saƙa, kusa da zare, almakashi da farantin tagulla",
      hands: [
        "An saƙa",
        "An naɗe",
        "An yi masa ado",
        "An ɗinka",
        "An lulluɓe",
        "An gyara",
      ],
    },

    timeline: {
      eyebrow: "Daga ɗakin aiki zuwa gare ki",
      title: "Tasha biyar tsakanin masaƙa da ƙofarki.",
      stops: [
        {
          title: "Shawara",
          copy: "Muna karɓar burinki, awonki da ranar da ya kamata a kammala.",
        },
        {
          title: "Zaɓin zane",
          copy: "Ana zaɓar zane daga kan masaƙa, salon saƙa, nauyi da launi ana tabbatar da su kafin a yanka.",
        },
        {
          title: "Ɗinki",
          copy: "Kayanki sun shiga aiki. Ana haɗa tsiri kuma siffar tana bayyana.",
        },
        {
          title: "Kammalawa",
          copy: "An naɗe gefe, an saka layin ciki, kuma hannun da ya yi shi yana duba kowane ɗan bayani.",
        },
        {
          title: "Aikawa",
          copy: "An goge, an naɗe, an aika, za ki iya bin sawunsa har ƙofarki, ko'ina muke aikawa.",
        },
      ],
      turnaround: "Lokacin da aka saba ɗauka:",
      defaultTurnaround: "kwanakin aiki 7–14",
      note: "Ɗinkin musamman na iya ɗaukar ƙarin lokaci gwargwadon wahalarsa. Muna tabbatar da rana tare da ke a lokacin shawara kuma mu riƙe ta.",
    },

    moments: {
      eyebrow: "Don kowane lokaci",
      title: "Zane ɗaya. Salo da yawa.",
      items: [
        { label: "Amarya", copy: "Don bukukuwan aure da na gargajiya." },
        { label: "Baƙuwa", copy: "Kaya masu ɗaukar hankali don shagulgula." },
        { label: "Na yau da kullum", copy: "Kayan zamani masu tushen al'ada." },
        {
          label: "Macen zamani",
          copy: "Siffofin da ke gaba a salon kwalliya.",
        },
      ],
    },

    reach: {
      label: "Tuntuɓe mu",
      eyebrow: "Tuntuɓe mu",
      title: "Rubuto wa ɗakin aikinmu.",
      body: "Tambaya game da kaya, awo, aikin musamman ko odar da ke kan hanya. Aiko ta nan, kuma wani daga ɗakin aikinmu zai amsa cikin kwana ɗaya na aiki.",
      hours: "Lokutan aiki",
      visit: "Inda muke",
      book: "Yi alƙawarin ziyara",
    },
  },

  about: {
    eyebrow: "Sana'ar hannu",
    title: "Zanen da ke tuna inda ya fito.",
    intro:
      "Àṣọ òkè na nufin “babban zane”, zanen da kike sawa a waje, wanda mutane ke gani. Tsawon zamani yana nuna manyan ranaku a rayuwar mace. Mun yi imani ya cancanci ranakun yau da kullum ma.",
    chapters: [
      {
        title: "Masaƙa",
        body: "Ƙunƙuntar masaƙar Yarbawa tana fitar da zane mai faɗin kusan inci huɗu. Duk abin da ya fi gyale girma aikin haɗawa ne, ana saƙa tsiri ɗaya bayan ɗaya, sannan a jera su a haɗa don zanen ya fito a dunƙule. Idan jerin ya kuskure da zare ɗaya, dukkan zanen zai nuna.",
      },
      {
        title: "Masu saƙa",
        body: "Muna saye daga iyalan masu saƙa a Iseyin da Ilorin, garuruwan da sana'ar ke wucewa a cikin gidaje maimakon makarantu. Muna yin oda bisa tsiri kuma muna biya idan aka kawo, don makon da aiki bai yi sauri ba a masaƙa kada ya zama asarar albashi.",
      },
      {
        title: "Yanka",
        body: "Aso-oke ya kasance zanen biki tun fil azal, ana sa shi a bukukuwan aure, raɗin suna, jana'iza. Muna yanka shi don ranakun yau da kullum ma: gyalen da ke zaune ƙarƙashin wuya, zanin da ke motsi, jaket da ba sa bayyana kansu sai kin duba da kyau.",
      },
    ],
    closing: "Kowane kaya yana ɗauke da hannun da ya yi shi.",
    cta: "Duba kayanmu",
  },

  shop: {
    title: "Kayanmu",
    all: "Duka",
  },

  contact: {
    title: "Tuntuɓe mu",
    intro:
      "Don ɗinkin musamman, shawara kan awo, ko wani abu game da odar da kika riga kika yi, rubuto mana. Muna amsawa cikin kwana ɗaya na aiki.",
    orders: "Oda da awo",
    whatsapp: "WhatsApp",
    phone: "Waya",
    instagram: "Instagram",
    atelier: "Ɗakin aikinmu",
    place: "Legas, Najeriya",
    byAppointment: "Sai da alƙawari kawai",
    book: "Yi alƙawarin ziyara",
    shipping:
      "Ana aika kaya daga Legas. Aikawa tana ɗaukar kwanakin aiki 2–4 a cikin Najeriya, kuma tana ɗaukar lokaci fiye da haka ga zanen da ake saƙawa bayan an yi oda.",
  },

  book: {
    title: "Yi alƙawarin ziyara",
    intro:
      "Ɗakin aikinmu yana aiki ne da alƙawari. Zo ki zaɓi zane, mu tattauna aikin musamman, ko a auna miki kayan da ke hannu.",
    note: "Zaɓi lokacin da ya dace da ke kuma za mu tabbatar da shi, ko mu ba ki mafi kusa da ke a buɗe, cikin kwana ɗaya na aiki. Duk lokuta na Legas ne.",
    visit: "Ziyarar",
    visitPlaceholder: "Don me ne?",
    minutes: "minti",
    date: "Rana",
    time: "Lokaci · Legas",
    timePlaceholder: "Zaɓi lokaci",
    details: "Bayananki",
    fullName: "Cikakken suna",
    email: "Adireshin imel",
    phone: "Waya (ba dole ba)",
    notes:
      "Duk abin da ya kamata mu sani, bikin, kayan da kike tunani, zanen da za ki kawo",
    submit: "Nemi wannan ziyara",
    sending: "Ana aikawa…",
    thanksTitle: "Na gode",
    thanksBody:
      "Mun karɓi buƙatarki: {visit}, {when}. Ɗakin aikinmu zai tabbatar miki da lokacin ta imel ko waya cikin kwana ɗaya na aiki.",
    kinds: {
      "Bespoke consultation": "Shawarar ɗinkin musamman",
      "Fabric consultation": "Shawara kan zane",
      "Wedding consultation": "Shawarar aure",
      Fitting: "Gwajin kaya",
    },
    errors: {
      name: "Faɗa mana sunanki.",
      email: "Shigar da ingantaccen adireshin imel.",
      kind: "Zaɓi abin da ziyarar take don shi.",
      date: "Zaɓi rana.",
      time: "Zaɓi lokaci.",
      tooSoon: "Zaɓi rana daga gobe zuwa gaba.",
      tooFar:
        "Littafin alƙawarinmu a buɗe yake har kwana {days} masu zuwa. Zaɓi rana mafi kusa.",
      notConnected:
        "Ba a haɗa yin alƙawari ba tukuna, saka maɓallan Supabase ɗinka a .env.local don karɓar buƙatu.",
      failed:
        "Ba mu iya aika buƙatarki ba. Don Allah ki sake gwadawa nan ba da jimawa ba.",
    },
  },

  enquiry: {
    fullName: "Cikakken suna",
    email: "Adireshin imel",
    phone: "Waya (ba dole ba)",
    subject: "Batu (ba dole ba)",
    message: "Saƙonki",
    submit: "Aika saƙo",
    sending: "Ana aikawa…",
    thanksTitle: "An aika saƙonki",
    thanksBody:
      "Na gode, {name}. Za mu amsa zuwa {email} cikin kwana ɗaya na aiki.",
    errors: {
      name: "Faɗa mana sunanki.",
      email: "Shigar da ingantaccen adireshin imel.",
      message: "Rubuta saƙo mai aƙalla haruffa goma.",
      notConnected:
        "Ba a haɗa saƙonni ba tukuna. Saka maɓallan Supabase ɗinka a .env.local don karɓar su.",
      failed:
        "Ba mu iya aika saƙonki ba. Don Allah ki sake gwadawa nan ba da jimawa ba.",
    },
  },

  checkout: {
    title: "Biyan kuɗi",
    contact: "Tuntuɓa",
    email: "Adireshin imel",
    fullName: "Cikakken suna",
    phone: "Lambar waya",
    delivery: "Aikawa",
    street: "Adireshin titi",
    apartment: "Gida, ɗaki (ba dole ba)",
    city: "Gari",
    state: "Jiha",
    yourOrder: "Odarki",
    subtotal: "Jimilla",
    chooseState: "Zaɓi jiha",
    total: "Jimilla gaba ɗaya",
    plusDelivery: "{amount} + aikawa",
    deliveryNote:
      "Aikawa ₦2,500 ce a cikin Legas da ₦5,000 a sauran wurare a Najeriya.",
    pay: "Biya da Paystack",
    opening: "Ana buɗe Paystack…",
    redirectNote: "Za a kai ki Paystack don ki biya cikin aminci.",
    errors: {
      details: "Duba bayananki.",
      fields: {
        email: "Shigar da ingantaccen adireshin imel.",
        fullName: "Shigar da cikakken sunanki.",
        phone: "Shigar da lambar wayar da za a iya kiran ki.",
        street: "Shigar da adireshin titinki.",
        city: "Shigar da garinki.",
        state: "Zaɓi jiharki.",
        empty: "Babu komai a jakarki.",
      },
      notConnected:
        "Ba a haɗa biyan kuɗi ba tukuna, saka maɓallan Supabase da Paystack ɗinka a .env.local don karɓar kuɗi na gaske.",
      price:
        "Ba mu iya lissafa farashin jakarki ba. Don Allah ki sake gwadawa.",
      unavailable: "Wani abu a jakarki ba ya nan kuma.",
      stock: "{name} ba shi da isasshen yawa kuma.",
      open: "Ba mu iya buɗe odarki ba. Don Allah ki sake gwadawa.",
      save: "Ba mu iya ajiye odarki ba. Don Allah ki sake gwadawa.",
      payment: "Ba a iya fara biyan kuɗi ba. Don Allah ki sake gwadawa.",
    },
  },

  confirm: {
    failedEyebrow: "Ba a tabbatar da biya ba",
    failedTitle: "Wani abu ya katse odarki.",
    failures: {
      "unknown-order": "Ba mu samu wannan odar ba. Don Allah ki tuntuɓe mu.",
      "not-successful": "Biyanki bai yi nasara ba. Ba a cire kuɗi ba.",
      "amount-mismatch":
        "Kuɗin da aka biya bai yi daidai da odarki ba. An sanar da ma'aikatanmu kuma za su tuntuɓe ki.",
      error:
        "Ba mu iya tabbatar da biyanki ba tukuna. Don Allah ki tuntuɓe mu.",
    },
    tryAgain: "Sake gwadawa",
    contactUs: "Tuntuɓe mu",
    okEyebrow: "An karɓi kuɗi",
    okTitle: "Na gode. Ana shirya zaninki.",
    okBefore: "Tabbaci yana kan hanyarsa zuwa imel ɗinki. Lambar odarki ita ce",
    okAfter: "Ki ajiye ta don duk wata magana da mu.",
    viewOrders: "Duba odarki",
    continue: "Ci gaba da siyayya",
  },

  auth: {
    signInTitle: "Barka da dawowa",
    signInSub: "Shiga don ganin odarki da adireshin da kika ajiye.",
    signIn: "Shiga",
    newHere: "Sabuwa ce?",
    createLink: "Buɗe asusu",
    signUpTitle: "Buɗe asusu",
    signUpSub: "Bi odarki kuma ki biya da sauri a gaba.",
    createAccount: "Buɗe asusu",
    haveOne: "Kina da asusu?",
    fullName: "Cikakken suna",
    email: "Adireshin imel",
    password: "Kalmar sirri",
    showPassword: "Nuna kalmar sirri",
    hidePassword: "Ɓoye kalmar sirri",
    wait: "Ɗan jira…",
    confirmNotice:
      "Duba imel ɗinki don tabbatar da adireshinki, sannan ki shiga.",
    errors: {
      email: "Shigar da ingantaccen adireshin imel.",
      password: "Kalmar sirri dole ta kai aƙalla haruffa takwas.",
      unconfirmed: "Ki fara tabbatar da imel ɗinki, duba akwatin saƙonki.",
      rateLimit: "Kin yi ƙoƙari da yawa. Jira minti ɗaya ki sake gwadawa.",
      mismatch: "Wannan imel da kalmar sirri ba su yi daidai ba.",
    },
  },

  account: {
    title: "Asusunki",
    details: "Bayanai",
    email: "Imel",
    phone: "Waya",
    signOut: "Fita",
    orders: "Oda",
    ordersBody: "Duk kayan da kika yi oda, tare da matsayinsu a yanzu.",
    viewOrders: "Duba oda",
    atelier: "Ɗakin aiki",
    atelierBody:
      "Allon sarrafawa, kaya, oda, ayyukan musamman da littafin alƙawari.",
    dashboard: "Buɗe allon sarrafawa",
  },

  orders: {
    title: "Odarki",
    none: "Ba ki yi oda ba tukuna.",
    browse: "Duba kayanmu",
    stages: {
      pending: "Ana jiran biya",
      processing: "Ana shiryawa",
      cutting: "Ana yanka zane",
      fitting: "Ana gwajin kaya",
      finishing: "Ƙarshen gyara",
      ready: "A shirye don aikawa",
      shipped: "Yana kan hanya",
      delivered: "An kawo",
      cancelled: "An soke",
    },
  },

  notFound: {
    title: "Wannan zare ba ya kai ko'ina.",
    home: "Koma shafin farko",
  },
};
