import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { responseConfig } from '../common/global/response.config';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');
  constructor(private readonly productsService: ProductsService) {}
  async runSeed() {
    try {
      await this.productsService.deleteAllProducts();

      const SEED_PRODUCTS = initialData.products;

      const insertPromises: any[] = [];

      SEED_PRODUCTS.forEach((product) => {
        insertPromises.push(this.productsService.create(product));
      });

      await Promise.all(insertPromises);

      return responseConfig({}, 'Seed executed successfully');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
