export interface Category {
  _id: string;
  name: string;
  description: string;
  status: boolean;
}

export interface Subcategory {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  category: Category;
}

export interface Image {
  uid: string;
  url: string;
  title: string;
  mimeType: string;
  fileBase64: string;
}

export interface Product {
  uid: string;
  name: string;
  description: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  bulkWholesalePrice: number;
  stock: number;
  technicalData: string;
  subcategory: Subcategory;
  preview: Image;
  status: boolean;
  images: Array<Image>;
  rating: number
  sku: string;
}
