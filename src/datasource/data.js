import { UserTypeEnum } from '@/enums/User.enum'

const providers = [
  {
    id: 1,
    userId: 2,
    name: 'Centre équestre',
    description:
      'Un espace dédié aux amoureux des chevaux, où petits et grands découvrent des balades en poney encadrées par une équipe passionnée. Chaque sortie est pensée pour offrir un moment doux, rassurant et immersif dans l’univers équestre. Le centre propose également des ateliers de découverte, des séances de pansage et des temps de rencontre avec les animaux pour créer un lien privilégié avec eux.',
  },
  {
    id: 2,
    userId: 4,
    name: 'Ville de carcassonne',
    description:
      'L’équipe officielle qui fait vivre la cité médiévale. Entre gestion des animations, mise en valeur du patrimoine et accueil chaleureux, elle veille à offrir une expérience authentique et mémorable à chaque visiteur. Tout au long de l’événement, elle coordonne les parcours, les visites et les temps forts pour garantir une immersion fluide et accessible à tous.',
  },
  {
    id: 3,
    userId: 5,
    name: 'Remparts et lumière',
    description:
      'Les créateurs du spectacle nocturne emblématique : un voyage visuel et sonore qui illumine les remparts et plonge le public dans les légendes de Carcassonne. Une expérience féerique, incontournable et chargée d’émotion. Leur travail mêle projections monumentales, musique originale et mise en scène précise pour sublimer l’architecture médiévale.',
  },
  {
    id: 4,
    userId: 6,
    name: 'Troubadours moderne',
    description:
      'Une troupe d’artistes qui réinvente l’art des troubadours. Musiciens, conteurs et comédiens transportent les visiteurs avec énergie, humour et poésie, créant une ambiance vivante et chaleureuse dans toute la cité. Ils alternent saynètes interactives, concerts en plein air et histoires participatives pour faire vivre le Moyen Âge de manière ludique.',
  },
  {
    id: 5,
    userId: 7,
    name: 'Camion de restauration',
    description:
      'Un food-truck convivial qui revisite les saveurs médiévales. Plats généreux, recettes inspirées d’antan et produits locaux : une pause gourmande qui réchauffe et rassemble les visiteurs autour d’une cuisine authentique. Entre rôtis, tartes rustiques et boissons épicées, chaque recette est pensée pour être à la fois immersive et adaptée aux goûts d’aujourd’hui.',
  },
]

const presentation = {
  small:
    '<p>Durant le weekend du 28 au 29 mai 2026, plongez dans l’univers médiéval de Carcassonne grâce à un événement unique mêlant animations, spectacles et activités accessibles à tous.</p>',
  big: `
  <h1 class="text-3xl font-bold mb-6">
    Carcassonne Autrefois : l’événement médiéval immersif au cœur de la cité fortifiée
  </h1>

  <p class="mb-4">
    <i><b>Carcassonne Autrefois</b></i> transforme la célèbre <b>cité médiévale</b> en un
    véritable village d’époque où se mêlent
    <b>chevaliers, troubadours et artisans.</b>
  </p>

  <p class="mb-4">
    Tout au long de votre visite, vous plongerez dans une <b>ambiance médiévale fidèle</b>,
    animée par des prestataires passionnés et des <b>spectacles vivants</b> qui rythment la
    journée.
  </p>

  <p class="mb-4"><b>Les plus jeunes pourront :</b></p>
  <ul>
    <li>Profiter de balades en poney</li>
    <li>Participer à des ateliers de fabrication d’épées en bois</li>
    <li>Assister à des représentations spécialement conçues pour eux.</li>
  </ul>
  <br />
  <p class="mb-4"><b>Et les familles auront accès à :</b></p>
  <ul>
    <li>Une initiation au tir à l’arc</li>
    <li>Des concerts médiévaux</li>
    <li>Des démonstrations de combats</li>
    <li>
      Et surtout participer au célèbre <b>tournois de joute</b>, un incontournable de
      l’événement.
    </li>
  </ul>

  <p class="mb-4">
    À la nuit tombée, les <b>remparts s’illuminent</b> pour un spectacle féerique qui fait
    revivre les grandes légendes de Carcassonne.
  </p>

  <p class="mb-4">
    <span class="italic">Carcassonne Autrefois</span>, c’est aussi la rencontre avec des
    <b>troupes historiques</b>, des artistes et des <b>artisans</b> qui partagent leur
    savoir-faire au détour des ruelles pavées.
  </p>

  <p class="mb-4">
    Entre animations, musique, histoires et saveurs inspirées du Moyen Âge, chaque moment est
    pensé pour offrir une <b>immersion totale</b>.
  </p>

  <p class="mb-4">
    Le cadre exceptionnel de la cité fortifiée renforce l’expérience : chaque activité prend
    place dans un <b>décor authentique</b>, offrant un voyage hors du temps.
  </p>

  <p>
    Adapté à tous les âges, sécurisé et organisé, l’événement garantit une découverte
    enrichissante et inoubliable. Que vous veniez en famille, entre amis ou par passion,
    <span class="italic">Carcassonne Autrefois</span> vous invite à vivre
    <b>une journée unique</b>, au cœur d’un <b>patrimoine historique d’exception</b>.
  </p>
    `,
}

