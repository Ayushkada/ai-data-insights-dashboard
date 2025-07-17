# 🧠 AI-Powered Data Insights Dashboard

A full-stack application for data profiling and exploratory analysis, powered by GPT-4o, FastAPI, and React. Users can upload datasets (CSV, Parquet), explore summary statistics, uncover correlations, and interact with the data through an intuitive UI or a natural-language chatbot.

---

## 📊 Features

✅ Upload and manage tabular datasets (CSV/Parquet)  
✅ Automated data profiling (summary stats, distributions, nulls, skewness)  
✅ Correlation analysis for numeric and categorical variables  
✅ Plotly-powered interactive visualizations  
✅ GPT-4o powered chatbot that generates insights, graphs, and explanations  
✅ Real-time interaction via checkboxes/buttons or natural language  
✅ Secure and scalable backend with S3, Redis, PostgreSQL

---

## ✨ Demo (Coming Soon)

<!-- Add a Loom/GIF demo link here once you build -->

![dashboard-demo](docs/dashboard-preview.gif)

---

## 🧱 Architecture

**Frontend:**

- React + Vite + TypeScript
- Plotly.js for visualizations
- Tailwind CSS for styling
- TanStack Query for API state management

**Backend:**

- FastAPI (Python 3.12)
- Pandas/Polars for data handling
- Redis for background job queuing and caching
- PostgreSQL (or SQLite for MVP)
- AWS S3 for file storage
- GPT-4o (OpenAI) for natural language insights

---

## ⚙️ Installation (Local Dev)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

# Frontend

cd frontend
npm install
npm run dev

## 💡 Use Cases

- 📈 Explore and understand new datasets quickly
- 💬 Ask questions like "What features are highly correlated with target?"
- 🔍 Identify missing data patterns and skewed distributions
- 📁 Convert exploratory analysis into visual stories for stakeholders

## 🛠️ Project Roadmap

✅ MVP (Weeks 1–4)

- File upload and profiling (summary stats, distributions)
- Correlation analysis
- GPT chatbot with function-calling (descriptive + correlation)
- Multi-tab analysis display
- Deployment (Render/Fly.io + Docker)
  🚀 Phase 2+ (Post-MVP)
- Time-series & anomaly detection
- Clustering & dimensionality reduction
- Predictive modeling (AutoML)
- Sentiment analysis (for text fields)

## 🧠 GPT Function Calling Schema

{
"name": "analyze_correlation",
"description": "Run correlation analysis on a dataset",
"parameters": {
"dataset_id": "string",
"method": "pearson | spearman | cramers_v",
"target_column": "string (optional)"
}
}
More schemas in /schemas folder.

## 📂 Folder Structure

.
├── frontend/ # React + Vite frontend
├── backend/ # FastAPI backend
├── docs/ # Screenshots, diagrams, notebooks
├── schemas/ # GPT function-calling schemas
├── docker/ # Docker config (WIP)
└── README.md
