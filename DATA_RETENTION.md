# Inventario e retention dei dati

**Rilevazione statica: 30 settembre 2026.** Non è presente un database applicativo nel repository. I periodi dei provider esterni e dei sistemi interni del ristorante non sono verificabili dal codice.

| Dato/categoria | Dove e finalità | Conservazione effettivamente osservata | Destinatari | Retention da definire |
|---|---|---|---|---|
| Carrello (piatti, quantità, prezzi) | Stato JavaScript, comporre ordine | Memoria volatile fino a ricaricamento/chiusura scheda | Nessuno finché non si apre WhatsApp | Non applicabile al sito; messaggio/ordine downstream **[DA COMPLETARE]** |
| Nome facoltativo | Campo browser; aggiunta facoltativa al testo | Memoria volatile | WhatsApp/Meta solo aprendo il link; ristorante se il messaggio viene inviato | **[DA VERIFICARE con titolare e provider]** |
| Note facoltative (testo libero) | Campo browser; personalizzare ordine | Memoria volatile | Come sopra; può includere involontariamente informazioni personali/sanitarie | **[DA DEFINIRE per messaggi e ordini effettivi]**. Istruire gli utenti a non inserire dati sensibili non necessari |
| Preferenza Maps (booleano, timestamp, versione) | localStorage per ricordare consenso/rifiuto | 183 giorni massimo nel codice; cancellabile tramite revoca o cancellazione dati sito | Non inviata al server dal codice | Implementazione fissa, rivedere se cambia finalità/CMP |
| Vecchia chiave `rosticceria-cina-order-v1` | Local storage preesistente versioni precedenti | Pulita all’avvio da localStorage e sessionStorage; il codice non la riscrive | Nessuno dal codice corrente | Rimozione best effort se storage disponibile |
| IP, user-agent, timestamp/URL e altri log HTTP | Generati dalla connessione all’hosting; quali campi vengono registrati dipende dalla piattaforma | Non determinabile | Hosting e subfornitori **[DA IDENTIFICARE]** | **[DA COMPLETARE dal provider: log edge/origin, accesso, retention e cancellazione]** |
| Dati di rete Google Maps | Richiesta al provider quando iframe/link viene attivato | Non determinabile dal sito | Google | **[DA VERIFICARE in policy e configurazione attuale]** |
| Testo WhatsApp/ordine | App e account usati dall’utente, se il link viene inviato | Non conservato dal sito statico; restano le copie/backup di WhatsApp e i sistemi del ristorante, secondo configurazioni effettive | WhatsApp/Meta e ristorante se inviato | **[DA COMPLETARE: procedura di gestione, telefoni, backup, durata e cancellazione]** |
| Dati pagamento/account/prenotazione/newsletter | Non raccolti dal codice | Nessun periodo applicabile nel sito | — | Fuori ambito finché non esiste funzionalità; riesaminare all’introduzione |

## Regole operative da approvare dal titolare

- Identificare il titolare, il canale per le richieste, gli utenti autorizzati ad accedere ai messaggi e la procedura di cancellazione.
- Definire criteri documentati per conversazioni non convertite in ordine, ordini eseguiti, reclami e documentazione contabile, distinguendo gli obblighi di legge (non impostare un periodo generico unico).
- Stabilire retention, accesso e cancellazione per smartphone/WhatsApp Business, esportazioni, backup e dispositivi condivisi.
- Richiedere all’hosting la retention e le procedure di cancellazione dei log, inclusi backup, incident log e dati gestiti dai subfornitori.
- Esaminare la necessità di note ordine in testo libero. Non chiedere dettagli sanitari/allergie sul sito; se il personale li riceve, valutarli e gestirli con una procedura dedicata.
- Non dichiarare tempi di conservazione provider senza riscontro contrattuale e tecnico.
