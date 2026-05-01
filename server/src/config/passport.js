const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
  const handleOAuth = async (provider, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email from OAuth provider'));

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: profile.displayName || profile.username,
          email,
          avatar: profile.photos?.[0]?.value || '',
          isVerified: true,
          oauth: [{ provider, providerId: profile.id }],
        });
      } else if (!user.oauth.find((o) => o.provider === provider)) {
        user.oauth.push({ provider, providerId: profile.id });
        if (!user.avatar && profile.photos?.[0]?.value) user.avatar = profile.photos[0].value;
        await user.save({ validateBeforeSave: false });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };

  if (process.env.GOOGLE_CLIENT_ID) {
    passport.use(new GoogleStrategy(
      { clientID: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, callbackURL: '/api/v1/auth/oauth/google/callback' },
      (accessToken, refreshToken, profile, done) => handleOAuth('google', profile, done)
    ));
  }

  if (process.env.GITHUB_CLIENT_ID) {
    passport.use(new GitHubStrategy(
      { clientID: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET, callbackURL: '/api/v1/auth/oauth/github/callback', scope: ['user:email'] },
      (accessToken, refreshToken, profile, done) => handleOAuth('github', profile, done)
    ));
  }
};
