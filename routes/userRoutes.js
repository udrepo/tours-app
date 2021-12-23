const ex = require("express");
const authController = require('../controllers/authController')

const router = ex.Router();


router.post('/signup', authController.signup)

router
.route("/")
.get((req, res) => {res.status(500).json({
  status: "no method"
})})
.post((req, res) => {res.status(500).json({
  status: "no method"
})});

router
.route("/:id")
.get((req, res) => {res.status(500).json({
  status: "no method"
})})
.patch((req, res) => {res.status(500).json({
  status: "no method"
})})
.delete((req, res) => {res.status(500).json({
  status: "no method"
})});

module.exports = router