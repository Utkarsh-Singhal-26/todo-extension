import { Dispatch, DragEvent, SetStateAction } from "react";

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
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

interface CardProps extends CardType {
  handleDragStart: (e: DragEvent<HTMLDivElement>, card: CardType) => void;
}

interface DropIndicatorProps {
  beforeId: string;
  column: string;
}

interface BurnBarrelProps {
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

interface AddCardProps {
  column: string;
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

export type {
  CardType,
  ColumnProps,
  CardProps,
  DropIndicatorProps,
  BurnBarrelProps,
  AddCardProps,
};
