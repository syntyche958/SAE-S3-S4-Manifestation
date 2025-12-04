import { UserTypeEnum } from '@/enums/User.enum'

const providers = [
  { id: 1, userId: 2, name: 'Centre équestre', description: 'Petite description de provider 1' },
  {
    id: 2,
    userId: 4,
    name: 'Ville de carcassonne',
    description: 'Petite description de provider 2',
  },
  {
    id: 3,
    userId: 5,
    name: 'Remparts et lumière',
    description: 'Petite description de provider 3',
  },
  {
    id: 4,
    userId: 6,
    name: 'Troubadours moderne',
    description: 'Petite description de provider 4',
  },
  {
    id: 5,
    userId: 7,
    name: 'Camion de restauration',
    description: 'Petite description de provider 5',
  },
]

const presentation = {
  small:
    '<p>Plongez dans l’univers médiéval de Carcassonne grâce à un événement unique mêlant animations, spectacles et activités accessibles à tous.</p>',
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
    nbPlace:10,
  },
  {
    id: 2,
    activitiesId: 2,
    beginingDate: '2025-11-16',
    beginingHour: '14:30',
    duration: 25,
    nbPlace:10,
  },
  {
    id: 3,
    activitiesId: 3,
    beginingDate: '2025-11-20',
    beginingHour: '14:30',
    duration: 40,
    nbPlace:10,
  },
]

const user = [{ id: 1, type: UserTypeEnum.ADMIN }]
// const user = [{ id: 1, type: UserTypeEnum.PROVIDER }]
// const user = [{ id: 3, type: UserTypeEnum.VISITOR }]

export {
  contacts,
  providers,
  locations,
  user,
  newProviders,
  providerImages,
  presentation,
  activities,
  session,
}
