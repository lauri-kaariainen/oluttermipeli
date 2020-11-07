export const SearchedList = ({ items, onClick }) => {
  const handleClick = (id, evt) => onClick(id);
  return (
    <div class="searchedlist">
      {items.map((item) => (
        <button onClick={handleClick.bind(null, item.id)}>{item.name}</button>
      ))}
    </div>
  );
};
