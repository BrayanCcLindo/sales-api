export interface Sale {
  ID_Venta: number;
  Fecha: Date;
  Total: number;
}

export interface SaleDetail {
  ID_Detalle: number;
  ID_Venta: number;
  Cantidad: number;
  Precio_Unitario: number;
  TotalLinea: number;
}

export interface Product {
  ID: number;
  Nombre: string;
  Costo_Unitario: number;
  ID_Marca: number;
}

export interface Store {
  ID: number;
  Nombre: string;
}

export interface Brand {
  ID: number;
  Nombre: string;
}

export interface SalesAnalysis {
  totalSales: number;
  totalSalesCount: number;
  highestSale: {
    date: Date;
    amount: number;
  };
  topProduct: {
    id: number;
    name: string;
    totalSales: number;
  };
  topStore: {
    id: number;
    name: string;
    totalSales: number;
  };
  topBrand: {
    id: number;
    name: string;
    profitMargin: number;
  };
  topProductByStore: Array<{
    storeId: number;
    storeName: string;
    productId: number;
    productName: string;
    unitsSold: number;
  }>;
}

export interface DetailedSale {
  ID_Venta: number;
  Fecha: Date;
  Total: number;
  ID_Detalle: number;
  Cantidad: number;
  Precio_Unitario: number;
  TotalLinea: number;
  ID_Producto: number;
  NombreProducto: string;
  Costo_Unitario: number;
  ID_Local: number;
  NombreLocal: string;
  ID_Marca: number;
  NombreMarca: string;
}
