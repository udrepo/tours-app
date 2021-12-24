const ex = require("express");
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')


const router = ex.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


router
.route("/")
.get(userController.getAllUsers)
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