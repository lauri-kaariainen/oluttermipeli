import { Term } from "../Term.js";

export const Guessing = ({
  guessableTermsState,
  handleGuessingDrink,
  guessesList,
  // setGameState,
  // GAMESTATES,
  correctGuesses,
  correctDrinkTerms
}) => (
  <div class="wrapper">
    {correctGuesses.length < correctDrinkTerms.length ? (
      [
        <div class="text info">Valitse mielestäsi oikeat termit</div>,
        <div class="list">
          {guessableTermsState.map((term) => (
            <Term
              key={term}
              term={term}
              onClick={handleGuessingDrink}
              // isGuessed={false}
              // isCorrectlyGuessed={false}
              // isCorrectlyGuessed={correctGuesses.includes(term)}
              isCorrect={correctDrinkTerms.includes(term)}
            />
          ))}
        </div>
      ]
    ) : (
      <span></span>
    )}
    <hr />
    <div class="flexSpaceBetween">
      <span>
        Arvattu oikein
        <br />
        <span class="bold">{correctGuesses.length}</span>/
        <span class="bold">{correctDrinkTerms.length}</span>
      </span>
      <span class="right">
        Arvattu väärin
        {/* {console.log(
          guessableTermsState,
          correctDrinkTerms,
          guessableTermsState.includes((e) => !correctDrinkTerms.includes(e))
        )} */}
        <br />
        <span class="bold">{guessesList.length - correctGuesses.length}</span>/
        <span class="bold">
          {guessableTermsState.length +
            guessesList.length -
            correctDrinkTerms.length}
        </span>
      </span>
    </div>
    <div>
      {guessesList.map((term) => (
        <Term
          key={term}
          term={term}
          // onClick={handleGuessingDrink}
          // isGuessed={guessesList.includes(term)}
          initialShowResult={true}
          // isCorrectlyGuessed={correctGuesses.includes(term)}
          isCorrect={correctDrinkTerms.includes(term)}
        />
      ))}
    </div>
    <hr />
  </div>
);
