const fs = require('fs');
const passport = require('passport');
const Strategy = require('passport-saml').Strategy;
const config = require('./config');

const savedUsers = [];

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('deserializeUser');
    done(null, user);
});

passport.use(new Strategy({
    issuer: config.saml.issuer,
    protocol: 'http://',
    path: '/login/callback',
    entryPoint: config.saml.entryPoint,
    cert: fs.readFileSync(config.saml.cert, 'utf-8'),
} , (user, done) => {
    console.log('samlStrategy');
    console.log(user);
    if (savedUsers.indexOf(user) === -1) {
        savedUsers.push(user);
    }
    done(null, user);
}
));