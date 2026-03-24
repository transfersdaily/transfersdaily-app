// Translation utilities for multi-language support

export interface Translation {
  [key: string]: string | Translation
}

export interface Translations {
  [language: string]: Translation
}

// Common UI translations
export const commonTranslations: Translations = {
  en: {
    navigation: {
      home: 'Home',
      search: 'Search',
      leagues: 'Leagues',
      players: 'Players',
      clubs: 'Clubs',
      transfers: 'Transfers',
      news: 'News'
    },
    actions: {
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      share: 'Share',
      like: 'Like',
      comment: 'Comment',
      readMore: 'Read More',
      showMore: 'Show More',
      showLess: 'Show Less'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      noResults: 'No results found',
      tryAgain: 'Try again',
      reload: 'Reload'
    },
    footer: {
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      newsletter: 'Newsletter',
      social: 'Follow Us'
    },
    sidebar: {
      recommended: 'Recommended Articles',
      trending: 'Most Searched',
      recentSearches: 'Recent Searches',
      noRecentSearches: 'No recent searches'
    }
  },
  es: {
    navigation: {
      home: 'Inicio',
      search: 'Buscar',
      leagues: 'Ligas',
      players: 'Jugadores',
      clubs: 'Clubes',
      transfers: 'Traspasos',
      news: 'Noticias'
    },
    actions: {
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      share: 'Compartir',
      like: 'Me gusta',
      comment: 'Comentar',
      readMore: 'Leer más',
      showMore: 'Mostrar más',
      showLess: 'Mostrar menos'
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      info: 'Información',
      noResults: 'No se encontraron resultados',
      tryAgain: 'Intentar de nuevo',
      reload: 'Recargar'
    },
    footer: {
      about: 'Acerca de',
      contact: 'Contacto',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      newsletter: 'Boletín',
      social: 'Síguenos'
    },
    sidebar: {
      recommended: 'Artículos Recomendados',
      trending: 'Más Buscado',
      recentSearches: 'Búsquedas Recientes',
      noRecentSearches: 'No hay búsquedas recientes'
    }
  },
  fr: {
    navigation: {
      home: 'Accueil',
      search: 'Rechercher',
      leagues: 'Ligues',
      players: 'Joueurs',
      clubs: 'Clubs',
      transfers: 'Transferts',
      news: 'Actualités'
    },
    actions: {
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      share: 'Partager',
      like: 'J\'aime',
      comment: 'Commenter',
      readMore: 'Lire la suite',
      showMore: 'Afficher plus',
      showLess: 'Afficher moins'
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Avertissement',
      info: 'Information',
      noResults: 'Aucun résultat trouvé',
      tryAgain: 'Réessayer',
      reload: 'Recharger'
    },
    footer: {
      about: 'À propos',
      contact: 'Contact',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      newsletter: 'Newsletter',
      social: 'Nous suivre'
    },
    sidebar: {
      recommended: 'Articles Recommandés',
      trending: 'Plus Recherché',
      recentSearches: 'Recherches Récentes',
      noRecentSearches: 'Aucune recherche récente'
    }
  },
  de: {
    navigation: {
      home: 'Startseite',
      search: 'Suchen',
      leagues: 'Ligen',
      players: 'Spieler',
      clubs: 'Vereine',
      transfers: 'Transfers',
      news: 'Nachrichten'
    },
    actions: {
      search: 'Suchen',
      filter: 'Filter',
      sort: 'Sortieren',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      view: 'Ansehen',
      share: 'Teilen',
      like: 'Gefällt mir',
      comment: 'Kommentieren',
      readMore: 'Weiterlesen',
      showMore: 'Mehr anzeigen',
      showLess: 'Weniger anzeigen'
    },
    common: {
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
      warning: 'Warnung',
      info: 'Information',
      noResults: 'Keine Ergebnisse gefunden',
      tryAgain: 'Erneut versuchen',
      reload: 'Neu laden'
    },
    footer: {
      about: 'Über uns',
      contact: 'Kontakt',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      newsletter: 'Newsletter',
      social: 'Folgen Sie uns'
    },
    sidebar: {
      recommended: 'Empfohlene Artikel',
      trending: 'Meist Gesucht',
      recentSearches: 'Letzte Suchen',
      noRecentSearches: 'Keine letzten Suchen'
    }
  },
  it: {
    navigation: {
      home: 'Home',
      search: 'Cerca',
      leagues: 'Campionati',
      players: 'Giocatori',
      clubs: 'Club',
      transfers: 'Trasferimenti',
      news: 'Notizie'
    },
    actions: {
      search: 'Cerca',
      filter: 'Filtra',
      sort: 'Ordina',
      save: 'Salva',
      cancel: 'Annulla',
      delete: 'Elimina',
      edit: 'Modifica',
      view: 'Visualizza',
      share: 'Condividi',
      like: 'Mi piace',
      comment: 'Commenta',
      readMore: 'Leggi di più',
      showMore: 'Mostra di più',
      showLess: 'Mostra di meno'
    },
    common: {
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      warning: 'Avviso',
      info: 'Informazione',
      noResults: 'Nessun risultato trovato',
      tryAgain: 'Riprova',
      reload: 'Ricarica'
    },
    footer: {
      about: 'Chi siamo',
      contact: 'Contatti',
      privacy: 'Privacy Policy',
      terms: 'Termini di Servizio',
      newsletter: 'Newsletter',
      social: 'Seguici'
    },
    sidebar: {
      recommended: 'Articoli Consigliati',
      trending: 'Più Cercato',
      recentSearches: 'Ricerche Recenti',
      noRecentSearches: 'Nessuna ricerca recente'
    }
  }
}

// Translation utility function
export function getTranslation(
  language: string,
  key: string,
  fallbackLanguage: string = 'en'
): string {
  const keys = key.split('.')
  
  // Try to get translation in preferred language
  let translation: any = commonTranslations[language]
  if (translation) {
    for (const k of keys) {
      translation = translation[k]
      if (!translation) break
    }
    if (typeof translation === 'string') {
      return translation
    }
  }
  
  // Fallback to fallback language
  let fallbackTranslation: any = commonTranslations[fallbackLanguage]
  if (fallbackTranslation) {
    for (const k of keys) {
      fallbackTranslation = fallbackTranslation[k]
      if (!fallbackTranslation) break
    }
    if (typeof fallbackTranslation === 'string') {
      return fallbackTranslation
    }
  }
  
  // Return key if no translation found
  return key
}

// Hook for translations
export function useTranslations() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('transfersdaily_language') || 'en'
    setCurrentLanguage(savedLanguage)

    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  const t = (key: string) => getTranslation(currentLanguage, key)

  return { t, currentLanguage }
}

// React imports
import { useState, useEffect } from 'react'