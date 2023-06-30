const { ErrorResponse } = require('./errorResponse');
const geoip = require('geoip-lite');
const useragent = require('useragent');


const addClicks = async (model, req, urlId) => { 
    const { 'user-agent': userAgent } = req.headers;
    console.log(req.headers)
    const ipAddress = req.ip;
    const referrer = req.headers.referer || req.headers.referrer;
    // console.log(referrer)
    let referer;
    if (referrer) {
        referer = new URL(referrer).hostname;
    } else {
        referer = 'Unknown';
    }
   
    // console.log(referer)
    let source;
    if (referer.includes('whatsapp')) {
        source = 'whatsapp';
    } else if (referer.includes('facebook')) {
        source = 'facebook';
    } else if (referer.includes('twitter')) {
        source = 'twitter';
    } else if (referer.includes('instagram')) {
        source = 'instagram';
    } else {
        source = 'others';
    }
    // Use geoip-lite to get location information based on IP address
    const geo = geoip.lookup(ipAddress);

    const state = geo ? geo.region : 'Unknown';
    const country = geo ? geo.country : 'Unknown';

    // Get device information from user agent string
    const agent = useragent.parse(userAgent);
    const osFamily = agent.os.toString();

    let device;
    if (osFamily.includes('Android')) {
        device = 'Android';
    } else if (osFamily.includes('iOS')) {
        device = 'iOS';
    } else if (osFamily.includes('Windows')) {
        device = 'Windows';
    } else if (osFamily.includes('Mac')) {
        device = 'Mac';
    } else if (osFamily.includes('Linux')) {
        device = 'Linux';
    } else {
        device = 'Others';
    }
    

    const location = `${state}, ${country}`;
    
    const clicks = await model.findOne({ urlId });

    if (!clicks) {
        return next(new ErrorResponse('Clicks not found', 404));
    }

    clicks.clicks += 1;
    clicks.devices.push(device);
    clicks.locations.push(location);
    clicks.sources.push(source);

    await clicks.save();

    return clicks
}

module.exports = addClicks;