# Cookie Policy e strumenti di memorizzazione

**Ultimo aggiornamento: 30 settembre 2026**

> Documento tecnico da validare rispetto alla configurazione pubblicata di hosting, dominio e provider. Non è stato eseguito un audit di rete su browser multipli.

## Stato rilevato nel codice

Non sono presenti nel repository cookie impostati da script del sito, pixel, analytics, advertising, fingerprinting, SDK o tag manager. Non risultano Google Fonts/CDN: i riferimenti esterni ai font sono stati rimossi. HTML, CSS, JavaScript, menu e immagini sono serviti localmente dal dominio del sito. La ricerca `fetch` riguarda solo `menu.json` sullo stesso origin.

| Nome/chiave | Provider | Tipo | Finalità | Durata | Consenso |
|---|---|---|---|---|---|
| `rosticceria-cina-google-maps-consent-v1` (localStorage) | Sito / browser dell’utente | Memoria locale first-party; non cookie HTTP | Memorizza valore `googleMaps`, timestamp e versione della scelta; permette di ricordare consenso o rifiuto | Scade dopo 183 giorni; cancellabile dall’utente o con cancellazione dati sito | Non è tracking; usata per ricordare la scelta. La mappa esterna viene comunque caricata solo dopo consenso esplicito |
| `rosticceria-cina-order-v1` (vecchia chiave) | Sito / browser dell’utente | Chiave legacy, non più scritta | Pulizia di vecchi dati d’ordine/nome/note creati da versioni precedenti | Rimossa all’inizializzazione; il codice elimina da localStorage e sessionStorage | Non applicabile |
| Carrello, nome, note | Memoria JavaScript della scheda | Stato volatile; nessun cookie/storage | Composizione ordine | Fino a ricaricamento/chiusura della pagina | Non applicabile |
| Cookie eventualmente impostati dal provider hosting | Hosting **[DA COMPLETARE]** | Da verificare | Erogazione, sicurezza, bilanciamento o altre finalità determinate dal provider | **[DA VERIFICARE nel pannello e documenti hosting]** | Da valutare per ciascun cookie/strumento effettivo; non deducibile dal repository |
| Cookie o tecnologie Google Maps | Google | Terza parte, solo dopo scelta esplicita (o accesso volontario al link Google) | Mappa/servizio richiesto dall’utente; Google può impostare strumenti propri | **[DA VERIFICARE su test reale e documentazione aggiornata Google]** | Sì, il caricamento dell’embed è bloccato fino alla scelta esplicita |
| Dati tecnici della richiesta Google Maps | Google | Terza parte | Consegnare mappa/indicazioni; almeno IP e dati di richiesta possono essere trattati | **[DA VERIFICARE]** | Embed solo dopo consenso. Il link esterno viene attivato volontariamente dall’utente |

La chiave locale memorizza anche il rifiuto per ricordare che non si deve caricare la mappa. Il record non viene inviato al server dal codice. Il pulsante footer “Gestisci preferenze cookie” consente di aggiornare o revocare la scelta; la revoca rimuove l’iframe già creato e il successivo stato di consenso è impostato su `false`.

## Banner iniziale e gestione della scelta

Alla prima visita, se non è ancora registrata una decisione valida, il banner mostra scelte separate ed equivalenti: **Accetta** (abilita il caricamento facoltativo di Google Maps), **Rifiuta** e **Personalizza** (apre le preferenze). Nessuna mappa viene caricata dal solo banner; il consenso consente il caricamento dell’iframe Maps e non attiva strumenti di analytics o marketing, che il sito non integra.

- **Consenti mappa**: registra la preferenza e solo allora crea l’iframe Google.
- **Rifiuta mappa**: registra il rifiuto e mantiene la mappa bloccata; il sito resta utilizzabile.
- **Personalizza/modifica**: nel dialog si può selezionare o deselezionare l’unica categoria presente (servizio esterno Google Maps).
- **Revoca**: footer → “Gestisci preferenze cookie” → “Rifiuta e revoca il consenso”. Il frame viene rimosso.

Non esistono categorie analytics o marketing. Il banner iniziale riguarda esclusivamente la scelta opzionale di Google Maps e non condiziona la navigazione o l’ordine.

## Limiti e verifiche richieste

Il repository da solo non può rivelare cookie HTTP `Set-Cookie`, log o storage introdotti dal provider di hosting, estensioni del browser, una configurazione CDN/DNS o l’embed Google in ambiente reale. Prima della pubblicazione occorre verificare in DevTools (profilo pulito): primo accesso, rifiuto, consenso, revoca e link Google esterno; controllare Cookies, Local Storage, Session Storage, IndexedDB e Network. Se il provider imposta strumenti non tecnici, aggiornare questo documento e implementare un blocco preventivo adeguato.

## Fonti

- Garante Privacy, Linee guida cookie e altri strumenti di tracciamento (10 giugno 2021): https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- Garante Privacy, FAQ cookie: https://www.garanteprivacy.it/faq/Cookie
- D.lgs. 196/2003, art. 122, testo vigente: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-06-30;196
