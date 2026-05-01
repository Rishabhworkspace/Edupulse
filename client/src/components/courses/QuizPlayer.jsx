import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function QuizPlayer({ lesson, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!lesson || lesson.type !== 'quiz') return null;

  const handleSelect = (qIndex, oIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: oIndex });
  };

  const handleSubmit = () => {
    if (!lesson.questions) return;
    let s = 0;
    lesson.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) s++;
    });
    setScore(s);
    setSubmitted(true);
    if (s === lesson.questions.length && onComplete) {
      onComplete(lesson._id);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const allAnswered = lesson.questions && Object.keys(answers).length === lesson.questions.length;

  return (
    <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quiz: {lesson.title}</h3>
        {!lesson.questions || lesson.questions.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No questions available for this quiz.</p>
        ) : (
          <div className="space-y-6">
            {lesson.questions.map((q, qIndex) => {
              const selected = answers[qIndex];
              const correct = q.correctIndex;
              const showSuccess = submitted && selected === correct;
              const showWrong = submitted && selected !== correct && selected !== undefined;

              return (
                <div key={qIndex} className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => {
                      const isSelected = selected === oIndex;
                      return (
                        <label
                          key={oIndex}
                          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors border ${
                            showSuccess && isSelected ? 'border-success bg-success/10' :
                            showWrong && isSelected ? 'border-error bg-error/10' :
                            isSelected ? 'border-primary bg-primary/5' :
                            'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            checked={isSelected}
                            onChange={() => handleSelect(qIndex, oIndex)}
                            disabled={submitted}
                            className="w-4 h-4 text-primary"
                          />
                          <span className={`text-sm ${showSuccess && isSelected ? 'text-success' : showWrong && isSelected ? 'text-error' : ''}`} style={{ color: (!showSuccess && !showWrong) ? 'var(--text-secondary)' : undefined }}>
                            {opt}
                          </span>
                          {showSuccess && isSelected && <CheckCircle className="w-4 h-4 text-success ml-auto" />}
                          {showWrong && isSelected && <X className="w-4 h-4 text-error ml-auto" />}
                        </label>
                      );
                    })}
                  </div>
                  {submitted && q.explanation && (
                    <div className="mt-3 p-3 rounded-md text-sm border border-primary/20 bg-primary/5" style={{ color: 'var(--text-secondary)' }}>
                      <strong className="text-primary">Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              {submitted ? (
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    Score: {score} / {lesson.questions.length}
                  </span>
                  {score === lesson.questions.length ? (
                    <span className="badge badge-success">Perfect! Lesson Completed.</span>
                  ) : (
                    <button onClick={handleRetry} className="btn btn-secondary btn-sm">Retry Quiz</button>
                  )}
                </div>
              ) : (
                <button onClick={handleSubmit} disabled={!allAnswered} className="btn btn-primary">
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}