import { UserTypeEnum } from '@/enums/User.enum'

const providers = [
  { id: 1, name: 'Centre équestre' },
  { id: 2, name: 'Ville de carcassonne' },
  { id: 3, name: 'Remparts et lumière' },
  { id: 4, name: 'Troubadours moderne' },
  { id: 5, name: '« Camion de restauration »' },
]

const presentation = {
  small: "<p>Petite de description de l'envent familiale et tout et tout ! Venez nombreux</p>",
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
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1s.jpg',
        alt: 'Description for Image 1',
        title: 'Title 1',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria2.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria2s.jpg',
        alt: 'Description for Image 2',
        title: 'Title 2',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria3.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria3s.jpg',
        alt: 'Description for Image 3',
        title: 'Title 3',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria4.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria4s.jpg',
        alt: 'Description for Image 4',
        title: 'Title 4',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria5.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria5s.jpg',
        alt: 'Description for Image 5',
        title: 'Title 5',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria6.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg',
        alt: 'Description for Image 6',
        title: 'Title 6',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria7.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria7s.jpg',
        alt: 'Description for Image 7',
        title: 'Title 7',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria8.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria8s.jpg',
        alt: 'Description for Image 8',
        title: 'Title 8',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria9.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria9s.jpg',
        alt: 'Description for Image 9',
        title: 'Title 9',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10s.jpg',
        alt: 'Description for Image 10',
        title: 'Title 10',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria11.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria11s.jpg',
        alt: 'Description for Image 11',
        title: 'Title 11',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria12.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria12s.jpg',
        alt: 'Description for Image 12',
        title: 'Title 12',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria13.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria13s.jpg',
        alt: 'Description for Image 13',
        title: 'Title 13',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria14.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria14s.jpg',
        alt: 'Description for Image 14',
        title: 'Title 14',
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria15.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria15s.jpg',
        alt: 'Description for Image 15',
        title: 'Title 15',
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
    mail: 'john.doe@gmail.com',
    providerId: 1,
    activityId: null,
    message: "Bonjour, j'aimerais savoir si il y a une limite de poids pour la balade à cheval ?",
  },
]

const user = [{ type: UserTypeEnum.ADMIN }]
// const user = [{ id: 1, type: UserTypeEnum.PROVIDER }]
// const user = [{ type: UserTypeEnum.VISITOR }]

export { contacts, providers, locations, user, newProviders, providerImages, presentation }
