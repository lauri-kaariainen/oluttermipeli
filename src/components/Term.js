import { useState } from "preact/hooks";

export const Term = ({
  term,
  onClick = (_) => _,
  initialShowResult,
  isCorrect
}) => {
  const [showsResult, setShowsResult] = useState(false);

  return (
    <div
      class={
        "result" +
        // (isGuessed && showsResult ? " selected" : " ") +
        (initialShowResult || showsResult ? " selected" : "") +
        (isCorrect && (showsResult || initialShowResult)
          ? " correctGuess"
          : " ")
      }
    >
      <div>
        <button
          onClick={(_) => {
            setShowsResult(true);
            setTimeout((__) => onClick(term), 200);
          }}
        >
          {term}
        </button>
        {isCorrect && (showsResult || initialShowResult) ? "🌟" : ""}
      </div>
    </div>
  );
};
