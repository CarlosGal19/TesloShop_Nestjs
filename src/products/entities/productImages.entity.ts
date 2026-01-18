import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImages {
  @PrimaryGeneratedColumn('uuid')
  product_image_id: string;

  @Column('text', {
    nullable: false,
  })
  url: string;
}
