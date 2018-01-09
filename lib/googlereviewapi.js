"use strict"

const _ = require('lodash');
const google = require('googleapis');

class GoogleReviewAPI {

    /**
     * Construct an instance of GoogleReviewAPI by passing the service account identify
     * @param {*} secret: identify a particular service account that can call Google play developer API 
     */
    constructor(secret) {
        this.secret = secret;
    }

    /**
     * Authorize to Google service. Return a promise
     */
    init() {
        this.authClient = new google.auth.JWT(
            this.secret.client_email, null, this.secret.private_key,
            ['https://www.googleapis.com/auth/androidpublisher'], null);
        return new Promise((resolve, reject)=> {
            this.authClient.authorize((err, tokens) => {
                if (err)
                    reject(err);
                else
                    resolve(tokens);                    
            });                
        })            
    }

    /**
     * Return the reviews (of the last week) for the package 
     * @param {*} packageName: application package name, such as 'djapp.app.xqm' 
     */
    getReviews(packageName) {
        let androidpublisher = google.androidpublisher('v2');
        return new Promise((resolve, reject)=> {
            let p = { auth: this.authClient, packageName };
            androidpublisher.reviews.list(p, (err, reviews)=> {
                if (err)
                    reject(err);
                else
                    resolve(reviews);                    
            })
        })
    }
}

module.exports = GoogleReviewAPI;
