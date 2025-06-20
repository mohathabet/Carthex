import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

const appConfig = require('electron').remote.require('electron-settings');
const defaultLanguage = appConfig.get('general.language') || 'en';
const isDev = require('electron-is-dev');
const moment = require('moment');
import 'moment/locale/ar';   // keep Arabic month/day names

// --- Neutral-digits patch -------------------------------------------
const lat  = '0123456789';
const arab = '٠١٢٣٤٥٦٧٨٩';
// overwrite ONLY the part that swaps digits
moment.updateLocale('ar', {
  postformat: str =>
    str.replace(/[٠-٩]/g, d => lat[arab.indexOf(d)])
});
// --------------------------------------------------------------------

// Language Files
import en from './en';
import fr from './fr';
import ar from './ar/';

i18n.use(reactI18nextModule).init({
  lng: defaultLanguage,
  fallbackLng: 'en',
  debug: isDev,
  defaultNS: 'form',
  resources: {
    en,
    fr,
    ar
  },
  interpolation: {
    function(value, format, lng) {
      if (value instanceof Date) return moment(value).format(format);
      return value;
    },
  },
  react: {
    wait: false,
    bindI18n: false,
    bindStore: false,
    nsMode: false,
  },
});

/* ------------------------------------------------------------------
 *  RTL / LTR †
 * ------------------------------------------------------------------
 * 1. Define which languages are RTL.
 * 2. Apply the correct dir= attribute once at boot.
 * 3. Update it every time the user changes language.
 * ------------------------------------------------------------------ */
const RTL_LANGS = ['ar'];          // extend with 'he', 'fa', 'ur' … if needed

function applyDir(lang) {
  document.documentElement.setAttribute(
    'dir',
    RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'
  );
}

// Initial boot
moment.locale(defaultLanguage);
applyDir(defaultLanguage);

// Subsequent language changes
i18n.on('languageChanged', currentLang => {
  moment.locale(currentLang);     // keep Moment.js synced
  applyDir(currentLang);          // flip direction if necessary
});

export default i18n;
