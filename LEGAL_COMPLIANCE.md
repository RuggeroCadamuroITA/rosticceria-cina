# Audit tecnico privacy e compliance — Rosticceria Cina

**Audit effettuato il:** 30 settembre 2026
**Normativa/fonte verificata fino al:** 30 settembre 2026 (fonti ufficiali consultabili al momento; si vedano limiti di accesso alle FAQ Garante)
**Ambito:** repository statico disponibile nel workspace, non server live, account hosting, dispositivi aziendali, procedure interne o contratti.

> Questo è un audit tecnico e una documentazione di lavoro, non un parere legale né una dichiarazione di conformità assoluta. Titolare, hosting, log, rapporti contrattuali, trasferimenti, retention e gestione effettiva degli ordini richiedono conferma del titolare/consulente.

## Executive Summary

Il progetto contiene un sito frontend statico HTML/CSS/JavaScript con menu JSON e foto locali, senza backend applicativo, account, API, database, pagamento online, prenotazioni, form di contatto, newsletter, analytics, advertising, pixel, social embed o CAPTCHA rilevati. Il menu è caricato con una richiesta same-origin. L’ordine viene composto nel browser e trasferito nel link WhatsApp soltanto dopo un clic; il testo può includere nome e note facoltativi. Il sito offre un iframe Google Maps, ora bloccato fino a scelta esplicita. Font Google remoti rimossi.

Le principali correzioni tecniche effettuate riguardano: eliminazione della persistenza locale di carrello/nome/note e pulizia della chiave legacy, scelta Maps con rifiuto/consenso/revoca e scadenza, link alle policy e informativa vicino ai campi ordine, rimozione riferimenti font esterni, apertura WhatsApp con newline corretti e gestione sicura `noopener,noreferrer`. Sono stati creati documenti di audit e policy con placeholder espliciti.

**Non si può attestare conformità legale complessiva**: mancano identità/contatti titolare, hosting effettivo, dati log/retention, accordi, ruoli e trasferimenti dei provider, nonché verifica live di cookies/network e procedure WhatsApp.

## Mappa tecnica e trattamenti

| Trattamento | Dati osservati/potenziali | Finalità | Base giuridica | Conservazione | Destinatari |
|---|---|---|---|---|---|
| Consegna sito/menu | richieste HTTP; IP/user-agent e log potenziali determinati dall’hosting | Erogare contenuto e sicurezza tecnica | **DA VERIFICARE MANUALMENTE** | log hosting **[DA COMPLETARE]** | Hosting e subfornitori **[DA IDENTIFICARE]** |
| Preparazione ordine browser | piatti/quantità; nome e note facoltativi | Comporre un messaggio d’ordine | Stato locale; base di eventuale trattamento commerciale post invio **DA VERIFICARE** | memoria volatile fino a reload/chiusura | Nessuno prima del click |
| Invio/gestione ordine WhatsApp | dati nel testo d’ordine; eventualmente nome/note, dati tecnici | Contatto e gestione ordine richiesto | **DA VALIDARE** sul flusso effettivo | WhatsApp e procedure ristorante **[DA COMPLETARE]** | Ristorante; Meta/WhatsApp secondo flusso |
| Embed Maps facoltativo | preferenza booleana/timestamp/versione; IP e dati di rete a Google dopo caricamento | Memorizzare scelta e mostrare mappa | Consenso per caricamento/terminal access ove applicabile; trattamento provider **DA VALIDARE** | preferenza 183 giorni; Google **DA VERIFICARE** | Google e subfornitori **[DA VERIFICARE]** |
| Link tel / Maps / WhatsApp | dati tecnici del browser, dati in URL quando applicabile | Azione espressamente richiesta | **DA VERIFICARE** per eventuale gestione successiva | Provider/dispositivo **DA VERIFICARE** | Operatore, Google, Meta/WhatsApp |

Nessuna categoria cognome, email, indirizzo di consegna, account ID, carta, prenotazione, analytics o marketing è raccolta dal codice. I log e gli eventuali dati tecnici hosting non possono essere esclusi dal solo repository.

## Problemi e azioni (priorità tecnica, non punteggio legale)

