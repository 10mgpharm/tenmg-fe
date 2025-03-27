export interface ShoppingList {
  id: number;
  productName: string;
  brandName: string;
  purchaseDate: string;
  productId: number;
  description: string;
  image: string;
  customer: {
    id: number;
    name: string;
    email: string;
    active: boolean;
    useTwoFactor: string;
    avatar: string;
    emailVerifiedAt: string;
    owner: boolean;
    entityType: string;
    role: string;
    businessName: string;
    businessStatus: string;
    completeProfile: true;
  };
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
