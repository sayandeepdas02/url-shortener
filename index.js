const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
// const {restrictToLoggedinUserOnly} = require("./middleware/auth");
const URL = require("./models/url");



const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter")
const userRoute = require("./routes/user");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/url-shortener")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

// ✅ Register routes globally (not inside another route)
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/test", async (req, res) => {
    try {
        const allUrls = await URL.find({});
        return res.render("home", { urls: allUrls });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: { timestamp: Date.now() },
            },
        },
        { new: true } // return updated doc
    );

    if (!entry) {
        return res.status(404).send("URL not found");
    }

    return res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
