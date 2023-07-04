const {ClicksModel, UrlModel} = require('../models');
const { ErrorResponse } = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geoip = require('geoip-lite');
const addClicks = require('../utils/addClick');

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


//@desc    get all clicks by a user
//@route    GET /user/clicks
//@access   Private
const getUserClicks = asyncHandler(async (req, res, next) => { 
    const clicks = await ClicksModel.find({user: req.user._id}).populate('urlId');
   
    res.status(200).json({
        success: true,
        data: clicks,
    });
});

module.exports = {
    getClicks,
    getClicksByUrlId,
    clickUrl,
    getUserClicks,
}