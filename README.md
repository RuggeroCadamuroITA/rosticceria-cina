# Rosticceria Cina · Udine

Sito statico in HTML, CSS e JavaScript, senza backend. `menu.json` è la fonte dati canonica; le pagine Menù e Ordina leggono gli stessi piatti. Gli ordini vengono composti nel browser e inviati tramite WhatsApp.

## Avvio consigliato

Aprire la cartella con un server statico locale (ad esempio Live Server in VS Code) e avviare `index.html`. In questo modo il sito carica direttamente `menu.json`, esattamente come farà dopo la pubblicazione.

Il sito include anche una copia di ripiego del menù per l'anteprima diretta via `file://`, quando il browser blocca il caricamento di JSON locali. Per mantenere questa anteprima sincronizzata, modificare `menu.json` come sorgente e rigenerare [menu-fallback-inline.js](menu-fallback-inline.js) oppure usare sempre un server locale.

## Pubblicazione

Pubblicare la cartella del progetto su GitHub Pages, Netlify, Vercel o qualsiasi hosting statico. Non servono build, dipendenze o backend. Nella stessa cartella pubblicata devono essere presenti `index.html`, `app.js`, `styles.css`, `menu.json`, gli script di fallback e le foto locali utilizzate dalla pagina.

## Aggiornare il menù

Modificare `menu.json`. I prezzi sono memorizzati in centesimi interi; `surgelato` determina l'asterisco. Le righe marcate `verifica` ricordano i dettagli trascritti da confermare sul listino originale. Gli ordini salvati in localStorage restano sul dispositivo del cliente.

## Contatti e asset

Telefono: 0432 229873 · WhatsApp: 389 4742589 · Via Antonio Caccia 93, 33100 Udine. Le foto sono nella cartella `photo/` e nella cartella del sito. Font esterni e mappa richiedono una connessione internet.
