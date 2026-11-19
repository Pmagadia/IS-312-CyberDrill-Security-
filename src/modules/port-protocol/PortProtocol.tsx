
import { useState, useEffect, useRef } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { motion } from "framer-motion";
import "./PortProtocol.css";

import { portData } from "./portData";
import {
  checkMatch,
  hasReachedAttemptLimit,
  calculateScore,
  calculateAccuracy,
} from "./matchingLogic";

import DraggableProtocol from "./DraggableProtocol";
import DroppablePort from "./DroppablePort";

// Shared scoring system used by the dashboard.
import { saveScore } from "../../shared/scoring";

// Shuffles items into a random order.
function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function PortProtocol() {
  // Stores feedback and the protocol selected by tapping.
  const [feedback, setFeedback] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(
    null
  );

  // Tracks correct matches and revealed answers.
  const [matched, setMatched] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<string[]>([]);

  // Tracks incorrect attempts for each protocol.
  const [mistakes, setMistakes] = useState<Record<string, number>>({});

  // Tracks total attempts and correct answers.
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Randomly selects 10 protocols from all 25.
  const [questions, setQuestions] = useState(() =>
    shuffleItems(portData).slice(0, 10)
  );

  // Shuffles the ports separately.
  const [shuffledPorts, setShuffledPorts] = useState(() =>
    shuffleItems(questions)
  );

  // Prevents the same completed game from being saved twice.
  const scoreSaved = useRef(false);

  // Calculates progress and scores.
  const completed = matched.length + revealed.length;
  const missed = revealed.length;

  // Calculates the final score using our tested function.
  const score = calculateScore(correctAnswers, questions.length);

  // Calculates accuracy using our tested function.
  const accuracy = calculateAccuracy(correctAnswers, totalAttempts);

  // Saves the final score once all 10 questions are completed.
  useEffect(() => {
    if (completed === questions.length && !scoreSaved.current) {
      scoreSaved.current = true;

      saveScore("port-protocol", correctAnswers, 10);
    }
  }, [completed, questions.length, correctAnswers]);

  // Starts a new game.
  function restartGame() {
    const newQuestions = shuffleItems(portData).slice(0, 10);

    // Allows the next completed game to save a new score.
    scoreSaved.current = false;

    setQuestions(newQuestions);
    setShuffledPorts(shuffleItems(newQuestions));
    setMatched([]);
    setRevealed([]);
    setMistakes({});
    setTotalAttempts(0);
    setCorrectAnswers(0);
    setSelectedProtocol(null);
    setFeedback("");
  }

  // Both dragging and tapping use this function.
  function checkAnswer(protocol: string, port: number) {
    // Finds the correct answer for the selected protocol.
    const correct = questions.find(
      (item) => item.protocol === protocol
    );

    if (!correct) return;

    // Finds the port the user selected.
    const targetPort = questions.find(
      (item) => item.port === port
    );

    if (!targetPort) return;

    // Prevents completed protocols from being answered again.
    if (
      matched.includes(protocol) ||
      revealed.includes(protocol)
    ) {
      setSelectedProtocol(null);
      return;
    }

    // Completed ports do not count as attempts.
    if (
      matched.includes(targetPort.protocol) ||
      revealed.includes(targetPort.protocol)
    ) {
      setFeedback(
        "This port is already completed. Choose another port."
      );
      return;
    }

    // Counts only attempts on unfinished ports.
    setTotalAttempts((previous) => previous + 1);

    if (checkMatch(port, correct.port)) {
      // Saves a correct answer.
      setMatched((previous) => [...previous, protocol]);
      setCorrectAnswers((previous) => previous + 1);

      setFeedback(
        `Correct! ${protocol} uses port ${correct.port}.`
      );

      // Clears the selection after a correct answer.
      setSelectedProtocol(null);
    } else {
      // Tracks mistakes for this protocol.
      const newMistakes = (mistakes[protocol] || 0) + 1;

      setMistakes((previous) => ({
        ...previous,
        [protocol]: newMistakes,
      }));

      if (hasReachedAttemptLimit(newMistakes)) {
        // Reveals the answer after three incorrect attempts.
        setRevealed((previous) => [...previous, protocol]);

        setFeedback(
          `Three incorrect attempts. ${protocol} uses port ${correct.port}. ${correct.description}`
        );

        setSelectedProtocol(null);
      } else {
        setFeedback(
          `Incorrect. ${protocol} has ${
            3 - newMistakes
          } attempts remaining.`
        );
      }
    }
  }

  // Handles dragging a protocol onto a port.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const protocol = String(active.id);
    const port = Number(over.id);

    checkAnswer(protocol, port);
  }

  // Handles tapping a protocol box.
  function handleProtocolSelect(protocol: string) {
    setSelectedProtocol(
      selectedProtocol === protocol ? null : protocol
    );
  }

  // Handles tapping a port box.
  function handlePortSelect(port: number) {
    if (!selectedProtocol) {
      setFeedback("Select a protocol first.");
      return;
    }

    checkAnswer(selectedProtocol, port);
  }

  return (
    <section className="page port-protocol-page">
      <h1>Port &amp; Protocol Match</h1>

      <p>
        Match each protocol to its correct port. Drag and drop, or
        select a protocol and then choose a port. You have three
        attempts per protocol.
      </p>

      <DndContext onDragEnd={handleDragEnd}>
        <h2>Protocols</h2>

        {/* Displays the available protocols. */}
        <div className="protocol-grid">
          {questions
            .filter(
              (item) =>
                !matched.includes(item.protocol) &&
                !revealed.includes(item.protocol)
            )
            .map((item) => (
              <DraggableProtocol
                key={item.protocol}
                protocol={item.protocol}
                isMatched={false}
                isSelected={selectedProtocol === item.protocol}
                onSelect={() =>
                  handleProtocolSelect(item.protocol)
                }
              />
            ))}
        </div>

        <h2>Ports</h2>

        {/* Displays the matching port boxes. */}
        <div className="port-grid">
          {shuffledPorts.map((item) => (
            <DroppablePort
              key={item.port}
              port={item.port}
              matchedProtocol={
                matched.includes(item.protocol) ||
                revealed.includes(item.protocol)
                  ? item.protocol
                  : undefined
              }
              isMissed={revealed.includes(item.protocol)}
              onSelect={handlePortSelect}
            />
          ))}
        </div>
      </DndContext>

      {/* Animates the feedback after each attempt. */}
      <motion.p
        key={feedback}
        aria-live="polite"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        {feedback}
      </motion.p>

      {/* Displays the progress dashboard. */}
      <div className="progress-section">
        <div className="progress-heading">
          <h2>Your Progress</h2>

          <span>
            {completed} / {questions.length} completed
          </span>
        </div>

        <progress
          value={completed}
          max={questions.length}
          className="progress-bar"
        />

        <div className="progress-stats">
          <div className="stat-box">
            <strong>{correctAnswers}</strong>
            <span>Correct</span>
          </div>

          <div className="stat-box">
            <strong>{missed}</strong>
            <span>Missed</span>
          </div>

          <div className="stat-box">
            <strong>{totalAttempts}</strong>
            <span>Attempts</span>
          </div>

          <div className="stat-box">
            <strong>{accuracy}%</strong>
            <span>Accuracy</span>
          </div>
        </div>
      </div>

      {/* Shows final results after all 10 questions. */}
      {completed === questions.length && (
        <div className="assessment-results">
          <h2>Assessment Complete!</h2>
          <p>Final Score: {score}%</p>
          <p>Attempt Accuracy: {accuracy}%</p>
        </div>
      )}

      {/* Restarts the game with new questions. */}
      <button
        type="button"
        onClick={restartGame}
        style={{
          padding: "10px 20px",
          marginTop: "15px",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      >
        Restart Game
      </button>
    </section>
  );
}
