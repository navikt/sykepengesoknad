echo "Bygger sykepengesoknad gammel latest for docker compose utvikling"

npm i
npm run nais-build


docker build . -t sykepengesoknad-dc:latest -f Dockerfile.dc
