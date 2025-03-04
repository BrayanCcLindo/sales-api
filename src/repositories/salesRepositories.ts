import sql from 'mssql';
import { dbConfig } from '../config/database.js';
import { DetailedSale } from '../types/sales.js';
import { Logger } from '../utils/logger.js';

export class SalesRepository {
  private static instance: SalesRepository;
  private pool: sql.ConnectionPool | null = null;

  private constructor() {}

  public static getInstance(): SalesRepository {
    if (!SalesRepository.instance) {
      SalesRepository.instance = new SalesRepository();
    }
    return SalesRepository.instance;
  }

  private async getConnection(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      try {
        Logger.info('Intentando conectar a la base de datos...');
        this.pool = await sql.connect(dbConfig);
        Logger.success('Conexión a la base de datos establecida con éxito');
      } catch (error) {
        Logger.error('Error al conectar a la base de datos', error);
        throw error;
      }
    }
    return this.pool;
  }

  public async getSalesFromLast30Days(): Promise<DetailedSale[]> {
    try {
      Logger.info('Obteniendo datos de ventas de los últimos 30 días...');
      const pool = await this.getConnection();

      Logger.info('Ejecutando consulta SQL...');
      const result = await pool.request().query(`
        SELECT 
          v.ID AS ID_Venta,
          v.Fecha,
          v.Total,
          vd.ID AS ID_Detalle,
          vd.Cantidad,
          vd.Precio_Unitario,
          vd.TotalLinea,
          p.ID AS ID_Producto,
          p.Nombre AS NombreProducto,
          p.Costo_Unitario,
          l.ID AS ID_Local,
          l.Nombre AS NombreLocal,
          m.ID AS ID_Marca,
          m.Nombre AS NombreMarca
        FROM Venta v
        JOIN VentaDetalle vd ON v.ID = vd.ID_Venta
        JOIN Producto p ON vd.ID_Producto = p.ID
        JOIN Local l ON v.ID_Local = l.ID
        JOIN Marca m ON p.ID_Marca = m.ID
        WHERE v.Fecha >= DATEADD(day, -30, GETDATE())
      `);

      Logger.success(`Consulta completada. Se obtuvieron ${result.recordset.length} registros.`);
      return result.recordset;
    } catch (error) {
      Logger.error('Error al obtener datos de ventas', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch sales data: ${error.message}`);
      }
      throw new Error('An unknown error occurred while fetching sales data');
    }
  }
}
