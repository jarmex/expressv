/* eslint-disable no-console */


import {
    ExtractJwt,
    Strategy
} from 'passport-jwt';


const JWT_SECRET = 'your secret goes here';

module.exports = (passport) => {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = JWT_SECRET;

    passport.use(new Strategy(opts, async(jwtPayload, done) => {
        console.log(jwtPayload);
        try {
            // TODO authenticate the user before return done below
            
            return done(null, 'user'); // return done(null, user); // user is object
        } catch (error) {
            console.log(error);
            return done(error, false)
        }
    }))

}