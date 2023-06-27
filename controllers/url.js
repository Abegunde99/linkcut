const { UrlModel, ClicksModel } = require('../models');
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');
const validUrl = require('valid-url');
const { ErrorResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/async');


//@desc     create a url
//@route    POST /api/v1/urls
//@access   Private
exports.createUrl = asyncHandler(async (req, res, next) => { 
    const { url } = req.body;
    
    //check if url is valid
    if (!validUrl.isUri(url)) { 
        return next(new ErrorResponse('Invalid url', 400));
    }

    //check for existing url
    const urlExists = await UrlModel.findOne({ url });
    if (urlExists) {
        return next(new ErrorResponse('Url already exists', 400));
    }

    //check for urlCode and add default value if not present
    if (!req.body.urlCode) { 
        req.body.urlCode = nanoid(5);
    }

    //generate qrCode
    const qrCode = await QRCode.toDataURL(url);
    if(!qrCode) { 
        return next(new ErrorResponse('Error generating qrCode', 500));
    }

    //create url
    const newUrl = await UrlModel.create({
        url,
        urlCode: req.body.urlCode,
        qrCode,
        user: req.user._id,
    });

    //create clicks
    await ClicksModel.create({
        urlId: newUrl._id,  
    });

    res.status(200).json({
        success: true,
        newUrl,
    });

});


//@desc     update a url
//@route    PUT /api/v1/urls/:id
//@access   Private
exports.updateUrl = asyncHandler(async (req, res, next) => { 
    const { id } = req.params;

    //check for existing url
    const originalUrl = await UrlModel.findOne({ id });
    if (!originalUrl) {
        return next(new ErrorResponse('Url does not exist', 400));
    }

    //check if user is the owner of the url
    if (originalUrl.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('You are not authorized to update this url', 401));
    }

    const { url, urlCode } = req.body;

    //check if url is valid
    if (!validUrl.isUri(url)) {
        return next(new ErrorResponse('Invalid url', 400));
    }

    //generate qrCode
    const qrCode = await QRCode.toDataURL(url);

    const newUrl = await UrlModel.findByIdAndUpdate(id, { url, urlCode, qrCode }, { new: true, runValidators: true });
    
    res.status(200).json({
        success: true,
        newUrl,
    });


});


//@desc     Delete a url
//@route    DELETE /api/v1/urls/:id
//@access   Private
exports.deleteUrl = asyncHandler(async (req, res, next) => { 
    const { id } = req.params;

    const url = await UrlModel.findById(id);
    if (!url) {
        return next(new ErrorResponse('Url does not exist', 400));
    }

    //check if user is the owner of the url
    if (url.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('You are not authorized to delete this url', 401));
    }

    await url.remove();

    res.status(200).json({
        success: true,
        message: 'Url deleted successfully',
    });
});


//@desc     Get a url
//@route    GET /api/v1/urls/:id
//@access   Private
exports.getUrl = asyncHandler(async (req, res, next) => { 
    const { id } = req.params;
    
    const url = await UrlModel.findById(id);
    if (!url) {
        return next(new ErrorResponse('Url does not exist', 400));
    }

    res.status(200).json({
        success: true,
        url,
    });
});


//@desc     Get all urls for a user
//@route    GET /api/v1/urls
//@access   Private
exports.getUrls = asyncHandler(async (req, res, next) => { 
    const urls = await UrlModel.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        urls,
    });
});