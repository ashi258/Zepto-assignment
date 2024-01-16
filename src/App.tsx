import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import items from "./items.json";
import "./App.css"
interface Item {
  name: string;
  image: string;
}



const ChipComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [chips, setChips] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [highlightedChip, setHighlightedChip] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredItems(
      items.filter(
        (item) =>
          !chips.includes(item.name) &&
          item.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, chips]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleItemSelect = (selectedItem: string) => {
    setChips([...chips, selectedItem]);
    setInputValue("");
  };

  const handleChipRemove = (removedChip: string) => {
    setChips(chips.filter((chip) => chip !== removedChip));
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && inputValue === "" && chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      setHighlightedChip(lastChip);
      event.preventDefault();
    }
    if (event.key === "Backspace" && highlightedChip) {
      handleChipRemove(highlightedChip);
      setHighlightedChip(null);
    }
  };

  return (
    <div className="chip-main-container">
      <div className="chip-input-container">
        {chips.map((chip, index) => (
          <div key={index} className={`chip ${highlightedChip === chip ? 'highlighted' : ''}`}>
            <img
              src={items.find((item) => item.name === chip)?.image}
              alt={chip}
              className="chip-avatar"
            />
            {chip}{" "}
            <span
              onClick={() => handleChipRemove(chip)}
              className="chip-remove"
            >
              X
            </span>
          </div>
        ))}

        <div>
          <input
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Type to search..."
          />

          {showSuggestions && inputValue.length < 1 && (
            <div className="item-list">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemSelect(item.name)}
                  className="item"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-avatar"
                  />
                  {item.name}
                </div>
              ))}
            </div>
          )}
          {inputValue.length > 0 && (
            <div className="item-list">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemSelect(item.name)}
                  className="item"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-avatar"
                  />
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChipComponent;
