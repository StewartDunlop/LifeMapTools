'use strict';

// Rename this file to local.js for having a local configuration variables that
// will not get commited and pushed to remote repositories.
// Use it for your API keys, passwords, etc.



module.exports = {
    sessionSecret: process.env.SESSION_SECRET || 'intervalsecrethorsestapleeat',
    google: {
        clientID: '505684028880-qjnrns0koa5aait14cbc9kdf4l9igclt.apps.googleusercontent.com',
        clientSecret: 'aeflGiLsfATOAIx_5Qwl6kJW',
        callbackURL: '/auth/google/callback'
    }
};

