import { useState, DragEvent, FormEvent } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { motion } from "framer-motion";

import "./App.css";
import type {
  AddCardProps,
  BurnBarrelProps,
  CardProps,
  CardType,
  ColumnProps,
  DropIndicatorProps,
} from "./utils/interfaces";
// import { sendMessageToExtension } from "./utils/storage";
// import { getStorage, setStorage } from "./utils/storage";

const App = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  // const [hasChecked, setHasChecked] = useState<boolean>(false);

  // useEffect(() => {
  //   if (hasChecked) {
  //     setStorage("cards", cards).catch((error) => console.error(error));
  //   }
  // }, [cards, hasChecked]);

  // useEffect(() => {
  //   getStorage("cards")
  //     .then((cardData) => {
  //       setCards(cardData ? cardData : []);
  //       setHasChecked(true);
  //     })
  //     .catch((error) => console.error(error));
  // }, []);

  // useEffect(() => {
  //   sendMessageToExtension({ type: "GET_STORAGE", key: "cards" })
  //     .then((response) => {
  //       setCards(response || []);
  //       setHasChecked(true);
  //     })
  //     .catch((error) => console.error(error));
  // }, []);

  // useEffect(() => {
  //   if (hasChecked) {
  //     sendMessageToExtension({
  //       type: "SET_STORAGE",
  //       key: "cards",
  //       data: cards,
  //     }).catch((error) => console.error(error));
  //   }
  // }, [cards, hasChecked]);

  return (
    <div className="flex h-full w-full gap-3 p-12">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      />

      <BurnBarrel setCards={setCards} />

      {JSON.stringify(chrome, null, 2)}
      <br />
      <h1>chrome.runtime</h1>
      {JSON.stringify(chrome.runtime, null, 2)}
    </div>
  );
};

const Column = ({
  title,
  headingColor,
  column,
  cards,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState<boolean>(false);
  const filteredCards = cards.filter((c) => c.column === column);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setActive(false);
    clearHighlights();

    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);
      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const highlightIndicator = (e: DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`)
    ) as HTMLElement[];
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getNearestIndicator = (
    e: DragEvent<HTMLDivElement>,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} handleDragStart={handleDragStart} {...c} />;
        })}
        <DropIndicator beforeId="-1" column={column} />

        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, {
            title,
            id,
            column,
          })
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }: BurnBarrelProps) => {
  const [active, setActive] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard: CardType = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };
    setCards((prev) => [...prev, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

export default App;