### P-01 — Persistenza locale non necessaria di dettagli ordine
- **Gravità:** HIGH
- **Area:** minimizzazione/storage
- **File:** [app.js](app.js)
- **Righe:** circa 1–50
- **Problema:** la versione preesistente salvava stato ordine e campi facoltativi in localStorage.
- **Perché è problematico:** persistenza di nome/note non necessaria per la composizione e potenziale accesso condiviso dal dispositivo.
- **Modifica effettuata:** carrello, nome e note solo in memoria; rimozione di vecchia chiave localStorage/sessionStorage all’avvio.
- **Test effettuato:** verifica statica del codice; test browser live ancora da eseguire.
- **Stato:** FIXED (verifica live richiesta).

### P-02 — Google Maps caricato prima di una scelta
- **Gravità:** HIGH
- **Area:** art. 122 / ePrivacy / terze parti
- **File:** [index.html](index.html), [app.js](app.js)
- **Righe:** markup contatti/preferenze e funzioni CMP
- **Problema:** iframe Maps presente direttamente nell’HTML iniziale.
- **Perché è problematico:** caricamento automatico contatta terza parte prima della scelta e può comportare dati tecnici/accessi al terminale.
- **Modifica effettuata:** placeholder con informativa, consenso e rifiuto equivalenti, mappa creata solo dopo consenso esplicito, revoca footer, preference storage locale/versionato e expiry 183 giorni.
- **Test effettuato:** flusso verificato per ispezione del codice, non Network live.
- **Stato:** PARTIALLY_FIXED (comportamento provider/cookie e test rete reali da confermare).

### P-03 — Link ordine senza informativa vicino ai campi
- **Gravità:** MEDIUM
- **Area:** trasparenza / ordine
- **File:** [index.html](index.html)
- **Righe:** riepilogo carrello
- **Problema:** nome e note potevano essere trasferiti nel link WhatsApp senza informativa contestuale.
- **Modifica effettuata:** testo vicino ai campi precisa facoltatività, temporaneità, trasferimento solo all’apertura WhatsApp e cautela sulle note; link policy.
- **Test effettuato:** ispezione markup.
- **Stato:** PARTIALLY_FIXED (identità titolare, basi, retention/provider da completare).

### P-04 — Font esterni non necessari
- **Gravità:** MEDIUM
- **Area:** terze parti/minimizzazione
- **File:** [index.html](index.html), [styles.css](styles.css)
- **Problema:** Google Fonts venivano richiesti in automatico via preconnect, stylesheet e `@import`.
- **Modifica effettuata:** riferimenti rimossi; stack di font con fallback di sistema.
- **Test effettuato:** ricerca statica URL e `@import`.
- **Stato:** FIXED (Network live da verificare).

### P-05 — Informativa titolare, provider e retention non determinabili
- **Gravità:** HIGH
- **Area:** trasparenza e accountability
- **File:** [PRIVACY_POLICY.md](PRIVACY_POLICY.md), [DATA_RETENTION.md](DATA_RETENTION.md), [THIRD_PARTY_SERVICES.md](THIRD_PARTY_SERVICES.md)
- **Problema:** repository non dichiara titolare legale, contatto privacy, hosting, log, contratti, basi e retention esterne.
- **Modifica effettuata:** creati documenti descrittivi con `[DA COMPLETARE]` / `DA VERIFICARE MANUALMENTE`, senza inventare informazioni.
- **Test effettuato:** confronto con elementi del repository.
- **Stato:** MANUAL_REVIEW_REQUIRED.

### P-06 — Audit effettivo cookie e header di sicurezza non possibile dal codice
- **Gravità:** MEDIUM
- **Area:** cookie/security/hosting
- **File:** [COOKIE_AUDIT.md](COOKIE_AUDIT.md), [THIRD_PARTY_SERVICES.md](THIRD_PARTY_SERVICES.md)
- **Problema:** server può impostare `Set-Cookie`, log, header, CDN o script non dichiarati nel repository.
- **Modifica effettuata:** documentata la matrice di test e richiesti riscontri provider.
- **Test effettuato:** ricerca statica; nessuna scansione del sito pubblicato.
- **Stato:** MANUAL_REVIEW_REQUIRED.

## Test e verifiche disponibili

- [x] Ricerca statica riferimenti esterni, form, storage, cookie, API/backend, immagini/font.
- [x] Ispezione contenuto `index.html`, `app.js`, `styles.css`, `README.md`, menu e fallback.
- [x] Controllo stato git prima delle modifiche: branch `main`, file originariamente modificati `app.js`, `index.html`, `styles.css`; presenti anche file non tracciati `NOTE-DIFFERENZE.md` e `menu-file-fallback.js`. Tali file non sono stati sovrascritti.
- [ ] `node --check app.js` e validazione JSON/CSS/HTML da rieseguire dopo patch.
- [ ] Browser desktop e mobile; test tastiera, screen reader, console, link, dialog, focus.
- [ ] Network/cookie prima, dopo rifiuto, dopo consenso e dopo revoca.
- [ ] Chrome, Firefox, Edge, Safari/iOS e modalità privata.
- [ ] Test hosting HTTPS/security headers e `Set-Cookie`.

