# Visszajelzéseket gyűjtő applikáció

## Fejlesztés quick start

1. Telepítsd a [node.js](https://nodejs.org/en/) v10.x -et 
2. Klónozd ezt a repót: `git clone https://github.com/a-gondolkodas-orome/feedback-app.git`
3. Telepítsd az [Expo](https://expo.io/) command line tool-t: `npm install expo-cli --global`
4. A telefonodon telepítsd az Expo appot (https://play.google.com/store/apps/details?id=host.exp.exponent)
5. A feedback-app könyvtárban `npm install`
6. A feedback-app könyvtárban `expo start` (vagy `npm start`), a telefonodon nyisd meg az Expo appot, és szkenneld be a QR-kódot

## Használt technológiák, dokumentáció ezekhez

1. React Native Framework-ben fejlesztjük az appot: https://reactnative.dev/docs/getting-started
2. Expo dokumentáció: https://docs.expo.io/versions/latest/
3. Backend-nek a [Firebase](https://firebase.google.com/)-t használjuk, az adatokat a [Cloud Firestore](https://firebase.google.com/docs/firestore)-ban tároljuk
4. Az apphoz használt React Native komponensek:
    - Az állapot tárolásához [Redux](https://redux.js.org/)
    - Az állapot mentéséhez [Redux Persist](https://github.com/rt2zz/redux-persist)
    - Értesítésekhez [Expo Notifications](https://docs.expo.io/versions/latest/sdk/notifications/)
    - Menűhöz [React Native Material Menu](https://www.npmjs.com/package/react-native-material-menu)
    - Spinner-hez [React Native Loading Spinner Overlay](https://github.com/joinspontaneous/react-native-loading-spinner-overlay)

## Adatbázis, esemény, kérdések hozzáadása

* [Admin weboldal](https://github.com/a-gondolkodas-orome/feedback-app-export)
* A fejlesztők a Cloud Firestore console-on is tudják szerkeszteni az adatokat (események, kérdések), és vizsgálni a válaszokat: https://console.firebase.google.com/project/feedback-app-ago/database

### DB Séma

* event
  - name (string): az esemény címe
  - code (string): 3-5 számjegy, amivel kapcsolódni lehet
  - from (dátum): az esemény kezdetének időpontja
  - until (dátum): az esemény végének időpontja
  - frequency (szám, perc): kérdések gyakorisága percekben
  - duration (szám, óra, opcionális): maximum hány órán át tegyünk fel kérdéseket, az első választól számítva
  - morning (szám, óra, opcionális): szám, 0..23 lehet, reggel ennyi óra előtt nem adunk értesítést
  - evening (szám, óra, opcionális): szám, 0..23 lehet, este ennyi óra után nem adunk értesítést

Minden event-hez tartozik egy questions collection

* question
  - type (scale5 / scale3 / scale10 / wordcloud / textbox): a válaszadás típusa
  - text (string): a kérdés szövege
  - words (array, csak ha type=wordcloud): a választható szavak listája


Minden question-höz tartozik egy answers collection:

* answer
  - name (string): ez igazából user id
  - answer (string): a válasz szövege, értéke
  - timestamp (dátum): a válasz időpontja, a telefon szerinti időt tároljuk


