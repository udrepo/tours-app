const ex = require("express");
const rc = require('../controllers/reviewController')
const ac = require('../controllers/authController')


const router = ex.Router({mergeParams: true});

router.route("/").
get(ac.protect, rc.getAllReviews).
post(ac.protect, rc.postReview);

router.route("/:id")
.get(ac.protect, rc.getReview)
.patch(ac.protect, rc.updateReview)
.delete(ac.protect, rc.deleteReview);

module.exports = router;