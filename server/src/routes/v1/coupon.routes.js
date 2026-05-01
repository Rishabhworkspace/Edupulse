const router = require('express').Router();
const c = require('../../controllers/coupon.controller');
const { verifyJWT, authorise } = require('../../middleware/auth');

router.post('/validate', verifyJWT, c.validateCoupon);

// Admin only
router.use(verifyJWT, authorise('admin'));
router.post('/', c.createCoupon);
router.get('/', c.listCoupons);
router.get('/:id', c.getCoupon);
router.patch('/:id', c.updateCoupon);
router.delete('/:id', c.deleteCoupon);
router.post('/bulk-generate', c.bulkGenerate);
router.get('/:id/analytics', c.getCouponAnalytics);

module.exports = router;
