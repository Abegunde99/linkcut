const { ErrorResponse } = require('./errorResponse');
const geoip = require('geoip-lite');
const useragent = require('useragent');


const addClicks = async (model, req, urlId) => { 
    const { referer, 'user-agent': userAgent } = req.headers;
    const ipAddress = req.ip;
   
    // Use geoip-lite to get location information based on IP address
    const geo = geoip.lookup(ipAddress);
    console.log(geo)
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
    // Get source information from referer
    const source = referer;

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