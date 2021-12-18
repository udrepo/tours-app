const ex = require("express");
const tc = require('../controllers/tourController')


const router = ex.Router();

router.route('/top-5-cheap').get(tc.aliasTopTours, tc.getAllTours);
router.route('/stats').get(tc.getTourStats);
router.route('/monthly-plan/:year').get(tc.getMonthlyPlan);

router
  .route("/")
  .get(tc.getAllTours)
  .post(tc.postTour);

router
  .route("/:id")
  .get(tc.getTourById)
  .patch(tc.patchTour)
  .delete(tc.deleteTour);
 

  module.exports = router