const ex = require("express");
const tc = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");
const router = ex.Router();

router.use("/:tourId/reviews", reviewRouter);

router.route("/top-5-cheap").get(tc.aliasTopTours, tc.getAllTours);
router.route("/stats").get(tc.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tc.getMonthlyPlan
  );

router
  .route("/")
  .get(tc.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tc.postTour
  );

router
  .route("/:id")
  .get(tc.getTourById)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tc.uploadTourImages,
    tc.resizeTourImages,
    tc.patchTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tc.deleteTour
  );

module.exports = router;
