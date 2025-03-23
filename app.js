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

app.get("/score-risk", function(req, res) {
	// get age, BMI, blood pressure, and family disease values
	const { age: age_str, bmi, bp, fd: fd_arr } = req.query;
	const age = parseInt(age_str);
	const fd = fd_arr.split(",");

	// calculation
	let score = 0;

	     if (age < 30) { score += 0;  }
	else if (age < 45) { score += 10; }
	else if (age < 60) { score += 20; }
	else               { score += 30; }

	     if (bmi === "normal")     { score += 0;  }
	else if (bmi === "overweight") { score += 30; }
	else                           { score += 75; }
	
	     if (bp === "normal")   { score += 0;   }
	else if (bp === "elevated") { score += 15;  }
	else if (bp === "stage-1")  { score += 30;  }
	else if (bp === "stage-2")  { score += 75;  }
	else if (bp === "crisis")   { score += 100; }

	fd.forEach(disease => {
		     if (disease === "diabetes")   { score += 10; }
		else if (disease === "cancer")     { score += 10; }
		else if (disease === "alzheimers") { score += 10; }
	});

	// calculate risk
	let risk;

	     if (score <= 20) { risk = "low risk";      }
	else if (score <= 50) { risk = "moderate risk"; }
	else if (score <= 75) { risk = "high risk";     }
	else                  { risk = "uninsurable";   }

	// send back total score and risk
	res.json({ score, risk });
});

app.listen(port, function() {
	console.log(`Server running on http://localhost:${port}`);
});
