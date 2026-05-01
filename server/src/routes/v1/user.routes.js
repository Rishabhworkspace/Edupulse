const router = require('express').Router();
const c = require('../../controllers/user.controller');
const { verifyJWT, authorise } = require('../../middleware/auth');

router.use(verifyJWT);
router.get('/me', c.getMe);
router.patch('/me', c.updateMe);
router.patch('/me/password', c.changePassword);
router.patch('/me/wishlist/:courseId', c.toggleWishlist);

const upload = require('../../middleware/upload');
router.patch('/me/avatar', upload.single('avatar'), c.updateAvatar);

// Must be before /:id routes so Express doesn't treat 'me' as an :id param
router.get('/me/enrollments', c.getUserEnrollments);
router.get('/:id/enrollments', c.getUserEnrollments);

// Admin only
router.get('/', authorise('admin'), c.listUsers);
router.get('/:id', authorise('admin'), c.getUserById);
router.patch('/:id/ban', authorise('admin'), c.banUser);
router.patch('/:id/role', authorise('admin'), c.promoteRole);
router.delete('/:id', authorise('admin'), c.deleteUser);

module.exports = router;
