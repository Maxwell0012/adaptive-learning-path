# 🚀 Adaptive Learning Path (Arrear-Eraser)

A Multi-Agent AI Education Platform built to help students clear exams efficiently using the Pareto Principle (80/20 Rule).

![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![AI Model](https://img.shields.io/badge/AI-Llama3_70b-orange)

## 💡 The Problem
Students often struggle to find a structured path to clear exams last minute. Generic chatbots give long answers, but they don't strategize for **passing marks**.

## ⚡ Key Features
* **🤖 Multi-Agent Workflow:**
    * **Strategist Agent:** Analyzes the syllabus and time remaining to create a roadmap.
    * **Tutor Agent:** Generates custom practice problems and revision notes based on the roadmap.
* **🚨 Arrear-Eraser Mode:** A specialized prompting engine that filters for the "Top 20% High-Weight Topics" that yield 80% of the marks.
* **🧠 Adaptive Vibe Check:** Adjusts the difficulty of the content based on the user's confidence level (Beginner/Intermediate/Advanced).
* **📝 Instant Quiz Generation:** Parses the study material into a JSON-based interactive quiz.

## 🛠️ Tech Stack
* **Frontend:** React.js + Vite
* **AI Inference:** Groq Cloud (Llama-3-70b-Versatile)
* **Styling:** CSS3 (Responsive Dark Mode)
* **State Management:** React Hooks

## 🚀 How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Maxwell0012/adaptive-learning-path.git](https://github.com/Maxwell0012/adaptive-learning-path.git)
    cd adaptive-learning-path
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add your Groq API Key:
    ```env
    VITE_GROQ_API_KEY=your_api_key_here
    ```

4.  **Run the App**
    ```bash
    npm run dev
    ```
5. **The Team**

| Name | Socials |
|------|---------|
| **Maxwell B** | [GitHub](https://github.com/Maxwell0012) |
| **Joyel Agastin A** | [GitHub](https://github.com/joyelaagastin-sudo) |
| **Lokapradip S** | [GitHub](https://github.com/lokapradip) |