# Mussida-frontend
Mussida frontend application.
Per poter testare l'applcativo è necessario avere una versione di **Node** maggiore uguale della 16 ed eseguire in ordine i seguenti comandi sul terminale del *file* dove si trova l'app: 

   1. `npm install`
   2. `npm run gen-api-prod`
   3. `npm start`
   4. In seguito scegliere se effettuare la prova tramite emulatore oppure dispositivo fisico: 
      - Premere `i` per emulatore *ios*.
      - Premere `a` per emulatore *android*. 
      - Scansionare il *qr-code* presente nel terminale con un dispositivo qualsiasi con **Expo** installato. 

Inoltre, siccome l’applicativo si trova in modalità *development* e **Spotify**
permette solamente agli utenti inseriti dall’admin di testare l’app, basterà che
l’utente mandi il proprio nome e email di **Spotify** all’indirizzo
email del sottoscritto e gli verrà concessa l’autorizzazione. Infine, l’utlima
richiesta da allegare per la prova è l’indirizzo di **Expo** sul quale si trova
l’applicazione dopo il comando `npm start`, che verrà mostrata in console
(es. exp://192.168.1.51:19000*).
