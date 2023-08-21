const { update, getUser, subscribe, unsubscribe, like, dislike, deleteUser } = require("../controllers/users");
const { getByTag, getTheRandom, search} = require("../controllers/videos");
const verifyToken = require("../utils/vrifyToken");

const router = require("express").Router();

//get video by tags
router.get('/tag',getByTag)

//get video by searching the title
router.get('/search',search)

router.put('/update/:id',verifyToken,update)
router.delete('/:id',verifyToken,deleteUser)
router.get('/:id',getUser)
router.put('/subscribe/:id',verifyToken,subscribe)
router.put('/unsubscribe/:id',verifyToken,unsubscribe)
router.put('/like/:id',verifyToken,like)
router.put('/dislike/:id',verifyToken,dislike)



module.exports = router;