const newProviders = [
  {
    id: 1,
    userId: 8,
    name: 'Carcassonne Escrime',
    description:
      "Assocition sportive d'escrime de Carcassonne. Activité proposé : découverte de l'escrime pour tout âge",
  },
]

const providerImages = [
  {
    id: 1,
    images: [
      {
        itemImageSrc: '/uploads/chevaux.jpg',
        thumbnailImageSrc: '/uploads/chevaux.jpg',
        alt: 'Description for Image 6',
        title: 'Title 6',
        idImage: '1-1',
      },
      {
        itemImageSrc: '/uploads/chevaux2.jpg',
        thumbnailImageSrc: '/uploads/chevaux2.jpg',
        alt: 'Description for Image 7',
        title: 'Title 7',
        idImage: '1-2',
      },
      {
        itemImageSrc: '/uploads/chevaux3.jpg',
        thumbnailImageSrc: '/uploads/chevaux3.jpg',
        alt: 'Description for Image 8',
        title: 'Title 8',
        idImage: '1-3',
      },
      {
        itemImageSrc: '/uploads/chevaux4.jpg',
        thumbnailImageSrc: '/uploads/chevaux4.jpg',
        alt: 'Description for Image 9',
        title: 'Title 9',
        idImage: '1-4',
      },
    ],
  },
  {
    id: 2,
    images: [
      {
        itemImageSrc: '/uploads/ville1.jpg',
        thumbnailImageSrc: '/uploads/ville1.jpg',
        alt: 'Description for Image 6',
        title: 'Title 6',
        idImage: '2-1',
      },
      {
        itemImageSrc: '/uploads/ville2.jpg',
        thumbnailImageSrc: '/uploads/ville2.jpg',
        alt: 'Description for Image 7',
        title: 'Title 7',
        idImage: '2-2',
      },
      {
        itemImageSrc: '/uploads/ville3.jpg',
        thumbnailImageSrc: '/uploads/ville3.jpg',
        alt: 'Description for Image 8',
        title: 'Title 8',
        idImage: '2-3',
      },
    ],
  },
  {
    id: 3,
    images: [
      {
        itemImageSrc: '/uploads/remparts1.jpg',
        thumbnailImageSrc: '/uploads/remparts1.jpg',
        alt: 'Description for Image 6',
        title: 'Title 6',
        idImage: '3-1',
      },
      {
        itemImageSrc: '/uploads/remparts2.jpg',
        thumbnailImageSrc: '/uploads/remparts2.jpg',
        alt: 'Description for Image 7',
        title: 'Title 7',
        idImage: '3-2',
      },
      {
        itemImageSrc: '/uploads/remparts3.jpg',
        thumbnailImageSrc: '/uploads/remparts3.jpg',
        alt: 'Description for Image 8',
        title: 'Title 8',
        idImage: '3-3',
      },
      {
        itemImageSrc: '/uploads/remparts4.jpg',
        thumbnailImageSrc: '/uploads/remparts4.jpg',
        alt: 'Description for Image 9',
        title: 'Title 9',
        idImage: '3-4',
      },
      {
        itemImageSrc: '/uploads/remparts5.jpg',
        thumbnailImageSrc: '/uploads/remparts5.jpg',
        alt: 'Description for Image 9',
        title: 'Title 9',
        idImage: '3-5',
      },
    ],
  },
  {
    id: 4,
    images: [
      {
        itemImageSrc: '/uploads/troubadours1.png',
        thumbnailImageSrc: '/uploads/troubadours1.png',
        alt: 'Description for Image 6',
        title: 'Title 10',
        idImage: '4-1',
      },
      {
        itemImageSrc: '/uploads/troubadours2.png',
        thumbnailImageSrc: '/uploads/troubadours2.png',
        alt: 'Description for Image 7',
        title: 'Title 11',
        idImage: '4-2',
      },
      {
        itemImageSrc: '/uploads/troubadours3.png',
        thumbnailImageSrc: '/uploads/troubadours3.png',
        alt: 'Description for Image 8',
        title: 'Title 12',
        idImage: '4-3',
      },
      {
        itemImageSrc: '/uploads/troubadours4.png',
        thumbnailImageSrc: '/uploads/troubadours4.png',
        alt: 'Description for Image 9',
        title: 'Title 13',
        idImage: '4-4',
      },
      {
        itemImageSrc: '/uploads/troubadours5.png',
        thumbnailImageSrc: '/uploads/troubadours5.png',
        alt: 'Description for Image 9',
        title: 'Title 14',
        idImage: '4-5',
      },
    ],
  },
  {
    id: 5,
    images: [
      {
        itemImageSrc: '/uploads/resto1.png',
        thumbnailImageSrc: '/uploads/resto1.png',
        alt: 'Photo resto 1',
        title: 'Title 15',
        idImage: '5-1',
      },
      {
        itemImageSrc: '/uploads/resto2.png',
        thumbnailImageSrc: '/uploads/resto2.png',
        alt: 'Photo resto 2',
        title: 'Title 16',
        idImage: '5-2',
      },
      {
        itemImageSrc: '/uploads/resto3.png',
        thumbnailImageSrc: '/uploads/resto3.png',
        alt: 'Photo resto 3',
        title: 'Title 17',
        idImage: '5-3',
      },
      {
        itemImageSrc: '/uploads/resto4.png',
        thumbnailImageSrc: '/uploads/resto4.png',
        alt: 'Photo resto 4',
        title: 'Title 18',
        idImage: '5-4',
      },
      {
        itemImageSrc: '/uploads/resto5.png',
        thumbnailImageSrc: '/uploads/resto5.png',
        alt: 'Photo resto 5',
        title: 'Title 19',
        idImage: '5-5',
      },
    ],
  },
]

