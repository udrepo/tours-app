const ex = require("express");
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')


const router = ex.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);



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