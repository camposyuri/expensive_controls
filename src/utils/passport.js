const passport = require("passport");
const passportJwt = require("passport-jwt");
const { findById } = require("../app/repositories/UserRepository");
const { Strategy, ExtractJwt } = passportJwt;

require("dotenv").config();

const authenticate = () => {
	const params = {
		secretOrKey: process.env.AUTH_SECRET,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	};

	const strategy = new Strategy(params, async (payload, done) => {
		try {
			const user = await findById(payload.id);
			return done(null, user ? { ...payload } : false);
		} catch (error) {
			done(error, false);
		}
	});

	passport.use(strategy);

	return passport.authenticate("jwt", { session: false });
};

module.exports = authenticate;