const locations = [
  {
    id: 1,
    coord: [43.205016837015535, 2.362105757763999],
    area: [
      [43.205085626480354, 2.3624869375898925],
      [43.20527849640317, 2.3623944195275612],
      [43.205349979506394, 2.3619244277748805],
      [43.20507753402259, 2.3617856506832027],
      [43.2046702122677, 2.3618263586296564],
      [43.20467560727539, 2.3623315072460684],
      [43.205085626480354, 2.3624869375898925],
    ],
    surfaceArea: 2000,
    water: true,
    eletricity: true,
  },
  {
    id: 2,
    coord: [43.207275945048224, 2.363637858353826],
    area: [
      [43.20752545272583, 2.363569394004287],
      [43.20705745587949, 2.363401011131799],
      [43.20698732347833, 2.363734076153321],
      [43.207190976959936, 2.3637821855456593],
      [43.2074984789416, 2.363817342409334],
      [43.20752545272583, 2.363569394004287],
    ],
    surfaceArea: 2500,
    water: true,
    eletricity: false,
  },
  {
    id: 3,
    coord: [43.2052886124346, 2.3634113208134693],
    area: [
      [43.204924882989104, 2.363373421605502],
      [43.20497552899144, 2.3638976939826364],
      [43.20521955004858, 2.364554613587643],
      [43.20557406946696, 2.364049290814478],
      [43.20558327773634, 2.363474486160783],
      [43.205320841521086, 2.3632786735856257],
      [43.204924882989104, 2.363373421605502],
    ],
    surfaceArea: 5167,
    water: true,
    eletricity: true,
  },
  {
    id: 4,
    coord: [43.20581808812983, 2.3643461679417612],
    area: [
      [43.2052655916477, 2.36461146239958],
      [43.205587881870144, 2.3649083395278865],
      [43.205960815574144, 2.3649778214094965],
      [43.20611275087401, 2.36490202299359],
      [43.20613577134122, 2.3642261537846423],
      [43.20562011079926, 2.364074556952744],
      [43.2052655916477, 2.36461146239958],
    ],
    surfaceArea: 5000,
    water: true,
    eletricity: true,
  },
  {
    id: 5,
    coord: [43.205960815574144, 2.3636955648710796],
    area: [
      [43.20564313145161, 2.364049290814478],
      [43.20614037543331, 2.364188254576618],
      [43.20626928987775, 2.3633481554672358],
      [43.20591477449972, 2.3631902421010977],
      [43.205610902535454, 2.3635060688333738],
      [43.20564313145161, 2.364049290814478]
    ],
    surfaceArea: 5100,
    water: true,
    eletricity: true,
  },
  {
    id: 6,
    coord: [43.20654943505028, 2.3646543486723317],
    area: [
      [43.20619102042647, 2.36424510338648],
      [43.20618641633743, 2.3650473032890034],
      [43.20671588424074, 2.365325230813397],
      [43.20684479746893, 2.3647377930899722],
      [43.20653632607568, 2.364314585268147],
      [43.20619102042647, 2.36424510338648]
    ],
    surfaceArea: 5125,
    water: true,
    eletricity: true,
  },
  {
    id: 7,
    coord: [43.20705347910345, 2.36516046501751],
    area: [
      [43.20724074353893, 2.365615791408402],
      [43.20738346765455, 2.365085202496971],
      [43.206904649946495, 2.3647504261596453],
      [43.206780340888514, 2.3653125977447473],
      [43.20724074353893, 2.365615791408402]
    ],
    surfaceArea: 5125,
    water: true,
    eletricity: true,
  },
  {
    id: 8,
    coord: [43.20698773446318, 2.3641231770631634],
    area: [
      [43.20681717322864, 2.3640556073466996],
      [43.20658697073932, 2.3642766860601228],
      [43.20682638131041, 2.3646240954661266],
      [43.2073604476582, 2.3650030875456878],
      [43.2074985675045, 2.363904010514858],
      [43.207213119477984, 2.3638092624949536],
      [43.20699673056703, 2.3640808734860173],
      [43.20681717322864, 2.3640556073466996]
    ],
    surfaceArea: 5125,
    water: true,
    eletricity: true,
  },
  {
    id: 9,
    coord: [43.2067213866782, 2.3638195967736237],
    area: [
      [43.20629543637125, 2.3634260337498176],
      [43.20615924755066, 2.364137627501293],
      [43.20655912024566, 2.364240987487051],
      [43.206814110160536, 2.3639786121374584],
      [43.20667792249745, 2.3635850491124017],
      [43.20629543637125, 2.3634260337498176]
    ],
    surfaceArea: 4521,
    water: true,
    eletricity: true,
  },
]

