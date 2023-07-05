const { UrlModel, ClicksModel } = require('../models');
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');
const validUrl = require('valid-url');
const { ErrorResponse } = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');


//@desc     create a url
//@route    POST /urls
//@access   Private
exports.createUrl = asyncHandler(async (req, res, next) => { 
    const { url } = req.body;
    const baseUrl = process.env.BASE_URL;
    let urlCode;

    // //check if url is valid
    // if (!validUrl.isUri(url)) { 
    //     return next(new ErrorResponse('Invalid url', 400));
    // }

    //check for existing url
    const urlExists = await UrlModel.findOne({ url });
    if (urlExists) {
        return next(new ErrorResponse('Url already exists', 400));
    }

    //check for urlCode and add default value if not present
    if (!req.body.slug) { 
        req.body.slug = nanoid(5);
    }

    //check for baseUrl and add default value if not present
    if (baseUrl) { 
        urlCode = `${baseUrl}/${req.body.slug}`;
    } else {
        urlCode = `${req.protocol}://${req.get('host')}/${req.body.slug}`;
    }
    //generate qrCode
    const qrCode = await QRCode.toDataURL(url);
    if(!qrCode) { 
        return next(new ErrorResponse('Error generating qrCode', 500));
    }

    //create url
    const newUrl = await UrlModel.create({
        url,
        slug: req.body.slug,
        urlCode,
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
//@route    PUT /urls/:id
//@access   Private
exports.updateUrl = asyncHandler(async (req, res, next) => { 
    const { id } = req.params;
    const baseUrl = process.env.BASE_URL;

    //check for existing url
    const originalUrl = await UrlModel.findOne({ _id: id });
    if (!originalUrl) {
        return next(new ErrorResponse('Url does not exist', 400));
    }

    //check if user is the owner of the url
    if (originalUrl.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('You are not authorized to update this url', 401));
    }

    let { url, slug } = req.body;

    //check if url is valid
    if (!validUrl.isUri(url)) {
        return next(new ErrorResponse('Invalid url', 400));
    }

    if (slug !== originalUrl.slug)  { 
        if(baseUrl) { 
            urlCode = `${baseUrl}/${slug}`;
        }else {
            urlCode = `${req.protocol}://${req.get('host')}/${slug}`;
        }
    }

    let newUrl;

    //generate qrCode only if the url is changed
    if (url !== originalUrl.url) {
        const qrCode = await QRCode.toDataURL(url);

        newUrl = await UrlModel.findByIdAndUpdate(id, { url, slug, urlCode, qrCode }, { new: true, runValidators: true });
    } else {
        newUrl = await UrlModel.findByIdAndUpdate(id, { url, slug, urlCode }, { new: true, runValidators: true });
    }

    res.status(200).json({
        success: true,
        newUrl,
    });


});


//@desc     Delete a url
//@route    DELETE /urls/:id
//@access   Private
exports.deleteUrl = asyncHandler(async (req, res, next) => { 
    const { id } = req.params;

    const url = await UrlModel.findById(id);
    if (!url) {
        return next(new ErrorResponse('Url does not exist', 400));
    }

    if (!req.user) { 
        return next(new ErrorResponse('you\'re not logged in', 401));
    }
    //check if user is the owner of the url
    if (url.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('You are not authorized to delete this url', 401));
    }

    //delete url
    await UrlModel.findByIdAndDelete(id);

    //delete clicks
    await ClicksModel.findOneAndDelete({ urlId: id });

    res.status(200).json({
        success: true,
        message: 'Url deleted successfully',
    });
});


//@desc     Get a url
//@route    GET /urls/:id
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
//@route    GET /url/user
//@access   Private
exports.getUrls = asyncHandler(async (req, res, next) => { 
    const urls = await UrlModel.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        urls,
    });
});