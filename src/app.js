const express = require('express')

const appConfig = require('./config/main-config.js');
const routeConfig = require('./config/route-config.js');
//const errorConfig = require('./config/error-config.js');

//define port to listen on
const PORT = process.env.PORT || 8080

const app = express()

// config
appConfig.init(app, express);
routeConfig.init(app);
//errorConfig.init(app);

app.listen(PORT, () => {
    console.log('Server is listening on port ' + String(PORT) + '...')
})
