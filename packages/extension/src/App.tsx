import { useEffect, useState } from "react";

import "./App.css";

interface CardType {
  id: string;
  title: string;
  column: string;
}

interface ColumnProps {
  title: string;
  headingColor: string;
  column: string;
  cards: CardType[];
}

const App = () => {
  const [cards, setCards] = useState<CardType[]>([
    { id: "1", title: "First card", column: "backlog" },
    { id: "2", title: "Second card", column: "todo" },
    { id: "3", title: "Third card", column: "doing" },
  ]);

  useEffect(() => {
    const getStorage = (key: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[key]);
          }
        });
      });
    };

    getStorage("cards")
      .then((cardData) => setCards(cardData ? cardData : []))
      .catch(console.error);
  }, [cards]);

  return (
    <div className="h-full max-h-[500px] w-[400px] bg-neutral-900 text-neutral-50 p-4 overflow-y-scroll">
      <Column
        title="Backlog"
        headingColor="text-neutral-500"
        column="backlog"
        cards={cards}
      />
      <Column
        title="ToDo"
        headingColor="text-yello-500"
        column="todo"
        cards={cards}
      />
      <Column
        title="In progress"
        headingColor="text-blue-500"
        column="doing"
        cards={cards}
      />
    </div>
  );
};

const Column = ({ title, headingColor, column, cards }: ColumnProps) => {
  const filteredCards = cards.filter((card) => card.column === column);

  return (
    <div className="shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>

      <div className="w-full">
        {filteredCards.map((card) => (
          <div key={card.id} className="bg-neutral-800 p-2 rounded mb-2">
            {card.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
