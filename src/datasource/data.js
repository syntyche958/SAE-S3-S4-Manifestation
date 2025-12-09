import { UserTypeEnum } from '@/enums/User.enum'

const providers = [
  {
    id: 1,
    userId: 2,
    name: 'Centre équestre',
    description:
      'Un espace dédié aux amoureux des chevaux, où petits et grands découvrent des balades en poney encadrées par une équipe passionnée. Chaque sortie est pensée pour offrir un moment doux, rassurant et immersif dans l’univers équestre.',
  },
  {
    id: 2,
    userId: 4,
    name: 'Ville de carcassonne',
    description:
      'L’équipe officielle qui fait vivre la cité médiévale. Entre gestion des animations, mise en valeur du patrimoine et accueil chaleureux, elle veille à offrir une expérience authentique et mémorable à chaque visiteur.',
  },
  {
    id: 3,
    userId: 5,
    name: 'Remparts et lumière',
    description:
      'Les créateurs du spectacle nocturne emblématique : un voyage visuel et sonore qui illumine les remparts et plonge le public dans les légendes de Carcassonne. Une expérience féerique, incontournable et chargée d’émotion.',
  },
  {
    id: 4,
    userId: 6,
    name: 'Troubadours moderne',
    description:
      'Une troupe d’artistes qui réinvente l’art des troubadours. Musiciens, conteurs et comédiens transportent les visiteurs avec énergie, humour et poésie, créant une ambiance vivante et chaleureuse dans toute la cité.',
  },
  {
    id: 5,
    userId: 7,
    name: 'Camion de restauration',
    description:
      'Un food-truck convivial qui revisite les saveurs médiévales. Plats généreux, recettes inspirées d’antan et produits locaux : une pause gourmande qui réchauffe et rassemble les visiteurs autour d’une cuisine authentique.',
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
      },
      {
        itemImageSrc: '/uploads/chevaux2.jpg',
        thumbnailImageSrc: '/uploads/chevaux2.jpg',
        alt: 'Description for Image 7',
        title: 'Title 7',
      },
      {
        itemImageSrc: '/uploads/chevaux3.jpg',
        thumbnailImageSrc: '/uploads/chevaux3.jpg',
        alt: 'Description for Image 8',
        title: 'Title 8',
      },
      {
        itemImageSrc: '/uploads/chevaux4.jpg',
        thumbnailImageSrc: '/uploads/chevaux4.jpg',
        alt: 'Description for Image 9',
        title: 'Title 9',
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
      },
      {
        itemImageSrc: '/uploads/ville2.jpg',
        thumbnailImageSrc: '/uploads/ville2.jpg',
        alt: 'Description for Image 7',
        title: 'Title 7',
      },
      {
        itemImageSrc: '/uploads/ville3.jpg',
        thumbnailImageSrc: '/uploads/ville3.jpg',
        alt: 'Description for Image 8',
        title: 'Title 8',
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
      },
      {
        itemImageSrc: '/uploads/remparts2.jpg',
        thumbnailImageSrc: '/uploads/remparts2.jpg',
        alt: 'Description for Image 7',
        title: 'Title 7',
      },
      {
        itemImageSrc: '/uploads/remparts3.jpg',
        thumbnailImageSrc: '/uploads/remparts3.jpg',
        alt: 'Description for Image 8',
        title: 'Title 8',
      },
      {
        itemImageSrc: '/uploads/remparts4.jpg',
        thumbnailImageSrc: '/uploads/remparts4.jpg',
        alt: 'Description for Image 9',
        title: 'Title 9',
      },
      {
        itemImageSrc: '/uploads/remparts5.jpg',
        thumbnailImageSrc: '/uploads/remparts5.jpg',
        alt: 'Description for Image 9',
        title: 'Title 9',
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
    description: 'Description de la balade à cheval',
    presentationContent: "<h1>Le cheval c'est <b>fun</b> !</h1>",
    locationId: undefined,
    canRegister: false,
    requestedLocationId: undefined,
  },
  {
    id: 2,
    providerId: 2,
    name: "Fabrication d'épée en bois",
    description: 'Activité pratique artistique',
    presentationContent: "<h1>L'art c'est génial !</h1>",
    locationId: undefined,
    canRegister: false,
    requestedLocationId: undefined,
  },
  {
    id: 3,
    providerId: 4,
    name: 'Chasse à la sorcière ',
    description: 'Spectacle pour enfant',
    presentationContent: "<h1>Le spectacle c'est génial !</h1>",
    locationId: undefined,
    canRegister: false,
    requestedLocationId: undefined,
  },
  {
    id: 4,
    providerId: 2,
    name: "Tir à l'arc",
    description: 'Activité physique de précision',
    presentationContent: "<h1>Le tir à l'arc c'est génial !</h1>",
    locationId: undefined,
    canRegister: false,
    requestedLocationId: undefined,
  },
  {
    id: 5,
    providerId: 4,
    name: 'Concert médiéval',
    description: "Instruments liés à l'époque",
    presentationContent: "<h1>Le concert c'est génial !</h1>",
    locationId: undefined,
    canRegister: false,
    requestedLocationId: undefined,
  },
  {
    id: 6,
    providerId: 1,
    name: 'Tournois de joute',
    description: 'Activité physique',
    presentationContent: "<h1>La compétition c'est génial !</h1>",
    locationId: undefined,
    canRegister: false,
    requestedLocationId: undefined,
  },
  {
    id: 7,
    providerId: 3,
    name: 'Spectacle des lumières',
    description: 'Spectacle',
    presentationContent: "<h1>Le spectacle c'est génial !</h1>",
    locationId: undefined,
    canRegister: false,
    requestedLocationId: undefined,
  },
  {
    id: 8,
    providerId: 5,
    name: "Médievalo Restau'",
    description: 'Restaurant de spécialités de l’époque',
    presentationContent: "<h1>Bien manger c'est important !</h1>",
    locationId: undefined,
    canRegister: false,
    requestedLocationId: undefined,
  },
]

const session = [
  {
    id: 1,
    activitiesId: 1,
    beginingDate: '2025-11-15',
    beginingHour: '14:30',
    duration: 30,
    nbPlace: 10,
  },
  {
    id: 2,
    activitiesId: 1,
    beginingDate: '2025-11-16',
    beginingHour: '14:30',
    duration: 25,
    nbPlace: 10,
  },
  {
    id: 3,
    activitiesId: 1,
    beginingDate: '2025-11-20',
    beginingHour: '14:30',
    duration: 40,
    nbPlace: 10,
  },
]


const user = [{ type: UserTypeEnum.VISITOR }]
// const user = [{ id: 1, type: UserTypeEnum.PROVIDER }]
//const user = [{ id: 3, type: UserTypeEnum.VISITOR }]

export {
  contacts,
  surveys,
  providers,
  locations,
  user,
  newProviders,
  providerImages,
  presentation,
  activities,
  session,
}
