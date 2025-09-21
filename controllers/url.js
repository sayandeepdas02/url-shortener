const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: "Url is required" });
    }

    const shortID = shortid();

    await URL.create({ 
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: []
    });

    return res.json({ id: shortID });  // ✅ fixed missing ()
}

async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        totalClicks: result.visitHistory.length, 
        analytics: result.visitHistory,
    });
}

// ✅ export should be outside the function
module.exports = { 
    handleGenerateNewShortUrl,
    handleGetAnalytics,
};
 