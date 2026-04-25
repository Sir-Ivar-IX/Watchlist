# Watchlist

Versione statica pronta per GitHub Pages, scritta solo con HTML, CSS e JavaScript.

## File da caricare nel repository

- index.html
- style.css
- app.js
- .nojekyll
- README.md
- .gitignore

## Come pubblicarla su GitHub Pages

1. Crea un repository GitHub e carica tutti i file di questa cartella.
2. In GitHub apri `Settings > Pages`.
3. Come source scegli il branch da pubblicare e la root della cartella.
4. Apri l'URL pubblico generato da GitHub Pages.

## Comandi rapidi Git

```bash
git init
git add .
git commit -m "Initial watchlist site"
git branch -M main
git remote add origin https://github.com/TUO-NOME/TUO-REPO.git
git push -u origin main
```

## Come attivare il profilo Google reale

1. Apri Firebase Console.
2. Crea oppure seleziona il progetto `watchlist-af5b8`.
3. In `Authentication > Sign-in method` abilita `Google`.
4. Crea anche un database `Cloud Firestore`.
5. Pubblica il sito su GitHub Pages o su un dominio `https`.
6. In Firebase Authentication controlla che il dominio del sito pubblicato sia autorizzato.
7. Premi `Accedi con Google`, scegli l'account e Firebase Authentication creera automaticamente l'utente del sito al primo accesso.
8. Da quel momento watchlist, stelline, recensioni, visto/non visto e struttura personalizzata verranno sincronizzati online per lo stesso profilo su piu dispositivi.

La configurazione Firebase web e gia integrata nel codice di questa build, quindi non devi piu incollarla nelle impostazioni.

## Regole Firestore consigliate

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/private/watchlist {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Nota

Da file locale (`file://`) il login Google reale non parte: la UI resta preparata, ma il bottone effettivo funziona solo da sito pubblicato in `https`.

Gli sfondi caricati come immagini restano locali per ora, mentre i dati principali della watchlist vengono sincronizzati online.
