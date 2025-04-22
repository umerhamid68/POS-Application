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

export interface ProductCategory {
  id: string;
  name?: string;
  ordinal?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categories?: ProductCategory[];
  selectedVariation?: SelectedVariation;
  selectedModifiers?: SelectedModifier[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}