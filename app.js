const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve main page (mainly for testing)
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

// BMI Calculation Endpoint
app.post("/api/calculateBMI", (req, res) => {
    let { heightFeet, heightInches, weightPounds } = req.body;

    // Convert inputs to numbers
    heightFeet = parseFloat(heightFeet);
    heightInches = parseFloat(heightInches);
    weightPounds = parseFloat(weightPounds);

    // Input Validation
    if (
        isNaN(heightFeet) || isNaN(heightInches) || isNaN(weightPounds) ||
        heightFeet < 0 || heightInches < 0 || weightPounds <= 0
    ) {
        return res.status(400).json({ error: "Invalid input. Height and weight must be positive numbers." });
    }

    // Convert height to inches
    const totalInches = heightFeet * 12 + heightInches;

    // Prevent division by zero
    if (totalInches <= 0) {
        return res.status(400).json({ error: "Height must be greater than zero." });
    }

    // Calculate BMI
    const bmi = (weightPounds / (totalInches * totalInches)) * 703;

    res.json({ bmi: bmi.toFixed(2) });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
