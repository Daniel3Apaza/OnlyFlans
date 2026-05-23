const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const ctrl = require('../controllers/follower.controller');

router.use(authMiddleware);
router.use(requireRole('follower'));

router.get('/creators', ctrl.listCreators);
router.get('/creators/search', ctrl.searchCreators);
router.get('/creators/:id', ctrl.getCreatorProfile);

router.post('/donate', ctrl.donate);
router.get('/donations', ctrl.getDonationHistory);

router.post('/posts/:postId/comments', ctrl.addComment);

router.post('/favorites/:creatorId', ctrl.addFavorite);
router.delete('/favorites/:creatorId', ctrl.removeFavorite);
router.get('/favorites', ctrl.listFavorites);

router.get('/feed', ctrl.getFeed);

module.exports = router;
