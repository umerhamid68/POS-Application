export interface SelectedVariation {
  id: string;
  name: string;
  price: number;
}

export interface SelectedModifier {
  id: string;
  name: string;
  price: number;
  listId: string;
  listName: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedVariation?: SelectedVariation;
  selectedModifiers?: SelectedModifier[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}