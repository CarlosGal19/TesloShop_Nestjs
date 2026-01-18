import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { responseConfig } from '../common/global/response.config';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    // REPOSITORY PATTERN
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      const dataToReturn = {
        id: product.product_id,
      };
      return responseConfig({ ...dataToReturn }, 'Product added successfully');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(limit: number = 15, offset: number = 0) {
    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        select: {
          product_id: true,
          title: true,
          description: true,
          price: true,
          stock: true,
          slug: true,
          tags: true,
        },
      });

      return responseConfig({ products, take: limit, skip: offset });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product | null;

    if (isUUID(term)) {
      console.log('id');
      product = await this.productRepository.findOne({
        where: { product_id: term },
        select: [
          'product_id',
          'title',
          'description',
          'price',
          'stock',
          'slug',
          'tags',
        ],
      });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('product.title = :term OR product.slug = :term', { term })
        .select([
          'product.product_id',
          'product.title',
          'product.description',
          'product.price',
          'product.stock',
          'product.slug',
          'product.tags',
        ])
        .getOne();
    }

    if (!product) {
      throw new NotFoundException('The product does not exist');
    }

    return responseConfig({ product });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      product_id: id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException('The product does not exist');
    }

    try {
      await this.productRepository.save(product);
      return responseConfig(
        { id: product.product_id },
        'Product updated successfully',
      );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const product = (await this.findOne(id)).data.product;

    if (!product) {
      throw new NotFoundException('The product does not exist');
    }

    const productId = product.product_id;

    try {
      await this.productRepository.delete({
        product_id: productId,
      });

      return responseConfig({ id }, 'Product deleted successfully');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.detail,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23502') {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.detail,
      );
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error: check server logs',
    );
  }
}
