import{getHostname as o}from"../utils.mjs";class r{format(t,e){return JSON.stringify({level:t,timestamp:Date.now(),host:o(),data:e})}}export{r as JsonFormatter};
