"use strict";var r=require("../utils.js");class s{format(t,e){return JSON.stringify({level:t,timestamp:Date.now(),host:r.getHostname(),data:e})}}exports.JsonFormatter=s;
