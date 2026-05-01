const router = require('express').Router();
const passport = require('passport');
const c = require('../../controllers/auth.controller');
const { authLimiter } = require('../../middleware/rateLimiter');
const { verifyJWT } = require('../../middleware/auth');

router.post('/register', authLimiter, c.register);
router.post('/login', authLimiter, c.login);
router.post('/logout', verifyJWT, c.logout);
router.post('/refresh-token', c.refreshToken);
router.post('/verify-email', c.verifyEmail);
router.post('/resend-verification', authLimiter, c.resendVerification);
router.post('/forgot-password', authLimiter, c.forgotPassword);
router.patch('/reset-password/:token', c.resetPassword);

// Google OAuth
router.get('/oauth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/oauth/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }), c.oauthCallback);

module.exports = router;
