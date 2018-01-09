"use strict"

const GoogleReviewAPI = require('../lib/googlereviewapi');
const APIServer = require('../lib/apiserver');

describe("Test APIServer", ()=> {
    it.skip("test", (done) => {
        let secret = require('../data/client_secret.json');
        let api = new GoogleReviewAPI(secret);
        let server = new APIServer(api);

        api.init()
            .then(()=> {
                server.start(7777);
            })
            .catch((err)=> {
                throw err;
            });
    })
})
