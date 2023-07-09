const {ClicksModel, UrlModel} = require('../models');
const { ErrorResponse } = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geoip = require('geoip-lite');
const addClicks = require('../utils/addClick');
const { redisClient } = require('../utils/redis');

//@desc     get all clicks
//@route    GET /clicks
//@access   Private
const getClicks = asyncHandler(async (req, res, next) => { 
    const clicks = await ClicksModel.find({}).populate('urlId');

   
    res.status(200).json({
        success: true,
        data: clicks,
    });
});

//desc     get clicks by urlId
//@route    GET /clicks/:urlId
//@access   Private
const getClicksByUrlId = asyncHandler(async (req, res, next) => { 
        // const cacheKey = req.originalUrl; // Use the URL as the cache key
    
        // // Check if data exists in the cache
        // redisClient.get(cacheKey, async (err, cachedData) => {
        //     if (err) {
        //         console.error('Error retrieving cached data:', err);
        //         next(err);
        //         return;
        //     }
    
        //     if (cachedData !== null) {
        //         // Data exists in cache, send the cached response
        //         res.send(JSON.parse(cachedData));
        //     } else {
        //         // Data doesn't exist in cache, retrieve it from the primary data source
        //         const clicks = await ClicksModel.find({ urlId: req.params.urlId }).populate('urlId');
            
    
        //         // Set the data in the cache
        //         redisClient.set(cacheKey, JSON.stringify(clicks), (err) => {
        //             if (err) {
        //                 console.error('Error setting data in cache:', err);
        //             }
        //         });
    
        //         res.send(clicks);
        //     }
        // });
        const clicks = await ClicksModel.find({urlId: req.params.urlId}).populate('urlId');
   
        res.status(200).json({
            success: true,
            data: clicks,
        });
});

//desc    click on urlCode and redirect to original url and add click
//@route    GET /:urlCode
//@access   Public
const clickUrl = asyncHandler(async (req, res, next) => { 
    const { urlCode } = req.params;
    const url = await UrlModel.findOne({ slug: urlCode });
    if (!url) {
        return next(new ErrorResponse('Url not found', 404));
    }
    const clicks = await addClicks(ClicksModel, req, url._id);

    res.redirect(url.url);
});


//@desc    get all clicks by a user where user is inside urlId
//@route    GET /user/clicks
//@access   Private
const getUserClicks = asyncHandler(async (req, res, next) => { 
    const clicks = await ClicksModel.find({}).populate('urlId');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    // get clicks where req.user._id is equal to clicks.urlId.user
    const userClick = [];
    for (let i = 0; i < clicks.length; i++) { 
        if (clicks[i].urlId.user == req.user.sessionId) { 
            userClick.push(clicks[i]);
        }
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const userClicks = userClick.slice(startIndex, endIndex);

    const total = userClick.length;
  
    // Pagination result
    const pagination = {};
  
    if (endIndex < total) {
        pagination.next = { page: page + 1} 
    }
  
    if (startIndex > 0) {
        pagination.prev = { page: page - 1}
    }
           
    res.status(200).json({
        success: true,
        data: {userClicks, pagination, limit, total},
    });

});

module.exports = {
    getClicks,
    getClicksByUrlId,
    clickUrl,
    getUserClicks,
}