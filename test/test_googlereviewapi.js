"use strict"

const GoogleReviewAPI = require('../lib/googlereviewapi');

describe("Test GoogleReviewAPI", ()=> {
    it.skip("test getReview", async function() {
        let secret = require('../data/client_secret.json');
        let packageName = 'com.moneydj.robp';
        let api = new GoogleReviewAPI(secret);
        try {
            await api.init();
            let reviews = await api.getReviews(packageName);
            console.log(reviews);
        }
        catch(err) {
            throw err;
        }
    })
})
