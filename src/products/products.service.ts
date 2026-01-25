import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { responseConfig } from '../common/global/response.config';
import { isUUID } from 'class-validator';
import { ProductImages } from './entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    // REPOSITORY PATTERN
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImages)
    private readonly productImagesRepository: Repository<ProductImages>,

    private readonly dataSource: DataSource,

    private readonly configService: ConfigService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImagesRepository.create({ url: image }),
        ),
      });
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
        relations: {
          images: true,
        },
      });

      const transformedProducts = this.flatImages(products);

      return responseConfig({
        products: transformedProducts,
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product | null;

    if (isUUID(term)) {
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
        relations: {
          images: true,
        },
      });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('product.title = :term OR product.slug = :term', { term })
        .leftJoin('product.images', 'productImages')
        .select([
          'product.product_id',
          'product.title',
          'product.description',
          'product.price',
          'product.stock',
          'product.slug',
          'product.tags',
          'productImages',
        ])
        .getOne();
    }

    if (!product) {
      throw new NotFoundException('The product does not exist');
    }

    const transformedProduct = this.flatImages(product);
    if (Array.isArray(transformedProduct)) {
      throw new InternalServerErrorException();
    }

    return responseConfig({ product: transformedProduct });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...data } = updateProductDto;

    const product = await this.productRepository.preload({
      product_id: id,
      ...data,
    });

    if (!product) {
      throw new NotFoundException('The product does not exist');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImages, { product: id });

        product.images = images.map((image) =>
          this.productImagesRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      // await this.productRepository.save(product);
      return responseConfig(
        { id: product.product_id },
        'Product updated successfully',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
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

  private flatImages(products: Product[] | Product) {
    if (Array.isArray(products)) {
      return products.map((product) => ({
        ...product,
        images: product.images?.map((image) => image.url),
      }));
    }
    if (products instanceof Product) {
      return {
        ...products,
        images: products.images?.map((image) => image.url),
      };
    }
    throw new InternalServerErrorException();
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

  async deleteAllProducts() {
    if (this.configService.get<string>('environment') === 'prod') {
      throw new UnauthorizedException(
        'This action cannot be executed in production environment',
      );
    }

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    try {
      await queryBuilder.delete().where({}).execute();
      return true;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
