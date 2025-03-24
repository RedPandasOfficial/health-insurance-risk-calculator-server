const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Serve main page (mainly for testing)
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

// BMI Calculation Route
app.get("/calculate-bmi", (req, res) => {
    let weight = parseFloat(req.query.weight); 
    let height = parseFloat(req.query.height);

    let heightInches = height * 12;
    let bmiValue = (weight / (heightInches * heightInches)) * 703;

    let bmiCategory;
    if (bmiValue < 25) {
        bmiCategory = "normal";
    } else if (bmiValue < 30) {
        bmiCategory = "overweight";
    } else {
        bmiCategory = "obese";
    }

    res.json({ bmi: bmiCategory });
});

// Risk Scoring API
app.get("/score-risk", function(req, res) {
    // Get query parameters
    const { age: age_str, bmi, bp, fd: fd_arr } = req.query;
    const age = parseInt(age_str);
    const fd = fd_arr ? fd_arr.split(",") : [];

    // Risk score calculation
    let score = 0;

    if (age < 30) { score += 0; }
    else if (age < 45) { score += 10; }
    else if (age < 60) { score += 20; }
    else { score += 30; }

    if (bmi === "normal") { score += 0; }
    else if (bmi === "overweight") { score += 30; }
    else { score += 75; }

    if (bp === "normal") { score += 0; }
    else if (bp === "elevated") { score += 15; }
    else if (bp === "stage-1") { score += 30; }
    else if (bp === "stage-2") { score += 75; }
    else if (bp === "crisis") { score += 100; }

    fd.forEach(disease => {
        if (disease === "diabetes") { score += 10; }
        else if (disease === "cancer") { score += 10; }
        else if (disease === "alzheimers") { score += 10; }
    });

    // Determine risk category
    let risk;
    if (score <= 20) { risk = "low risk"; }
    else if (score <= 50) { risk = "moderate risk"; }
    else if (score <= 75) { risk = "high risk"; }
    else { risk = "uninsurable"; }

    res.json({ score, risk });
});

app.get("/ping", function(req, res) {
	res.json({ success: true });
});

app.listen(port, function() {
    console.log(`Server running on http://localhost:${port}`);
});