La verifica live non può essere dichiarata come completata: in questa sessione non sono stati eseguiti test browser DevTools o scansioni HTTP del dominio deployato.

## Checklist

- [x] Privacy Policy tecnica creata con placeholder
- [x] Cookie Policy separata e coerente con codice
- [x] UI preferenze Maps con rifiuto e revoca
- [x] Font Google rimossi
- [x] Carrello non persistito; nome/note temporanei
- [x] Newsletter/analytics/ads/accounts/database/payment non rilevati
- [ ] Identità/contatti del titolare completati
- [ ] Hosting e log/retention verificati
- [ ] Provider/DPA/ruoli e trasferimenti verificati
- [ ] Cookie e Network audit live
- [ ] HTTPS e security headers verificati sul dominio
- [ ] Accessibilità dialog verificata con tecnologie assistive
- [ ] Procedura diritti interessati e ordini WhatsApp approvata

## Informazioni che deve fornire il titolare

1. Nome legale e recapito del titolare; indirizzo, P. IVA/CF pertinenti; recapito diritti; stato DPO.
2. Provider hosting/CDN/domain e relativa configurazione: region, log, `Set-Cookie`, backup, headers, sub-responsabili, DPA e retention.
3. Chi riceve/gestisce i messaggi WhatsApp, uso WhatsApp Business, dispositivi condivisi, esportazioni, backup e cancellazione.
4. Base/finalità effettive per gestione ordini, contatti e sicurezza; retention documentata per conversazioni, ordini, reclami e log.
5. Verifica allergeni/note: se trattate come dati relativi alla salute, determinare necessità, base/condizione applicabile e misure; non raccogliere dettagli non necessari via testo libero.
6. Documentazione Google/Meta attuale: ruoli, cookie, subfornitori, trasferimenti internazionali e garanzie.
7. Verifica informativa su dominio effettivo e aggiornamento dopo ogni modifica tecnica o fornitore.

## Verifiche manuali necessarie

- Eseguire DevTools Network/storage con profilo nuovo sulle quattro fasi: pre-scelta, rifiuto, accettazione, revoca; salvare evidenze.
- Ripetere browser/mobile e verificare preferenza con storage disabilitato e navigazione privata.
- Verificare automaticamente o da pannello host HTTPS, HSTS, CSP, frame-ancestors/X-Frame-Options, nosniff, Referrer-Policy e Permissions-Policy. Non si possono impostare correttamente questi header da un semplice file HTML statico; configurarli sull’hosting dopo valutazione dei requisiti.
- Validare contrasto, zoom, tastiera, ordine/focus trap del `<dialog>`, annuncio screen reader e pulsanti accetta/rifiuta equivalenti.
- Completare documenti con titolare e provider; far validare bases/retention/ruoli da professionista privacy.

## Fonti normative ufficiali e aggiornamento

- Regolamento (UE) 2016/679 (GDPR), in particolare artt. 5–6, 12–14, 15–22, 25, 28, 32 e 44 ss.: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- D.lgs. 196/2003, Codice Privacy, testo vigente, artt. 122 e seguenti: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-06-30;196
- Garante, Linee guida cookie e altri strumenti di tracciamento, provvedimento 10 giugno 2021, doc. web 9677876: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- Garante, FAQ Cookie: https://www.garanteprivacy.it/faq/Cookie
- EDPB, CEF 2026 su trasparenza e obblighi informativi, 19 marzo 2026: https://www.edpb.europa.eu/news/cef-2026-edpb-launches-coordinated-enforcement-action-on-transparency-and-information_en
- Garante, provvedimento 17 aprile 2026 su tracking pixel email, doc. web 10241943: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10241943 (non pertinente a un pixel non presente; controllato per aggiornamento).

Le pagine Garante/EUR-Lex principali erano state raggiunte tramite ricerca ufficiale; il fetch testuale diretto di alcune ha restituito errori del servizio di estrazione. Va ricontrollata la versione vigente prima della pubblicazione e in sede di revisione legale.
