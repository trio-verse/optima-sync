interface FilterItemProps {
  title: string; 
  value: string; 
  name: string;
  selectedValue: string; 
  onSelect: (value: string) => void;
}
const FilterItem = (props: FilterItemProps) => {
  const isChecked = props.selectedValue === props.value;
  return (
    <div className="bg-gray-200  w-full rounded-xl text-center cursor-pointer hover:bg-gray-300">
      <label htmlFor={props.title} className="block  w-full  cursor-pointer ">
        <input
          id={props.title}
          type="radio"
          name={props.name}
          className="peer hidden "
          value={props.title}
          checked={isChecked} 
          onChange={() => props.onSelect(props.value)}
        />
        <span className="block w-full h-full rounded-xl transition-colors peer-checked:bg-blue-600 peer-checked:text-white  p-4 py-2">
          {props.title}
        </span>
      </label>
    </div>
  );
};

export default FilterItem;
