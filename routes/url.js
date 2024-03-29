const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortId = require('shortid');
const config = require('config');

const Url = require('../models/Url');

// @route   POST    /api/url/shotern
// @description     Create short url
router.post('/shotern', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    // Check base url
    if(!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }

    // Check long url
    if(validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });
            if(url) {
                res.json(url);
            } else {
                // Create url code
                const urlCode = shortId.generate();
                const shortUrl = baseUrl + '/' + urlCode;
                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    depopulate: new Date()
                });
                await url.save();
                res.json(url);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    } else {
        return res.status(401).json('Invalid long url');
    }




});


module.exports = router;