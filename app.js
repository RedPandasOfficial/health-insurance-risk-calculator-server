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

app.get("/score-risk", function(req, res) {
	// get age, BMI, blood pressure, and family disease values
	const { age: age_str, bmi, bp, fd } = req.query;
	const age = parseInt(age_str);

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

	     if (fd === "diabetes")   { score += 10; }
	else if (fd === "cancer")     { score += 10; }
	else if (fd === "alzheimers") { score += 10; }

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