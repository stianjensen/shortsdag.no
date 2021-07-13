# Shortsdag.no

Nettsiden som forteller deg om det er shortsdag i dag.

## API

Det er et endepunkt tilgjengelig på `http://shortsdag.no/api/forecast/<lat>/<lon>/`.
Det er i praksis en proxy for et spesifikt endepunkt fra [yr.no sitt API](http://om.yr.no/verdata/informasjon-om-gratis-verdata/),
men leverer i tillegg [effektiv temperatur](http://om.yr.no/forklaring/symbol/effektiv-temperatur/) som en del av API-et.
