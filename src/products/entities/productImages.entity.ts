import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImages {
  @PrimaryGeneratedColumn('uuid')
  product_image_id: string;

  @Column('text', {
    nullable: false,
  })
  url: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
