export const ActivitySpotStatusEnum = Object.freeze({
  AVAILABLE: 'available',
  PENDING: 'pending',
  OCCUPIED: 'occupied',
  ACCEPTED: 'accepted',
  /** Mode prestataire : capsules (bleu / vert / jaune / rouge) */
  PROVIDER_FREE: 'provider_free',
  /** Réservé confirmé (spotIds) pour l’activité courante */
  PROVIDER_SELF: 'provider_self',
  /** Demande en cours (requestedSpotIds) pour l’activité courante */
  PROVIDER_PENDING: 'provider_pending',
  PROVIDER_OTHER: 'provider_other',
  /** Mode admin : légende bleu / orange / vert (sens différent du prestataire) */
  ADMIN_FREE: 'admin_free',
  ADMIN_PENDING: 'admin_pending',
  ADMIN_RESERVED: 'admin_reserved',
})
