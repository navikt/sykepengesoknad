# Sykepengesoknad
Frontend for sykepengesøknader (DigiSYFO) http://tjenester.nav.no/sykepengesoknad/

## TL;DR
React-app for den sykmeldte. Viser sykepengesøknader.

## Kjøre lokalt mot node express mock
Applikasjonen har en mock som kan brukes lokalt. Her mockes diverse endepunkter, dog ikke alle. 

Du må ha Node installert.

* For å kjøre koden lokalt: 
    - `$ npm install`
    - `$ npm run dev`
    - I et annet vindu `$ npm run start-local`
    - Åpne `http://localhost:8087` i en nettleser
    - Eventuelt kan komandoene kjøres fra `package.json` i intellij.
* Kjør tester med `npm test` eller `npm test:watch`
* Lint JS-kode med `npm run lint` eller `npm run lint:fix`

## Kjøre mot lokal backend i docker compose
Applikasjonen kan kjøre mot en lokal syfosoknad backend.
Start docker compose oppsettet

* For å kjøre frontend koden: 
    - `$ npm install`
    - `$ npm run dev`
    - I et annet vindu `$ npm run start-devlocal`
    - Åpne `http://localhost:8085` i en nettleser

## Deploy mock app til Labs
Mock appen blir deployet av github actions automatisk når master blir oppdatert

## Logge på i Q1-miljø
Se denne siden for [testdata](https://confluence.adeo.no/pages/viewpage.action?pageId=228580060) (NAV-intern lenke).

## Viktig informasjon

Hvis du endrer `not-enforced-urls.txt` eller `app-policies.xml`, må du gjøre manuelle kall for å konfigurere OpenAM.
Nå som applikasjonen ikke bygger på internservere har byggverktøyet ikke direkte tilgang til å konfigurere OpenAM
som disse filene brukes til.
 
Les [AM/OpenAM](https://doc.nais.io/legacy/am#folgende-krav-ma-vaere-oppfylt-ved-kall-til-named) for hvordan dette gjøres. 
