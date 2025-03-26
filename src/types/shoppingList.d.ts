export interface ShoppingList {
  id: number;
  productName: string;
  brandName: string;
  purchaseDate: string;
  productId: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListData {
  data: ShoppingList[];
  links: any;
  meta?: MetaDataProp;
  prevPageUrl?: string | null;
  nextPageUrl?: string | null;
  currentPage?: number;
  firstPageUrl?: any;
  lastPageUrl?: any;
}
