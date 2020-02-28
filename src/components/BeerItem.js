export const BeerItem = ({ term, onClick, isSelected }) => {
  return (
    <div class={"result " + (isSelected ? "selected" : "")}>
      <div>
        <button onClick={onClick.bind(null, term)}>{term}</button>
        🌟
      </div>
    </div>
  );
};
