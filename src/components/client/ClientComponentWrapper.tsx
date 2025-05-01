"use client";

import { useState } from "react";
import ServerComponentDisplay from "../server/ServerComponentDisplay";

export default function ClientComponentWrapper() {
  const [count, setCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [showServerComponent, setShowServerComponent] = useState(true);

  // Client-side event handlers
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const toggleServerComponent = () => {
    setShowServerComponent(!showServerComponent);
  };

  return (
    <div className="client-component">
      <h3>Client Component</h3>
      <p>This is a client component that interacts with server components.</p>

      <div className="client-controls">
        <div className="control-group">
          <button onClick={handleDecrement}>-</button>
          <span className="count">{count}</span>
          <button onClick={handleIncrement}>+</button>
        </div>

        <div className="control-group">
          <label htmlFor="option-select">Select an option:</label>
          <select
            id="option-select"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        <div className="control-group">
          <button
            onClick={toggleServerComponent}
            className={showServerComponent ? "active" : ""}
          >
            {showServerComponent
              ? "Hide Server Component"
              : "Show Server Component"}
          </button>
        </div>
      </div>

      {showServerComponent && (
        <div className="server-component-container">
          <ServerComponentDisplay count={count} option={selectedOption} />
        </div>
      )}

      <style jsx>{`
        .client-component {
          padding: 1.5rem;
          border: 1px solid #333;
          border-radius: 8px;
          background-color: #1a1a1a;
          margin-bottom: 2rem;
          color: #dddddd;
        }

        .client-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1rem 0;
          padding: 1rem;
          background-color: #2a2a2a;
          border-radius: 4px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #dddddd;
        }

        button {
          padding: 0.5rem 1rem;
          border: 1px solid #444;
          border-radius: 4px;
          background-color: #333333;
          color: #dddddd;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover {
          background-color: #444444;
        }

        button.active {
          background-color: #1a3a4a;
          border-color: #2a5a7a;
          color: #ffffff;
        }

        .count {
          font-size: 1.2rem;
          font-weight: bold;
          min-width: 2rem;
          text-align: center;
          color: #ffffff;
        }

        select {
          padding: 0.5rem;
          border: 1px solid #444;
          border-radius: 4px;
          background-color: #333333;
          color: #dddddd;
        }

        .server-component-container {
          margin-top: 1rem;
          border: 1px dashed #444;
          border-radius: 4px;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
