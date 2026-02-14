import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { runAgent } from "./api";
import "./App.css";

function App() {
  const [weakTopic, setWeakTopic] = useState("");
  const [studentLevel, setStudentLevel] = useState("Intermediate");
  const [timeAvailable, setTimeAvailable] = useState("");

  const [arrearMode, setArrearMode] = useState(false);
  const [vibeScore, setVibeScore] = useState(null);

  const [studyPlan, setStudyPlan] = useState("");
  const [practiceMaterial, setPracticeMaterial] = useState("");

  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  /* ================= LEARNING PATH ================= */

  const generatePath = async () => {
    if (!weakTopic || !timeAvailable) {
      alert("Please fill in the Topic and Time!");
      return;
    }

    setLoading(true);
    setStudyPlan("");
    setPracticeMaterial("");
    setQuiz(null);
    setQuizAnswers({});
    setQuizResult(null);

    let adjustedLevel = studentLevel;
    if (vibeScore === 1) adjustedLevel = "Beginner";
    if (vibeScore === 2) adjustedLevel = "Intermediate";
    if (vibeScore === 3) adjustedLevel = "Advanced";

    setStatus("🧠 Strategist Agent analyzing your learning needs...");

    try {
      const strategyPrompt = `
You are an expert Education Strategist.

Create a learning path for a ${adjustedLevel} student.
Topic: ${weakTopic}
Time Available: ${timeAvailable}

${arrearMode ? `
SPECIAL MODE: ARREAR-ERASER
- Focus on the TOP 20% of concepts yielding ~80% exam marks
- Mark them as "🔥 High-Weight Topics"
- Ignore low-frequency topics
- Optimize for exam clearance
` : ""}

REQUIRED OUTPUT:
1. Time-based modules
2. Revision Checkpoint after each module
3. Markdown with ### headers
`;

      const plan = await runAgent(
        "You are a strict Study Planner Agent.",
        strategyPrompt
      );

      setStudyPlan(plan);
      setStatus("🤝 Tutor Agent preparing practice & revision...");

      const tutorPrompt = `
Analyze the following learning plan:

${plan}

TASK:
1. Checkpoint Study Guide (bullets)
2. ONE practice challenge
3. Full solution
4. Markdown formatting
`;

      const material = await runAgent(
        "You are a helpful Tutor Agent.",
        tutorPrompt
      );

      setPracticeMaterial(material);
      setStatus("✅ Learning path ready. Scroll down to test yourself!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Agent collaboration failed.");
    }

    setLoading(false);
  };

  /* ================= QUIZ ================= */

  const generateQuiz = async () => {
    if (!studyPlan) return;

    setStatus("📝 Tutor Agent generating assessment...");
    setQuiz(null);
    setQuizAnswers({});
    setQuizResult(null);

    const quizPrompt = `
Generate a quiz in STRICT JSON.

CONTENT:
${studyPlan}

RULES:
- Exactly 3 questions
- Each has: question, options (4), correctAnswer (0-3)
- Return ONLY JSON

FORMAT:
{
  "questions": [
    {
      "question": "text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 1
    }
  ]
}
`;

    const quizData = await runAgent(
      "You are an assessment Tutor Agent.",
      quizPrompt
    );

    try {
      const start = quizData.indexOf("{");
      const end = quizData.lastIndexOf("}") + 1;
      const parsed = JSON.parse(quizData.slice(start, end));
      setQuiz(parsed);
      setStatus("✅ Quiz ready. Answer and submit!");
    } catch (err) {
      console.error("Quiz parse error:", quizData);
      setStatus("❌ Quiz generation failed. Retry once.");
    }
  };

  const selectAnswer = (qIndex, optIndex) => {
    setQuizAnswers({ ...quizAnswers, [qIndex]: optIndex });
  };

  const submitQuiz = () => {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) score++;
    });
    setQuizResult(score);
    setStatus(`🎯 You scored ${score} / ${quiz.questions.length}`);
  };

  /* ================= TXT DOWNLOAD ================= */

  const downloadTXT = () => {
    let content = `ADAPTIVE LEARNING PATH\n`;
    content += `=====================\n\n`;
    content += `Topic: ${weakTopic}\n`;
    content += `Level: ${studentLevel}\n`;
    content += `Time Available: ${timeAvailable}\n`;
    content += `Arrear-Eraser Mode: ${arrearMode ? "ON" : "OFF"}\n\n`;

    if (studyPlan) {
      content += `--- STRATEGIC PLAN ---\n\n`;
      content += studyPlan.replace(/[#*]/g, "") + "\n\n";
    }

    if (practiceMaterial) {
      content += `--- PRACTICE & REVISION ---\n\n`;
      content += practiceMaterial.replace(/[#*]/g, "") + "\n\n";
    }

    if (quiz) {
      content += `--- QUICK ASSESSMENT ---\n\n`;
      quiz.questions.forEach((q, i) => {
        content += `Q${i + 1}. ${q.question}\n`;
        q.options.forEach((opt, idx) => {
          content += `  ${String.fromCharCode(65 + idx)}. ${opt}\n`;
        });
        content += `Answer: ${String.fromCharCode(
          65 + q.correctAnswer
        )}\n\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${weakTopic.replace(/\s+/g, "_")}_LearningPath.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setWeakTopic("");
    setTimeAvailable("");
    setStudyPlan("");
    setPracticeMaterial("");
    setQuiz(null);
    setQuizAnswers({});
    setQuizResult(null);
    setVibeScore(null);
    setArrearMode(false);
    setStatus("");
  };

  return (
    <div className="container">
      <header>
        <h1>🚀 Adaptive Learning Path</h1>
        <p>Adaptive multi-agent learning for exam success</p>
      </header>

      {/* INPUT */}
      <div className="input-card">
        <div className="input-group">
          <label>Weak Topic</label>
          <input
            value={weakTopic}
            onChange={(e) => setWeakTopic(e.target.value)}
            placeholder="e.g. Enter the topic you want to improve on"
          />
        </div>

        <div className="row">
          <div className="input-group">
            <label>Current Level</label>
            <select
              value={studentLevel}
              onChange={(e) => setStudentLevel(e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div className="input-group">
            <label>Time Available</label>
            <input
              value={timeAvailable}
              onChange={(e) => setTimeAvailable(e.target.value)}
              placeholder="e.g. days until exam or study hours"
            />
          </div>
        </div>

        {/* ARREAR MODE */}
        <div
          className={`arrear-toggle ${arrearMode ? "active" : ""}`}
          onClick={() => setArrearMode(!arrearMode)}
        >
          🚨 Arrear-Eraser Mode
          <span className="subtext">(80/20 Exam Focus)</span>
        </div>

        {/* VIBE CHECK */}
        <div className="input-group">
          <label>⚡ Quick Vibe Check</label>
          <div className="vibe-group">
            <button
              className={`vibe-btn ${vibeScore === 1 ? "active" : ""}`}
              onClick={() => setVibeScore(1)}
            >
              😰 Totally Lost
            </button>
            <button
              className={`vibe-btn ${vibeScore === 2 ? "active" : ""}`}
              onClick={() => setVibeScore(2)}
            >
              😐 Somewhat Familiar
            </button>
            <button
              className={`vibe-btn ${vibeScore === 3 ? "active" : ""}`}
              onClick={() => setVibeScore(3)}
            >
              😎 Very Confident
            </button>
          </div>
        </div>

        <div className="button-group">
          <button
            className="generate-btn"
            onClick={generatePath}
            disabled={loading}
          >
            {loading ? "Agents Collaborating..." : "Generate Learning Path"}
          </button>
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* STATUS */}
      {status && (
        <div className={`status-bar ${status.includes("❌") ? "error" : ""}`}>
          {status}
        </div>
      )}

      {/* RESULTS */}
      <div className="results-grid">
        {studyPlan && (
          <div className="result-card">
            <h3>📅 Strategic Plan</h3>
            <div className="markdown-content">
              <ReactMarkdown>{studyPlan}</ReactMarkdown>
            </div>
          </div>
        )}

        {practiceMaterial && (
          <div className="result-card">
            <h3>📝 Practice & Revision</h3>
            <div className="markdown-content">
              <ReactMarkdown>{practiceMaterial}</ReactMarkdown>
            </div>
          </div>
        )}

        {studyPlan && (
          <div className="result-card">
            <h3>⬇️ Export Study Material</h3>
            <button className="generate-btn" onClick={downloadTXT}>
              Download as .txt
            </button>
          </div>
        )}

        {studyPlan && !quiz && (
          <div className="result-card">
            <h3>🧠 Knowledge Check</h3>
            <button className="generate-btn" onClick={generateQuiz}>
              Take Quick Quiz
            </button>
          </div>
        )}

        {quiz && (
          <div className="result-card">
            <h3>📝 Quick Assessment</h3>

            {quiz.questions.map((q, qi) => (
              <div key={qi} style={{ marginBottom: "18px" }}>
                <strong>
                  Q{qi + 1}. {q.question}
                </strong>

                <div className="quiz-options">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      className={`quiz-option ${
                        quizAnswers[qi] === oi ? "selected" : ""
                      }`}
                      onClick={() => selectAnswer(qi, oi)}
                      disabled={quizResult !== null}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {quizResult !== null && (
                  <p className="quiz-answer">
                    Correct answer: {q.options[q.correctAnswer]}
                  </p>
                )}
              </div>
            ))}

            {quizResult === null ? (
              <button className="generate-btn" onClick={submitQuiz}>
                Submit Quiz
              </button>
            ) : (
              <p style={{ fontWeight: "bold" }}>
                🎯 Final Score: {quizResult} / {quiz.questions.length}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
