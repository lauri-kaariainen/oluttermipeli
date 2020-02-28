export const BeerList = ({ beers, onClick }) => {
  const handleClick = (id, evt) => onClick(id);
  return (
    <div class="beerlist">
      {beers.map(beer => (
        <button onClick={handleClick.bind(null, beer.id)}>{beer.name}</button>
      ))}
    </div>
  );
};
