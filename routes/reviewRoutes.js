const ex = require("express");
const rc = require("../controllers/reviewController");
const ac = require("../controllers/authController");

const router = ex.Router({ mergeParams: true });

router.use(ac.protect);

router.route("/").get(rc.getAllReviews).post(rc.postReview);

router
  .route("/:id")
  .get(rc.getReview)
  .patch(rc.updateReview)
  .delete(rc.deleteReview);

module.exports = router;
