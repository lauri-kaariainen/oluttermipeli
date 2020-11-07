import "./style";
import { render } from "preact";
import { useState } from "preact/hooks";
// import { BeerItem } from "./components/BeerItem.js";
import { getSeededSampleOfN, shuffle, uniqueShallow } from "./helpers.js";
import { getRealTerms } from "./getTerms.js";
// import { BeerList } from "./components/BeerList.js";
import { PreStart } from "./components/gamestates/PreStart.js";
import { GetDrink } from "./components/gamestates/GetDrink.js";
import { Guessing } from "./components/gamestates/Guessing.js";

import ALLBEERTERMS from "./oluttermit.json";

const GAMESTATES = {
  PRESTART: 0,
  GETBEER: 1,
  GUESSING: 2
};

//lower is easier
const DIFFICULTYLEVEL = 6;

const possibleSeed = Math.floor(ALLBEERTERMS.length * Math.random());

// "//lauri.space/alko-product-api/products/beers?search="
function App() {
  const [gameState, setGameState] = useState(GAMESTATES.PRESTART);
  const [inputState, setInputState] = useState("");
  const [guessableTermsState, setGuessableTermsState] = useState([]);
  const [searchedDrinks, setSearchedDrinks] = useState([]);
  const [guessesList, setGuessesList] = useState([]);
  const [correctDrinkTerms, setCorrectDrinkTerms] = useState([]);
  const [seed, setSeed] = useState(possibleSeed);
  const [numOfRepeats, setNumOfRepeats] = useState(0);
  const [selectedDrinkName, setSelectedDrinkName] = useState("");

  const getFakeSample = (type) =>
    getSeededSampleOfN(ALLBEERTERMS, DIFFICULTYLEVEL, seed);

  const handleInputChange = (ev) => {
    if (ev.target.value.length > 2) {
      fetch(
        "//lauri.space/alko-product-api/products/beers?search=" +
          encodeURIComponent(ev.target.value)
      )
        .then((e) => e.json())
        .then((res) =>
          res.data.map((el) => ({
            id: el.attributes["product-id"],
            name: el.attributes.name
          }))
        )
        .then((e) => setSearchedDrinks(e));
    }
    setInputState(ev.target.value);
  };

  const handleDrinkChoose = (id) =>
    getRealTerms(id)
      // .then(res => (console.log("drinkchooses", res), res))
      .then(
        (res) =>
          setSelectedDrinkName(res.name) ||
          setCorrectDrinkTerms(
            res.terms.split(",").map((word) => word.trim())
          ) ||
          setGuessableTermsState(
            shuffle(
              getFakeSample(res.type)
                .concat(res.terms.split(",").map((word) => word.trim()))
                .filter(uniqueShallow)
            ).sort()
          ) ||
          setGameState(GAMESTATES.GUESSING)
      );

  const handleGuessingDrink = (guess) => {
    setGuessableTermsState(
      guessableTermsState.filter((term) => term !== guess)
    );
    setGuessesList(guessesList.concat(guess));
  };

  const getCorrectGuesses = (_) =>
    guessesList.filter((guess) => correctDrinkTerms.includes(guess));

  const restartFromScratch = (_) => window.location.reload();

  return (
    <div>
      <h1>
        Olutpeli{" "}
        <span role="img" aria-label="beer glass">
          🍺
        </span>
        <span
          class="right seedcode"
          title="share this number if playing with friends"
        >
          {" "}
          {seed}
        </span>
      </h1>
      {gameState === GAMESTATES.PRESTART ? (
        <PreStart
          seed={seed}
          setSeed={setSeed}
          setGameState={setGameState}
          GAMESTATES={GAMESTATES}
        />
      ) : gameState === GAMESTATES.GETDRINK ? (
        <GetDrink
          handleInputChange={handleInputChange}
          inputState={inputState}
          searchedDrinks={searchedDrinks}
          handleDrinkChoose={handleDrinkChoose}
        />
      ) : gameState === GAMESTATES.GUESSING ? (
        [
          <span class="bold">{selectedDrinkName}</span>,
          <br />,
          <span>
            {correctDrinkTerms.every((e) => guessesList.includes(e)) ? (
              [
                <span>Arvasit kaikki oikein!</span>,
                <button onClick={restartFromScratch}>
                  Aloita uuden oluen kanssa
                </button>
              ]
            ) : (
              <span></span>
            )}
          </span>,
          <Guessing
            guessableTermsState={guessableTermsState}
            handleGuessingDrink={handleGuessingDrink}
            correctGuesses={getCorrectGuesses()}
            guessesList={guessesList}
            setGameState={setGameState}
            GAMESTATES={GAMESTATES}
            correctDrinkTerms={correctDrinkTerms}
          />
        ]
      ) : (
        <div />
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
