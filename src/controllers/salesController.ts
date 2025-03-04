import { Request, Response } from 'express';
import { SalesService } from '../services/salesService.js';
import { Logger } from '../utils/logger.js';

export class SalesController {
  private salesService: SalesService;

  constructor() {
    this.salesService = new SalesService();
  }

  public analyze = async (_req: Request, res: Response): Promise<void> => {
    try {
      Logger.info('Recibida solicitud de análisis de ventas');
      const analysis = await this.salesService.analyzeSales();

      console.log('\n===== SALES ANALYSIS RESULTS =====');
      console.log('\n1. Total sales for the last 30 days:');
      console.log(`   Total amount: $${analysis.totalSales.toFixed(2)}`);
      console.log(`   Total number of sales: ${analysis.totalSalesCount}`);

      console.log('\n2. Day and time of the highest sale:');
      console.log(`   Date: ${analysis.highestSale.date}`);
      console.log(`   Amount: $${analysis.highestSale.amount.toFixed(2)}`);

      console.log('\n3. Product with highest total sales:');
      console.log(`   Product: ${analysis.topProduct.name}`);
      console.log(`   Total sales: $${analysis.topProduct.totalSales.toFixed(2)}`);

      console.log('\n4. Store with highest total sales:');
      console.log(`   Store: ${analysis.topStore.name}`);
      console.log(`   Total sales: $${analysis.topStore.totalSales.toFixed(2)}`);

      console.log('\n5. Brand with highest profit margin:');
      console.log(`   Brand: ${analysis.topBrand.name}`);
      console.log(`   Profit margin: $${analysis.topBrand.profitMargin.toFixed(2)}`);

      console.log('\n6. Top selling product by store:');
      analysis.topProductByStore.forEach((item) => {
        console.log(`   Store: ${item.storeName}`);
        console.log(`   Product: ${item.productName}`);
        console.log(`   Units sold: ${item.unitsSold}`);
        console.log('');
      });

      Logger.success('Análisis enviado con éxito');
      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      Logger.error('Error en el análisis de ventas', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };
}
