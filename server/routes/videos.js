const { addVideo, updateVideo, deleteVideo, getAvideo, addView, subscribed, getTheRandom, getTheTrending, getByTag, search} = require("../controllers/videos");
const verifyToken = require("../utils/vrifyToken");

const router = require("express").Router()

router.post('/add',verifyToken,addVideo);
router.put('/update/:id',verifyToken,updateVideo)
router.delete('/delete/:id',verifyToken,deleteVideo)
router.get('/:id',getAvideo)
router.put('/view/:id',addView)
router.get('/sub',verifyToken,subscribed)
router.get('/trending/videos',getTheTrending)
router.get('/random/videos',getTheRandom)
router.get('/tag',getByTag);

module.exports = router;