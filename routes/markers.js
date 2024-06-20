const express = require('express')

const router = express.Router()
const {
    getMarkers,
    getMarkersFromPostLink,
    getMarkersFromMarkerIds
} = require('../controllers/markers')

router.post('/:page/:limit', getMarkers)
router.post('/post_link', getMarkersFromPostLink)
router.post('/ids', getMarkersFromMarkerIds)

module.exports = router
