const webServer = require('./config/webserver.js'),
  dbconfig = require('./config/dbconfig.js');

async function startup(){
try{
    console.log('Starting application.');
        await webServer.initialize();
        await dbconfig.initialize();
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}
startup();

async function shutdown(e){
    let err = e;
    try{
        await webServer.close();
    }catch(e){
        console.error(e);
        err = err || e;
    }
}
process.on('uncaughtException', err=>{
    console.error(`UncaughtException:\n${err}`);
});
