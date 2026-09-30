# Cookie e tracking audit

**Audit statico effettuato il 30 settembre 2026.** Nessuna scansione automatica live dei browser o delle risposte HTTP dell’hosting è stata possibile in questa fase.

## Inventario del codice

| Elemento | Origine/dominio | Quando | Finalità / dati | Categoria e consenso |
|---|---|---|---|---|
| Cookie creati dal codice applicativo | Nessuno rilevato | — | Nessuno | Non applicabile |
| localStorage `rosticceria-cina-google-maps-consent-v1` | First-party (origin sito) | Dopo scelta mappa, o lettura all’avvio | Booleano, timestamp e versione | Preferenza; nessun ID analitico/marketing e nessun invio server osservato |
| localStorage/sessionStorage `rosticceria-cina-order-v1` | First-party, legacy | Rimosso durante avvio | Versioni precedenti potevano persistere carrello/nome/note | Il sito corrente non lo riscrive; rimozione implementata |
| Carrello, nome, note | JavaScript volatile | Dopo input utente | Dati ordine inseriti intenzionalmente; nessun persistente | Necessari solo localmente per preparare il testo, facoltativi nome/note |
| Iframe maps.google.com | Google, terza parte | Solo dopo consenso Maps valido/esplicito | IP e dati della richiesta; possibili strumenti Google non inventariabili staticamente | Bloccato fino al consenso; durata/cookie del provider da testare |
| Link Google Maps/WhatsApp | Google / Meta, terza parte | Solo click | Dati tecnici browser e dati di URL; WhatsApp riceve il testo ordine solo se il sito apre il link con testo precompilato | Interazione esterna deliberata, distinta dall’embed |
| WhatsApp `wa.me` ordine | Meta/WhatsApp | Click su invio ordine | Piatti, quantità, totale, nome e note opzionali nel parametro URL | Non parte prima dell’azione utente; invio effettivo del messaggio è scelta dell’utente |
| `fetch(menu.json)` | Stesso origin del sito | Caricamento pagina | Richiesta asset statico; server può vedere dati tecnici | Nessun provider analytics; log hosting da verificare |
| Fonts/CDN/analytics/pixel/ads/social embed/CAPTCHA | Nessuno nel codice dopo rimozione font remoti | — | — | Non rilevati |

Nessun `document.cookie`, IndexedDB, sessionStorage applicativo, canvas/WebGL fingerprinting o beacon trovato. Le immagini sono locali. Il `script type="application/ld+json"` include schema statico e non fa richieste.

## Verifica statica del flusso mappa

1. Primo accesso: HTML contiene solo placeholder; `iframe` non esiste e la preferenza assente equivale a nessun consenso.
2. Rifiuto: salva `googleMaps:false`, non crea iframe.
3. Accettazione: registra `googleMaps:true`, solo dopo crea iframe con `loading=lazy` e `referrerPolicy=no-referrer`.
4. Revoca: sostituisce l’iframe con placeholder e memorizza `false`.
5. Persistenza: consenso valido massimo 183 giorni, versione CMP registrata; scaduto/invalid viene ignorato.

Questi comportamenti sono verificati dal codice, non ancora con DevTools Network/browser automated. Una revoca non può annullare richieste/dati già ricevuti dal provider.

## Stato del banner/CMP

Non si usa un cookie banner generale perché nel codice non esistono analytics/advertising/marketing. Il controllo è contestuale alla mappa: presenta descrizione, accetta, rifiuta, personalizza, gestisci/revoca e link alle policy. Consenso e rifiuto sono scelte reali e la mappa non è necessaria per navigare/ordinare. Resta da verificare accessibilità effettiva con tastiera e screen reader nei browser target.

## Checklist live ancora necessaria

- [ ] Chrome profilo pulito, prima visita: nessuna richiesta a Google Maps prima dell’azione; controllare Network e storage.
- [ ] Rifiuto: reload, nessun iframe o richiesta Maps.
- [ ] Accettazione: richiesta iframe solo dopo scelta; registrare domini, cookies e local storage realmente presenti.
- [ ] Revoca dopo consenso: frame rimosso; successivo reload nessun caricamento automatico.
- [ ] Verificare cookie `Set-Cookie` del provider hosting e strumenti eventualmente iniettati da hosting/CDN.
- [ ] Ripetere almeno Firefox, Edge e Safari/iOS disponibili, mobile e navigazione privata.
- [ ] Verificare che i link esterni attivati volontariamente abbiano l’informativa/link appropriati e rel sicuri.

## Normativa e fonti ufficiali consultate

- Linee guida Garante 10 giugno 2021, doc. web 9677876: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876 (endpoint ufficiale raggiunto dalla ricerca web, ma il fetch testuale diretto ha restituito errore socket).
- FAQ Garante: https://www.garanteprivacy.it/faq/Cookie (testo diretto non estraibile nello strumento; consultare il sito al controllo finale).
- Codice Privacy, art. 122: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-06-30;196
- GDPR, Reg. UE 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj

La ricerca ufficiale ha inoltre individuato il provvedimento Garante del 17 aprile 2026 sulle linee guida per tracking pixel nelle email (doc. 10241943); riguarda email tracking e non è indicazione che questo sito abbia newsletter o pixel. EDPB, 19 marzo 2026, ha avviato la CEF su trasparenza/informazione: https://www.edpb.europa.eu/news/cef-2026-edpb-launches-coordinated-enforcement-action-on-transparency-and-information_en. Nessun analytics/email marketing è presente nel codice.
