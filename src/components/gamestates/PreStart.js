export const PreStart = ({ seed, setSeed, setGameState, GAMESTATES }) => {
  return (
    <div class="wrapper">
      <div class="text info">
        Jos haluat pelata muiden kanssa, anna heille siemenluku{" "}
        <span class="seedcode bold">{seed}</span>, jotta saatte samat arvaukset
      </div>

      <div>
        Tai syötä tähän heidän siemenlukunsa:
        <input
          class="seedInput"
          oninput={(evt) => setSeed(evt.target.value)}
          value={seed}
        />
      </div>
      <button onClick={setGameState.bind(null, GAMESTATES.GETDRINK)}>
        Aloita!
      </button>
    </div>
  );
};
