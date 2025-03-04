import { SalesRepository } from '../repositories/salesRepositories.js';
import { DetailedSale, SalesAnalysis } from '../types/sales.js';
import { Logger } from '../utils/logger.js';

export class SalesService {
  private salesRepository: SalesRepository;

  constructor() {
    this.salesRepository = SalesRepository.getInstance();
  }

  public async analyzeSales(): Promise<SalesAnalysis> {
    Logger.info('Iniciando análisis de ventas...');
    const salesData = await this.salesRepository.getSalesFromLast30Days();

    Logger.info('Procesando datos de ventas...');
    const totalSales = this.calculateTotalSales(salesData);
    const totalSalesCount = this.calculateTotalSalesCount(salesData);
    const highestSale = this.findHighestSale(salesData);
    const topProduct = this.findTopProduct(salesData);
    const topStore = this.findTopStore(salesData);
    const topBrand = this.findTopBrand(salesData);
    const topProductByStore = this.findTopProductByStore(salesData);

    Logger.success('Análisis de ventas completado con éxito');
    return {
      totalSales,
      totalSalesCount,
      highestSale,
      topProduct,
      topStore,
      topBrand,
      topProductByStore
    };
  }

  private calculateTotalSales(salesData: DetailedSale[]): number {
    return salesData.reduce((sum, sale) => sum + sale.TotalLinea, 0);
  }

  private calculateTotalSalesCount(salesData: DetailedSale[]): number {
    return new Set(salesData.map((sale) => sale.ID_Venta)).size;
  }

  private findHighestSale(salesData: DetailedSale[]): { date: Date; amount: number } {
    const salesByInvoice = salesData.reduce(
      (acc, sale) => {
        if (!acc[sale.ID_Venta]) {
          acc[sale.ID_Venta] = {
            date: sale.Fecha,
            amount: 0
          };
        }
        acc[sale.ID_Venta].amount += sale.TotalLinea;
        return acc;
      },
      {} as Record<number, { date: Date; amount: number }>
    );

    return Object.values(salesByInvoice).reduce(
      (highest, current) => (current.amount > highest.amount ? current : highest),
      { date: new Date(), amount: 0 }
    );
  }

  private findTopProduct(salesData: DetailedSale[]): {
    id: number;
    name: string;
    totalSales: number;
  } {
    const productSales = salesData.reduce(
      (acc, sale) => {
        if (!acc[sale.ID_Producto]) {
          acc[sale.ID_Producto] = {
            id: sale.ID_Producto,
            name: sale.NombreProducto,
            totalSales: 0
          };
        }
        acc[sale.ID_Producto].totalSales += sale.TotalLinea;
        return acc;
      },
      {} as Record<number, { id: number; name: string; totalSales: number }>
    );

    return Object.values(productSales).reduce(
      (top, current) => (current.totalSales > top.totalSales ? current : top),
      { id: 0, name: '', totalSales: 0 }
    );
  }

  private findTopStore(salesData: DetailedSale[]): {
    id: number;
    name: string;
    totalSales: number;
  } {
    const storeSales = salesData.reduce(
      (acc, sale) => {
        if (!acc[sale.ID_Local]) {
          acc[sale.ID_Local] = {
            id: sale.ID_Local,
            name: sale.NombreLocal,
            totalSales: 0
          };
        }
        acc[sale.ID_Local].totalSales += sale.TotalLinea;
        return acc;
      },
      {} as Record<number, { id: number; name: string; totalSales: number }>
    );

    return Object.values(storeSales).reduce(
      (top, current) => (current.totalSales > top.totalSales ? current : top),
      { id: 0, name: '', totalSales: 0 }
    );
  }

  private findTopBrand(salesData: DetailedSale[]): {
    id: number;
    name: string;
    profitMargin: number;
  } {
    const brandProfits = salesData.reduce(
      (acc, sale) => {
        if (!acc[sale.ID_Marca]) {
          acc[sale.ID_Marca] = {
            id: sale.ID_Marca,
            name: sale.NombreMarca,
            revenue: 0,
            cost: 0
          };
        }
        acc[sale.ID_Marca].revenue += sale.Cantidad * sale.Precio_Unitario;
        acc[sale.ID_Marca].cost += sale.Cantidad * sale.Costo_Unitario;
        return acc;
      },
      {} as Record<number, { id: number; name: string; revenue: number; cost: number }>
    );

    const brandsWithMargins = Object.values(brandProfits).map((brand) => ({
      id: brand.id,
      name: brand.name,
      profitMargin: brand.revenue - brand.cost
    }));

    return brandsWithMargins.reduce(
      (top, current) => (current.profitMargin > top.profitMargin ? current : top),
      { id: 0, name: '', profitMargin: 0 }
    );
  }

  private findTopProductByStore(salesData: DetailedSale[]): Array<{
    storeId: number;
    storeName: string;
    productId: number;
    productName: string;
    unitsSold: number;
  }> {
    const salesByStoreAndProduct = salesData.reduce(
      (acc, sale) => {
        const key = `${sale.ID_Local}-${sale.ID_Producto}`;
        if (!acc[key]) {
          acc[key] = {
            storeId: sale.ID_Local,
            storeName: sale.NombreLocal,
            productId: sale.ID_Producto,
            productName: sale.NombreProducto,
            unitsSold: 0
          };
        }
        acc[key].unitsSold += sale.Cantidad;
        return acc;
      },
      {} as Record<
        string,
        {
          storeId: number;
          storeName: string;
          productId: number;
          productName: string;
          unitsSold: number;
        }
      >
    );

    const storeGroups = Object.values(salesByStoreAndProduct).reduce(
      (acc, item) => {
        if (!acc[item.storeId]) {
          acc[item.storeId] = [];
        }
        acc[item.storeId].push(item);
        return acc;
      },
      {} as Record<
        number,
        Array<{
          storeId: number;
          storeName: string;
          productId: number;
          productName: string;
          unitsSold: number;
        }>
      >
    );

    return Object.values(storeGroups).map((products) =>
      products.reduce((top, current) => (current.unitsSold > top.unitsSold ? current : top))
    );
  }
}
