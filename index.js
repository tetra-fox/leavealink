var express = require("express"),
    app = express();
var bodyParser = require("body-parser");
var redis = require("redis"),
    client = redis.createClient(process.env.REDIS_URL);
var request = require("request");
var pkg = require("./package.json");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/info", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({
        version: `${pkg.version}`,
        description: `${pkg.description}`
    }));
});

app.post("/submit", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    req.body.url.startsWith("https://") || req.body.url.startsWith("http://") ? url = req.body.url : url = "http://" + req.body.url;

    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            client.get("url", function(err, reply) {
                res.send(JSON.stringify({
                    url: reply
                }));
            });
            client.set("url", url, redis.print);
        } else if (error && error.code == "ENOTFOUND") {
            res.status(400).send(JSON.stringify({
                message: "This isn't a valid url.",
                error: error
            }));
        } else if (error) {
            res.status(500).send(JSON.stringify({
                message: "Something broke on my end.",
                error: error
            }));
        }
    });
});

// im pretty sure this is not how you handle http errors in express but whatever lol
app.all("*", function(req, res) {
    res.status(404).redirect("/");
});

var listener = app.listen(process.env.PORT || 1337, function() {
    console.log("Listening on port " + listener.address().port);
});
