const { ErrorResponse } = require('./errorResponse');
const geoip = require('geoip-lite');


const addClicks = async (model, req, urlId) => { 
    const { referer, 'user-agent': userAgent } = req.headers;
    const ipAddress = req.ip;
    
    // Use geoip-lite to get location information based on IP address
    const geo = geoip.lookup(ipAddress);
    const state = geo ? geo.region : 'Unknown';
    const country = geo ? geo.country : 'Unknown';

    // Get device information from user agent string
    const device = userAgent;

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