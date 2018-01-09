"use strict"

const util = require('util');
const _ = require('lodash');
const GoogleReviewAPI = require('../lib/googlereviewapi');
const restify = require('restify'); 
const builder = require('xmlbuilder');
const moment = require('moment');

// APIServer: 支援某個service account相關的review查詢
//
// 使用流程
// - create and initialize the api object, by acquiring the identify
// - create and start the API server, by passing the api object
// 
class APIServer {
    constructor(api) {
        this.api = api;
    }

    start(port) {
        let server  = restify.createServer( {
            formatters: {
                'application/xml' : function( req, res, body ) {
                    if (body instanceof Error)
                       return body.stack;
         
                    if (Buffer.isBuffer(body))
                       return body.toString('base64');
         
                    return body;
                }
           } 
        });
        
        server.get('/reviews/:packageName', (req, res, next)=> {
            let packageName = req.params.packageName;
            this.api.getReviews(packageName)
                .then((data)=> {
                    res.header('content-type', 'application/json');
                    res.send(data);
                    return next();
                })
                .catch((err)=> {
                    return next(new Error(err));
                })
        })

        server.get('/reviews/rss/:packageName', (req, res, next)=> {
            let packageName = req.params.packageName;
            this.api.getReviews(packageName)
            .then((data)=> {
                res.header('content-type', 'application/xml');
                let xml = this._buildReviewRSS(data.reviews||[], packageName);
                res.send(xml);
                return next();
            })
            .catch((err)=> {
                return next(new Error(err));
            })
        
        })

        server.listen(port, ()=> {
            console.log('%s listening at %s', server.name, server.url);
        })
    }

    _buildReviewRSS(reviews, packageName) {
        let feed = builder
            .create('feed', { encoding: 'utf-8' })
            .att('xmlns', 'http://www.w3.org/2005/Atom');

        feed.ele('id', `http://http://googlereviewsvc/${packageName}`);
        feed.ele('title', `客戶評論:${packageName}`);
        feed.ele('updated', moment().format());
        feed.ele('icon', 'https://www.gstatic.com/android/market_images/web/favicon_v2.ico');

        _.each(reviews, (review)=> {
            /*
                <entry>
                    <id>gp:AOqpTOG3wC1gWvy19GmAqBmLmm6VeQvOhheOdeE-6-_8jZ7FubRxSTZsHX6I3d1mFps6x0tNzjizLxGkjcjG6YQ</id>
                    <title>等級: 5</title>
                    <updated>2018-01-08T08:49:05+00:00</updated>
                    <author>
                        <name>黃小敦</name>
                    </author>
                    <content type="text">準準準準準喔</content>
                    <link href="https://play.google.com/store/apps/details?id=com.moneydj.robp&reviewid=.."/>
                </entry>
            */
            let node = feed.ele('entry');
            node.ele('id', review.reviewId);
            node.ele('author').ele('name', review.authorName);
            // node.ele('link').att('href', `https://play.google.com/store/apps/details?id=${packageName}&reviewid=${review.reviewId}`);
            node.ele('link').att('href', `https://play.google.com/apps/publish/#ReviewDetailsPlace:p=${packageName}&reviewid=${review.reviewId}`);
            
            let comment = review.comments[0];
            if (comment.userComment) {
                node.ele('title', `評等:${comment.userComment.starRating}`);
                node.ele('content', { 'type': 'text'}, comment.userComment.text);
                node.ele('updated', moment.unix(parseInt(comment.userComment.lastModified.seconds)).format());
            }

        })

        return feed.end();
    }
}

module.exports = APIServer;