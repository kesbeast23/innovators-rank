const {
  promisify
} = require('util');
const cheerio = require('cheerio');
const graph = require('fbgraph');
// const { LastFmNode } = require('lastfm');
// const tumblr = require('tumblr.js');
const GitHub = require('@octokit/rest');
// const Twit = require('twit');
// const stripe = require('stripe')(process.env.STRIPE_SKEY);
// const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const clockwork = require('clockwork')({
  key: process.env.CLOCKWORK_KEY
});
// const paypal = require('paypal-rest-sdk');
const lob = require('lob')(process.env.LOB_KEY);
// const ig = require('instagram-node').instagram();
const axios = require('axios');
const {
  google
} = require('googleapis');
// const Quickbooks = require('node-quickbooks');
const validator = require('validator');

// Quickbooks.setOauthVersion('2.0');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
exports.getFacebook = (req, res, next) => {
  const token = req.user.tokens.find((token) => token.kind === 'facebook');
  graph.setAccessToken(token.accessToken);
  graph.get(`${req.user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err, profile) => {
    if (err) {
      return next(err);
    }
    res.render('api/facebook', {
      title: 'Facebook API',
      profile
    });
  });
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = (req, res, next) => {
  axios.get('https://news.ycombinator.com/')
    .then((response) => {
      const $ = cheerio.load(response.data);
      const links = [];
      $('.title a[href^="http"], a[href^="https"]').slice(1).each((index, element) => {
        links.push($(element));
      });
      res.render('api/scraping', {
        title: 'Web Scraping',
        links
      });
    })
    .catch((error) => next(error));
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = async (req, res, next) => {
  const github = new GitHub();
  try {
    const {
      data: repo
    } = await github.repos.get({
      owner: 'sahat',
      repo: 'hackathon-starter'
    });
    res.render('api/github', {
      title: 'GitHub API',
      repo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/twitter
 * Twitter API example.
 */
// exports.getTwitter = async (req, res, next) => {
//   const token = req.user.tokens.find((token) => token.kind === 'twitter');
//   const T = new Twit({
//     consumer_key: process.env.TWITTER_KEY,
//     consumer_secret: process.env.TWITTER_SECRET,
//     access_token: token.accessToken,
//     access_token_secret: token.tokenSecret
//   });
//   try {
//     const {
//       data: {
//         statuses: tweets
//       }
//     } = await T.get('search/tweets', {
//       q: 'nodejs since:2013-01-01',
//       geocode: '40.71448,-74.00598,5mi',
//       count: 10
//     });
//     res.render('api/twitter', {
//       title: 'Twitter API',
//       tweets
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * POST /api/twitter
//  * Post a tweet.
//  */
// exports.postTwitter = (req, res, next) => {
//   const validationErrors = [];
//   if (validator.isEmpty(req.body.tweet)) validationErrors.push({
//     msg: 'Tweet cannot be empty'
//   });

//   if (validationErrors.length) {
//     req.flash('errors', validationErrors);
//     return res.redirect('/api/twitter');
//   }

//   const token = req.user.tokens.find((token) => token.kind === 'twitter');
//   const T = new Twit({
//     consumer_key: process.env.TWITTER_KEY,
//     consumer_secret: process.env.TWITTER_SECRET,
//     access_token: token.accessToken,
//     access_token_secret: token.tokenSecret
//   });
//   T.post('statuses/update', {
//     status: req.body.tweet
//   }, (err) => {
//     if (err) {
//       return next(err);
//     }
//     req.flash('success', {
//       msg: 'Your tweet has been posted.'
//     });
//     res.redirect('/api/twitter');
//   });
// };

/**
 * GET /api/clockwork
 * Clockwork SMS API example.
 */
exports.getClockwork = (req, res) => {
  res.render('api/clockwork', {
    title: 'Clockwork SMS API'
  });
};

/**
 * POST /api/clockwork
 * Send a text message using Clockwork SMS
 */
exports.postClockwork = (req, res, next) => {
  const message = {
    To: req.body.telephone,
    From: 'Hackathon',
    Content: 'Hello from the Hackathon Starter'
  };
  clockwork.sendSms(message, (err, responseData) => {
    if (err) {
      return next(err.errDesc);
    }
    req.flash('success', {
      msg: `Text sent to ${responseData.responses[0].to}`
    });
    res.redirect('/api/clockwork');
  });
};


/**
 * GET /api/chart
 * Chart example.
 */
exports.getChart = async (req, res, next) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=compact&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
  axios.get(url)
    .then((response) => {
      const arr = response.data['Time Series (Daily)'];
      let dates = [];
      let closing = []; // stock closing value
      const keys = Object.getOwnPropertyNames(arr);
      for (let i = 0; i < 100; i++) {
        dates.push(keys[i]);
        closing.push(arr[keys[i]]['4. close']);
      }
      // reverse so dates appear from left to right
      dates.reverse();
      closing.reverse();
      dates = JSON.stringify(dates);
      closing = JSON.stringify(closing);
      res.render('api/chart', {
        title: 'Chart',
        dates,
        closing
      });
    }).catch((err) => {
      next(err);
    });
};

/**
 * GET /api/instagram
 * Instagram API example.
 */
exports.getInstagram = async (req, res, next) => {
  const token = req.user.tokens.find((token) => token.kind === 'instagram');
  ig.use({
    client_id: process.env.INSTAGRAM_ID,
    client_secret: process.env.INSTAGRAM_SECRET
  });
  ig.use({
    access_token: token.accessToken
  });
  try {
    const userSelfMediaRecentAsync = promisify(ig.user_self_media_recent);
    const myRecentMedia = await userSelfMediaRecentAsync();
    res.render('api/instagram', {
      title: 'Instagram API',
      myRecentMedia
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lob
 * Lob API example.
 */
exports.getLob = async (req, res, next) => {
  let recipientName;
  if (req.user) {
    recipientName = req.user.profile.name;
  } else {
    recipientName = 'John Doe';
  }
  const addressTo = {
    name: recipientName,
    address_line1: '123 Main Street',
    address_city: 'New York',
    address_state: 'NY',
    address_zip: '94107'
  };
  const addressFrom = {
    name: 'Hackathon Starter',
    address_line1: '123 Test Street',
    address_line2: 'Unit 200',
    address_city: 'Chicago',
    address_state: 'IL',
    address_zip: '60012',
    address_country: 'US'
  };

  const lookupZip = () => lob.usZipLookups.lookup({
      zip_code: '94107'
    })
    .then((zipdetails) => (zipdetails))
    .catch((error) => Promise.reject(new Error(`Could not get zip code details: ${error}`)));

  const createAndMailLetter = () => lob.letters.create({
      description: 'My First Class Letter',
      to: addressTo,
      from: addressFrom,
      // file: minified version of https://github.com/lob/lob-node/blob/master/examples/html/letter.html with slight changes as an example
      file: `<html><head><meta charset="UTF-8"><style>body{width:8.5in;height:11in;margin:0;padding:0}.page{page-break-after:always;position:relative;width:8.5in;height:11in}.page-content{position:absolute;width:8.125in;height:10.625in;left:1in;top:1in}.text{position:relative;left:20px;top:3in;width:6in;font-size:14px}</style></head>
          <body><div class="page"><div class="page-content"><div class="text">
          Hello ${addressTo.name}, <p> We would like to welcome you to the community! Thanks for being a part of the team! <p><p> Cheer,<br>${addressFrom.name}
          </div></div></div></body></html>`,
      color: false
    })
    .then((letter) => (letter))
    .catch((error) => Promise.reject(new Error(`Could not create and send letter: ${error}`)));

  try {
    const uspsLetter = await createAndMailLetter();
    const zipDetails = await lookupZip();
    res.render('api/lob', {
      title: 'Lob API',
      zipDetails,
      uspsLetter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', {
    msg: 'File was uploaded successfully.'
  });
  res.redirect('/api/upload');
};

exports.getGoogleMaps = (req, res) => {
  res.render('api/google-maps', {
    title: 'Google Maps API',
    google_map_api_key: process.env.GOOGLE_MAP_API_KEY
  });
};