const contacts = [
  {
    id: 1,
    mail: 'john.doe@gmail.com',
    providerId: 1,
    activityId: null,
    message: "Bonjour, j'aimerais savoir si il y a une limite de poids pour la balade à cheval ?",
  },
]

const surveys = []

const activities = [
  {
    id: 1,
    providerId: 1,
    name: 'Balade à cheval',
    description:
      'Une balade à cheval en petit groupe autour des remparts et des plaines environnantes, encadrée par des moniteurs diplômés. Adaptée aux débutants comme aux cavaliers plus à l’aise, l’activité met l’accent sur la découverte en douceur, la sécurité et la complicité avec l’animal.',
    presentationContent: `
      <h2 class="text-2xl font-semibold mb-4">Partez en balade à cheval autour de la cité</h2>
      <p class="mb-3">
        En selle pour une balade au rythme du pas du cheval, sur des chemins adaptés à tous les niveaux.
        Avant de partir, les moniteurs prennent le temps d’expliquer les bases&nbsp;: comment se tenir,
        guider sa monture et se sentir à l’aise, même pour une première fois.
      </p>
      <p class="mb-3">
        Le parcours longe les remparts et les paysages alentours, offrant des points de vue privilégiés
        sur la cité fortifiée. L’objectif n’est pas la performance, mais le plaisir et la découverte,
        dans une ambiance calme et rassurante.
      </p>
      <p>
        Cette activité est idéale pour les familles et les curieux souhaitant vivre une expérience
        différente, au plus près des animaux et de la nature, tout en restant encadrés par une équipe
        bienveillante.
      </p>
    `,
    locationId: 2,
    canRegister: true,
    requestedLocationId: undefined,
  },
  {
    id: 2,
    providerId: 2,
    name: "Fabrication d'épée en bois",
    description:
      'Un atelier de fabrication d’épée en bois où les enfants, accompagnés d’un animateur, sculptent, poncent et décorent leur propre arme de chevalier. Cette activité manuelle permet de découvrir les techniques de base du travail du bois tout en stimulant l’imagination autour de l’univers médiéval.',
    presentationContent: `
      <h2 class="text-2xl font-semibold mb-4">Créez votre propre épée de chevalier</h2>
      <p class="mb-3">
        Dans cet atelier, chaque participant reçoit une ébauche d’épée en bois qu’il va transformer
        peu à peu en véritable accessoire de chevalier. Guidés par un animateur, les enfants apprennent
        à poncer, arrondir les bords et personnaliser leur création.
      </p>
      <p class="mb-3">
        Une fois la forme finalisée, place à la décoration&nbsp;: peinture, motifs, symboles de blason,
        rubans pour le manche… chacun repart avec une épée unique, imaginée et réalisée de ses propres mains.
      </p>
      <p>
        L’atelier met l’accent sur la créativité, le travail manuel et la sécurité. C’est un moment
        calme et concentré, où l’on fabrique un souvenir durable de l’événement.
      </p>
    `,
    locationId: undefined,
    canRegister: true,
    requestedLocationId: undefined,
  },
  {
    id: 3,
    providerId: 4,
    name: 'Chasse à la sorcière ',
    description:
      'Un spectacle interactif pour enfants où les jeunes spectateurs aident les troubadours à déjouer les tours d’une mystérieuse sorcière. Entre énigmes, saynètes et interventions du public, la représentation alterne humour et frissons tout en restant accessible aux plus jeunes.',
    presentationContent: `
      <h2 class="text-2xl font-semibold mb-4">Participez à la grande chasse à la sorcière</h2>
      <p class="mb-3">
        Au cœur de la cité, une étrange sorcière semble semer le trouble… Les troubadours ont besoin
        de l’aide des enfants pour résoudre des énigmes, retrouver des objets magiques et remettre de
        l’ordre dans les ruelles.
      </p>
      <p class="mb-3">
        Le spectacle alterne scènes jouées, moments interactifs avec le public et petites épreuves
        ludiques. Les enfants deviennent de véritables héros de l’histoire, encouragés à participer,
        réfléchir et coopérer.
      </p>
      <p>
        Pensée pour les jeunes publics, la mise en scène reste légère et drôle, avec juste ce qu’il
        faut de mystère pour faire frissonner… sans jamais effrayer. Un moment de théâtre vivant,
        familial et convivial.
      </p>
    `,
    locationId: undefined,
    canRegister: true,
    requestedLocationId: undefined,
  },
  {
    id: 4,
    providerId: 2,
    name: "Tir à l'arc",
    description:
      "Une initiation au tir à l’arc encadrée par des animateurs formés, avec du matériel adapté à tous les âges. Après quelques explications sur la posture et la sécurité, les participants s’exercent sur des cibles inspirées de l’imaginaire médiéval et tentent de réaliser le meilleur score.",
    presentationContent: `
      <h2 class="text-2xl font-semibold mb-4">Devenez archer le temps d’une séance</h2>
      <p class="mb-3">
        Inspirée de l’entraînement des archers d’autrefois, cette activité propose une initiation
        progressive au tir à l’arc. Après une présentation du matériel et des règles de sécurité,
        les participants apprennent à se placer, armer leur arc et viser sereinement.
      </p>
      <p class="mb-3">
        Différentes cibles thématiques, plus ou moins éloignées, permettent de progresser à son rythme.
        Chacun peut tenter de réaliser le meilleur tir, mais l’objectif reste avant tout de partager
        un moment ludique en famille ou entre amis.
      </p>
      <p>
        Encadrée par des animateurs attentifs, l’activité convient aussi bien aux curieux qu’aux plus
        sportifs, dans une ambiance détendue et bienveillante.
      </p>
    `,
    locationId: undefined,
    canRegister: true,
    requestedLocationId: undefined,
  },
  {
    id: 5,
    providerId: 4,
    name: 'Concert médiéval',
    description:
      "Un concert en plein air mêlant vielles, percussions, flûtes et voix pour recréer les ambiances sonores de l’époque médiévale. Les musiciens proposent un voyage musical rythmé, parfois dansant, ponctué d’anecdotes sur les instruments et les chansons d’autrefois.",
    presentationContent: `
      <h2 class="text-2xl font-semibold mb-4">Un concert au son du Moyen Âge</h2>
      <p class="mb-3">
        Installez-vous au pied des remparts et laissez-vous porter par les mélodies des instruments
        anciens&nbsp;: vielles, percussions, flûtes et voix s’entremêlent pour recréer l’ambiance
        des places et tavernes médiévales.
      </p>
      <p class="mb-3">
        Les musiciens alternent morceaux entraînants, airs plus doux et moments de partage avec le
        public. Ils expliquent l’origine de certains chants, présentent leurs instruments et
        invitent parfois les spectateurs à reprendre les refrains.
      </p>
      <p>
        Ce concert est pensé pour être accessible à tous, mélomanes ou simples curieux, et constitue
        une belle parenthèse musicale au cœur de la fête.
      </p>
    `,
    locationId: 1,
    canRegister: true,
    requestedLocationId: undefined,
  },
  {
    id: 6,
    providerId: 1,
    name: 'Tournois de joute',
    description:
      'Une grande démonstration de joute équestre où des cavaliers en armure s’affrontent dans des duels spectaculaires. Le public découvre les codes de ces compétitions historiques, les préparatifs des chevaliers et l’intensité des charges, le tout en toute sécurité.',
    presentationContent: `
      <h2 class="text-2xl font-semibold mb-4">Vibrez au rythme des joutes équestres</h2>
      <p class="mb-3">
        Casques, écus et lances se préparent dans le fracas des armures. Sous les yeux du public,
        les chevaliers montent à cheval et s’élancent sur la lice pour des affrontements spectaculaires,
        inspirés des tournois d’antan.
      </p>
      <p class="mb-3">
        Avant le début des joutes, les équipes expliquent le déroulé, les règles et les différents
        types d’épreuves. Le public est invité à encourager son champion favori et à vivre chaque
        passe comme un véritable moment de bravoure.
      </p>
      <p>
        Derrière le spectacle, la sécurité reste une priorité&nbsp;: le show est minutieusement répété
        et chorégraphié pour offrir des sensations fortes sans danger pour les cavaliers ni les
        spectateurs.
      </p>
    `,
    locationId: undefined,
    canRegister: true,
    requestedLocationId: undefined,
  },
  {
    id: 7,
    providerId: 3,
    name: 'Spectacle des lumières',
    description:
      'Un spectacle nocturne où projections, jeux de lumière et bande-son originale transforment les remparts en décor vivant. Les images retracent les grandes légendes de Carcassonne et plongent les spectateurs dans une atmosphère à la fois poétique et impressionnante.',
    presentationContent: `
      <h2 class="text-2xl font-semibold mb-4">Les remparts s’illuminent à la nuit tombée</h2>
      <p class="mb-3">
        Dès que la lumière décline, les remparts se transforment en immense toile de projection.
        Des jeux de lumière, des couleurs et des images animées viennent épouser la pierre pour
        raconter les grandes légendes de Carcassonne.
      </p>
      <p class="mb-3">
        La bande-son, spécialement composée pour le spectacle, accompagne chaque tableau&nbsp;:
        batailles, scènes de vie, moments de paix ou de mystère se succèdent dans une mise en scène
        poétique et immersive.
      </p>
      <p>
        Ce spectacle en plein air est pensé comme un temps fort de la soirée, accessible à tous,
        invitant simplement à lever les yeux et à se laisser emporter par la magie des lieux.
      </p>
    `,
    locationId: undefined,
    canRegister: true,
    requestedLocationId: 8,
  },
  {
    id: 8,
    providerId: 5,
    name: "Médievalo Restau'",
    description:
      'Une expérience de restauration immersive où les visiteurs dégustent des plats inspirés des recettes médiévales, revisitées pour le confort moderne. Grandes tablées conviviales, vaisselle rustique et décor chaleureux complètent ce moment gourmand au cœur de la fête.',
    presentationContent: `
      <h2 class="text-2xl font-semibold mb-4">Partagez un repas aux saveurs médiévales</h2>
      <p class="mb-3">
        À la table du Médievalo Restau’, on s’installe sur de grandes tablées conviviales pour
        déguster des plats inspirés de recettes anciennes&nbsp;: viandes rôties, légumes mijotés,
        tartes rustiques et douceurs épicées.
      </p>
      <p class="mb-3">
        La carte revisite ces inspirations avec des produits locaux et une touche de modernité,
        afin de plaire au plus grand nombre tout en conservant l’esprit de l’époque. Le décor,
        la vaisselle et l’ambiance sonore complètent l’immersion.
      </p>
      <p>
        Que ce soit pour une pause rapide ou un véritable repas, c’est l’occasion de reprendre des
        forces et de prolonger l’expérience médiévale autour d’un moment chaleureux et gourmand.
      </p>
    `,
    locationId: undefined,
    canRegister: true,
    requestedLocationId: 7,
  },
]

