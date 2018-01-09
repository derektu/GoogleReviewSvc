"use strict"

const APIServer = require('../lib/apiserver');
const GoogleReviewAPI = require('../lib/googlereviewapi');
const fs = require('fs');

/*
    Usage: node app.js --secret='./data/client_secret.json' --port=7070
*/
class App {
    run(args) {
        const _argopt = {
            default: {
            }
        }

        let argv = require('minimist')(args, _argopt);
        let secret = argv['secret']||'';
        let port = parseInt(argv['port'])||0;
        if (!secret || !port) {
            this._usage();
            process.exit(1);
        }

        let secret_data = JSON.parse(fs.readFileSync(secret)); 
        let api = new GoogleReviewAPI(secret_data);
        let server = new APIServer(api);
        api.init()
            .then(()=> {
                console.log('Server start at port:' + port);
                server.start(port);
            })
            .catch((err)=> {
                console.log('Error:' + err);
                throw err;
            });
    }

    _usage() {
        console.log('Usage:');
        console.log(`
            $ node.js lib/app.js --secret=./data/client_secret.json --port=8070
        `);
    }
}

let app = new App();
app.run(process.argv.slice(2));

