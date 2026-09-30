# Inventario servizi di terze parti

**Rilevazione del repository: 30 settembre 2026.** Le richieste server-side del provider di hosting non sono identificabili dal frontend.

| Servizio | Uso rilevato | Dati potenzialmente trasmessi | Avvio | Ruolo/base/trasferimento da verificare |
|---|---|---|---|---|
| Google Maps (`maps.google.com`, `www.google.com/maps`) | Iframe interattivo opzionale e link indicazioni | IP, user-agent e parametri URL; Google può trattare ulteriori identificatori/dati secondo la configurazione del servizio | Iframe soltanto dopo scelta esplicita; link solo su click | Google/entità provider, ruoli, cookie, retention, paese e meccanismo trasferimento: **[DA VERIFICARE]**. Documenti privacy/terms Google aggiornati: **[DA COMPLETARE]** |
| WhatsApp / Meta (`wa.me`) | Link di contatto, link ordine con testo precompilato | Dati tecnici; sul link d’ordine l’URL porta piatti, quantità, totale e campi nome/note se compilati | Solo click dell’utente; nessun SDK/script/iframe WhatsApp incorporato | Fornitore/ruoli, trattamento del contenuto messaggio, retention, localizzazione/trasferimenti e documentazione: **[DA VERIFICARE]**. WhatsApp privacy: https://www.whatsapp.com/legal/privacy-policy |
| Provider telefonico | Link `tel:` | Numero chiamato e dati tecnici della chiamata secondo operatore/dispositivo | Click dell’utente, tramite app/OS | Operatore e basi per la gestione richiesta/ordine: **[DA VERIFICARE]** |
| Hosting statico **[DA COMPLETARE]** | Consegna HTML, CSS, JS, `menu.json`, immagini | Almeno richieste di rete; IP e user-agent potenzialmente nei log | Automatico ad ogni visita | Provider, subfornitori, DPA/ruolo, region, log/backup, HTTPS, sicurezza, retention e trasferimenti: **[DA VERIFICARE]** |

## Servizi non trovati nel repository

Nessun backend/API applicativo, database, account/autenticazione, pagamento online, sistema di prenotazione, form contatti/email, newsletter, analytics (Google Analytics, Matomo, Plausible, PostHog, Hotjar, Clarity), advertising, social plugin/embed, video embed, CAPTCHA, CDN referenziato dal codice, error tracking o SDK (Sentry/Firebase/Supabase/AWS/Azure) identificato. Non sono presenti Google Fonts dopo rimozione dei riferimenti remoti; le immagini e i file font non sono ospitati esternamente.

## Sicurezza dei collegamenti

I link con `target="_blank"` sono marcati `rel="noopener"` o `rel="noopener noreferrer"`; i link Maps esterni trasmettono l’indirizzo pubblico richiesto. La pagina non usa chiamate `fetch` verso origini terze, eccetto la creazione condizionata dell’iframe Maps. `fetch(menu.json)` è relativo allo stesso origin.

## Azioni manuali richieste

1. Identificare hosting effettivo e configurazioni DNS/CDN/proxy; esaminare DPA, regione, sub-responsabili, log, backup e data retention.
2. Verificare rete/cookie di Maps prima/dopo consenso e consultare documentazione ufficiale Google del prodotto effettivo.
3. Confermare contratto e prassi WhatsApp per ordini (chi riceve il telefono, accesso condiviso, esportazioni, backup, cancellazione, eventuale gestione allergie).
4. Definire se ristorante e fornitori agiscono da titolari autonomi o responsabili per ciascun flusso; non è deducibile dal codice.
5. Confermare policy trasferimenti internazionali (adeguatezza/SCC e misure supplementari ove necessarie) con documenti aggiornati.