const session = [
  {
    id: 1,
    activitiesId: 1,
    beginingDate: '2026-05-28',
    beginingHour: '14:30',
    duration: 30,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 2,
    activitiesId: 1,
    beginingDate: '2026-05-28',
    beginingHour: '14:30',
    duration: 25,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 3,
    activitiesId: 1,
    beginingDate: '2026-05-28',
    beginingHour: '14:30',
    duration: 40,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 4,
    activitiesId: 2,
    beginingDate: '2026-05-28',
    beginingHour: '10:00',
    duration: 30,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 5,
    activitiesId: 2,
    beginingDate: '2026-05-28',
    beginingHour: '11:00',
    duration: 25,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 6,
    activitiesId: 2,
    beginingDate: '2026-05-28',
    beginingHour: '15:00',
    duration: 40,
    nbPlace: 10,
    registersUsers: [3],
  },

  {
    id: 7,
    activitiesId: 3,
    beginingDate: '2026-05-28',
    beginingHour: '10:30',
    duration: 30,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 8,
    activitiesId: 3,
    beginingDate: '2026-05-28',
    beginingHour: '14:00',
    duration: 25,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 9,
    activitiesId: 3,
    beginingDate: '2026-05-28',
    beginingHour: '16:30',
    duration: 40,
    nbPlace: 10,
    registersUsers: [3],
  },

  {
    id: 10,
    activitiesId: 4,
    beginingDate: '2026-05-28',
    beginingHour: '09:30',
    duration: 30,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 11,
    activitiesId: 4,
    beginingDate: '2026-05-28',
    beginingHour: '13:00',
    duration: 25,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 12,
    activitiesId: 4,
    beginingDate: '2026-05-28',
    beginingHour: '17:00',
    duration: 40,
    nbPlace: 10,
    registersUsers: [3],
  },

  {
    id: 13,
    activitiesId: 5,
    beginingDate: '2026-05-28',
    beginingHour: '18:00',
    duration: 40,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 14,
    activitiesId: 5,
    beginingDate: '2026-05-28',
    beginingHour: '20:00',
    duration: 30,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 15,
    activitiesId: 5,
    beginingDate: '2026-05-28',
    beginingHour: '21:30',
    duration: 25,
    nbPlace: 10,
    registersUsers: [3],
  },

  {
    id: 16,
    activitiesId: 6,
    beginingDate: '2026-05-28',
    beginingHour: '11:30',
    duration: 30,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 17,
    activitiesId: 6,
    beginingDate: '2026-05-28',
    beginingHour: '15:30',
    duration: 25,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 18,
    activitiesId: 6,
    beginingDate: '2026-05-28',
    beginingHour: '17:30',
    duration: 40,
    nbPlace: 10,
    registersUsers: [3],
  },

  {
    id: 19,
    activitiesId: 7,
    beginingDate: '2026-05-28',
    beginingHour: '21:00',
    duration: 30,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 20,
    activitiesId: 7,
    beginingDate: '2026-05-28',
    beginingHour: '22:00',
    duration: 25,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 21,
    activitiesId: 7,
    beginingDate: '2026-05-28',
    beginingHour: '23:00',
    duration: 40,
    nbPlace: 10,
    registersUsers: [3],
  },

  {
    id: 22,
    activitiesId: 8,
    beginingDate: '2026-05-28',
    beginingHour: '12:00',
    duration: 60,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 23,
    activitiesId: 8,
    beginingDate: '2026-05-28',
    beginingHour: '19:00',
    duration: 60,
    nbPlace: 10,
    registersUsers: [3],
  },
  {
    id: 24,
    activitiesId: 8,
    beginingDate: '2026-05-28',
    beginingHour: '21:00',
    duration: 60,
    nbPlace: 10,
    registersUsers: [3],
  },
]

