const ex = require("express");
const tc = require('../controllers/tourController')
const authController = require('../controllers/authController')
const reviewRouter = require('../routes/reviewRoutes')
const router = ex.Router();

router.use('/:tourId/reviews', reviewRouter);



router.route('/top-5-cheap').get(tc.aliasTopTours, tc.getAllTours);
router.route('/stats').get(tc.getTourStats);
router.route('/monthly-plan/:year').get(tc.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tc.getAllTours)
  .post(tc.postTour);

router
  .route("/:id")
  .get(tc.getTourById)
  .patch(tc.patchTour)
  .delete(authController.protect, 
    authController.restrictTo('admin', 'lead-guide'), 
    tc.deleteTour);

  module.exports = router