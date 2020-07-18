const http = require('http'),
      express = require('express'),
      webRouter = require('../router/WebRouter.js');
const app = express();
const port = process.env.HTTP_PORT || process.env.PORT || 3000;
let httpServer;

exports.initialize = ()=>{
  return new Promise((resolve, reject)=>{
        httpServer = http.createServer(app);
        httpServer.timeout = 900000;
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.use('/', webRouter);

        httpServer.listen(port, err=>{
            if(err){
                console.error(err);
                reject(err);
                return;
            }
            console.log(`Web server listning on :${port}`);
            resolve();
        });
    });
}
function close(){
    return new Promise((resolve, reject)=>{
        httpServer.close((err)=>{
            if(err){
                reject(err);
                return;
            }
            resolve();
        });
    });
}

exports.close = close;