// const user = [{ type: UserTypeEnum.VISITOR }]
const users = [
  { id: 1, type: UserTypeEnum.ADMIN, mail: 'admin@gmail.com', passwword: 'admin' },
  { id: 2, type: UserTypeEnum.PROVIDER, mail: 'provider1@gmail.com', passwword: 'provider' },
  { id: 4, type: UserTypeEnum.PROVIDER, mail: 'provider2@gmail.com', passwword: 'provider' },
  { id: 5, type: UserTypeEnum.PROVIDER, mail: 'provider3@gmail.com', passwword: 'provider' },
  { id: 6, type: UserTypeEnum.PROVIDER, mail: 'provider4@gmail.com', passwword: 'provider' },
  { id: 7, type: UserTypeEnum.PROVIDER, mail: 'provider5@gmail.com', passwword: 'provider' },
  { id: 3, type: UserTypeEnum.VISITOR, mail: 'visitor1@gmail.com', passwword: 'visitor' },
  { id: 8, type: UserTypeEnum.VISITOR, mail: 'claire@gmail.com', passwword: 'claire' },
]
// const user = [{ id: 1, type: UserTypeEnum.PROVIDER }]
//const user = [{ id: 3, type: UserTypeEnum.VISITOR }]

export {
  contacts,
  surveys,
  providers,
  locations,
  users,
  newProviders,
  providerImages,
  presentation,
  activities,
  session,
}
