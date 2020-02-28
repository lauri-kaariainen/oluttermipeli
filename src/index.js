import "./style";
import { render } from "preact";
import { useState } from "preact/compat";
import { BeerItem } from "./components/BeerItem.js";
import { getSeededSampleOfN, shuffle, uniqueShallow } from "./helpers.js";
import { getRealTerms } from "./getTerms.js";
import { BeerList } from "./components/BeerList.js";
import ALLBEERTERMS from "./oluttermit.json";

const GAMESTATES = {
  PRESTART: 0,
  GETBEER: 1,
  GUESSING: 2,
  RESULT: 3
};

//lower is easier
const DIFFICULTYLEVEL = 6;

const possibleSeed = Math.floor(ALLBEERTERMS.length * Math.random());

function App() {
  const [gameState, setGameState] = useState(GAMESTATES.PRESTART);
  const [inputState, setInputState] = useState("");
  const [guessableTermsState, setGuessableTermsState] = useState([]);
  const [searchedBeers, setSearchedBeers] = useState([]);
  const [guessesList, setGuessesList] = useState([]);
  const [correctBeerTerms, setCorrectBeerTerms] = useState([]);
  const [seed, setSeed] = useState(possibleSeed);
  const fakeSample = getSeededSampleOfN(ALLBEERTERMS, DIFFICULTYLEVEL, seed);

  const handleSearchInputChange = ev => {
    if (ev.target.value.length > 2) {
      fetch(
        "//lauri.space/alko-product-api/products/beers?search=" +
          encodeURIComponent(ev.target.value)
      )
        .then(e => e.json())
        // .then(e => console.log(e))
        .then(res =>
          res.data.map(el => ({
            id: el.attributes["product-id"],
            name: el.attributes.name
          }))
        )
        // .then(e => (console.log(e), e))
        .then(e => setSearchedBeers(e));
    }
    setInputState(ev.target.value);
  };

  const handleBeerChoose = id =>
    getRealTerms(id)
      //   .then(res => (console.log("beerchooses", res), res))
      .then(
        res =>
          setCorrectBeerTerms(res.split(",").map(word => word.trim())) ||
          setGuessableTermsState(
            shuffle(
              fakeSample
                .concat(res.split(",").map(word => word.trim()))
                .filter(uniqueShallow)
            ).sort()
          ) ||
          setGameState(GAMESTATES.GUESSING)
      );

  const handleGuessingBeer = term => {
    if (!guessesList.includes(term)) setGuessesList(guessesList.concat(term));
    else setGuessesList(guessesList.filter(guess => guess !== term));
  };

  const getCorrectGuesses = _ =>
    guessesList.filter(guess => correctBeerTerms.includes(guess));

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
        <div class="wrapper">
          <div class="text info">
            Jos haluat pelata muiden kanssa, anna heille siemenluku:{" "}
            <span class="seedcode">{seed}</span>
          </div>

          <div>
            Tai syötä tähän heidän siemenlukunsa:
            <input
              class="seedInput"
              onChange={evt => setSeed(evt.target.value)}
              value={seed}
            />
          </div>
          <button onClick={setGameState.bind(null, GAMESTATES.GETBEER)}>
            Aloita!
          </button>
        </div>
      ) : gameState === GAMESTATES.GETBEER ? (
        <div class="wrapper">
          <div class="text info">Haetaan ensin olut hakusanalla:</div>
          <input
            class=""
            placeholder="Lapin Kulta..."
            onChange={handleSearchInputChange}
            value={inputState}
          />
          <BeerList beers={searchedBeers} onClick={handleBeerChoose} />
        </div>
      ) : gameState === GAMESTATES.GUESSING ? (
        <div class="wrapper">
          <div class="text info">Valitse mitkä termit koskevat tätä olutta</div>
          <div class="list">
            {console.log(guessableTermsState)}
            {guessableTermsState.map(term => (
              <BeerItem
                term={term}
                onClick={handleGuessingBeer}
                isSelected={guessesList.includes(term)}
              />
            ))}
          </div>
          <button
            class="guessingDoneButton green"
            onClick={setGameState.bind(null, GAMESTATES.SHOWINGRESULTS)}
          >
            Lukitsen vastaukset
          </button>
        </div>
      ) : gameState === GAMESTATES.SHOWINGRESULTS ? (
        <div class="wrapper">
          <div class="text info">
            Sait oikein {getCorrectGuesses().length}/
            {correctBeerTerms.length + " "}
            vaihtoehdosta
            {/* {getCorrectGuesses().length
              ? "; " + getCorrectGuesses().join(", ")
              : ""} */}
          </div>
          <div class="text info">
            Vääriä vastauksia oli{" "}
            {guessesList.length - getCorrectGuesses().length + " "} kpl
          </div>
          <div class="text info points">
            Pisteesi ovat{" "}
            {getCorrectGuesses().length -
              (guessesList.length - getCorrectGuesses().length)}
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
