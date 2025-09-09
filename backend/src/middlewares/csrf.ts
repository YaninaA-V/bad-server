import { CSRF_COOKIE_NAME, CSRF_SECRET } from '../config'
import { doubleCsrf } from 'csrf-csrf'


export const { invalidCsrfTokenError, generateCsrfToken, doubleCsrfProtection } = 
doubleCsrf({
    getSecret: () => CSRF_SECRET,
    cookieName: CSRF_COOKIE_NAME,
    getSessionIdentifier: () => 'default-session',
    cookieOptions: { sameSite: false, secure: false },
})


