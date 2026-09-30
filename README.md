# Rosticceria Cina · Udine

Sito statico in HTML, CSS e JavaScript, senza backend. `menu.json` è la fonte dati canonica; le pagine Menù e Ordina leggono gli stessi piatti. Il carrello e i campi nome/note sono temporanei nella scheda corrente: non vengono salvati dal sito. L’utente può aprire un messaggio d’ordine precompilato su WhatsApp.

## Avvio consigliato

Aprire la cartella con un server statico locale (ad esempio Live Server in VS Code) e avviare `index.html`. In questo modo il sito carica direttamente `menu.json`, esattamente come farà dopo la pubblicazione.

Il sito include anche una copia di ripiego del menù per l’anteprima diretta via `file://`, quando il browser blocca il caricamento di JSON locali. Per mantenere questa anteprima sincronizzata, modificare `menu.json` come sorgente e rigenerare [menu-fallback-inline.js](menu-fallback-inline.js) oppure usare sempre un server locale.

## Pubblicazione

Pubblicare la cartella del progetto su GitHub Pages, Netlify, Vercel o qualsiasi hosting statico. Non servono build, dipendenze o backend. Nella stessa cartella pubblicata devono essere presenti `index.html`, `app.js`, `styles.css`, `menu.json`, gli script di fallback e le foto locali utilizzate dalla pagina.

## Aggiornare il menù

Modificare `menu.json`. I prezzi sono memorizzati in centesimi interi; `surgelato` determina l’asterisco. Le righe marcate `verifica` ricordano i dettagli trascritti da confermare sul listino originale. Il carrello non persiste tra ricaricamenti.

## Privacy e terze parti

Google Maps incorporata è bloccata fino a una scelta esplicita; il rifiuto non limita il sito e la preferenza può essere modificata dal footer. I font usano fallback locali, senza Google Fonts. L’apertura del link ordine avvia WhatsApp solo dopo un’azione dell’utente; nome e note sono facoltativi e temporanei nel browser. L’hosting può trattare dati tecnici e log secondo la propria configurazione: identificare il provider e completare le verifiche indicate in `LEGAL_COMPLIANCE.md` prima della pubblicazione.

Documentazione tecnica: [PRIVACY_POLICY.md](PRIVACY_POLICY.md), [COOKIE_POLICY.md](COOKIE_POLICY.md), [COOKIE_AUDIT.md](COOKIE_AUDIT.md), [THIRD_PARTY_SERVICES.md](THIRD_PARTY_SERVICES.md), [DATA_RETENTION.md](DATA_RETENTION.md), [LEGAL_COMPLIANCE.md](LEGAL_COMPLIANCE.md). I placeholder `[DA COMPLETARE]` / `DA VERIFICARE MANUALMENTE` richiedono informazioni reali del titolare e dell’hosting; i documenti non attestano una conformità legale assoluta.

## Contatti e asset

Telefono: 0432 229873 · WhatsApp: 389 4742589 · Via Antonio Caccia 93, 33100 Udine. Le foto sono nella cartella `photo/` e nella cartella del sito.
