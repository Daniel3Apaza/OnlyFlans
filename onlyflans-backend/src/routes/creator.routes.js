const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const { uploadProfile, uploadBanner, uploadPost } = require('../middlewares/upload.middleware');
const ctrl = require('../controllers/creator.controller');

router.use(authMiddleware);
router.use(requireRole('creator'));

router.get('/profile', ctrl.getProfile);
router.post('/profile', ctrl.upsertProfile);
router.post('/profile/avatar', uploadProfile.single('avatar'), ctrl.uploadAvatar);
router.post('/profile/banner', uploadBanner.single('banner'), ctrl.uploadBanner);

router.get('/posts', ctrl.getPosts);
router.post('/posts', uploadPost.single('image'), ctrl.createPost);
router.delete('/posts/:id', ctrl.deletePost);

router.get('/goals', ctrl.getGoals);
router.post('/goals', ctrl.createGoal);
router.put('/goals/:id', ctrl.updateGoal);
router.delete('/goals/:id', ctrl.deleteGoal);

router.get('/report', ctrl.getIncomeReport);

module.exports = router;
