const express = require("express");   // typo: should be require, not reaquire
const { connectToMongoDB } = require("./connect");  
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;  // keep naming consistent (you used port and PORT)

connectToMongoDB("mongodb://localhost:27017/url-shortener")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed:", err));


app.use(express.json());  // to parse JSON bodies
app.use("/url", urlRoute);


app.get("/:shortId", async(req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        { 
            $push: { 
            visitHistory: {
                timestamp: Date.now(),
            },

        },
    }
);


return res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

