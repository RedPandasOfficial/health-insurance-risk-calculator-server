const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Enabling CORS is useful so websites with different origins
// can access our API
app.use(cors());

app.get("/", function(req, res) {
	res.sendFile("index.html", { root: __dirname });
});

app.get("/total-score-risk", function(req, res) {
	// ouch!
});

app.listen(port, function() {
	console.log(`Server running on http://localhost:${port}`);
});