import * as app from "./app";
import { init } from "./socket";
const http = require('http').Server(app);
init(http);

const PORT = process.env.PORT || 3000; 

http.listen( PORT, () => {
    console.log(`Listening on port ${PORT}`);
});