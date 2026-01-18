import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('float', {
    nullable: false,
  })
  price: number;

  @Column('text', {
    nullable: true,
  })
  description?: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column('int2', {
    nullable: false,
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
    nullable: true,
  })
  sizes: string[];

  @Column('text', {
    nullable: false,
  })
  gender: string;

  @Column('text', {
    array: true,
    nullable: false,
    default: [],
  })
  tags: string[];

  @BeforeInsert()
  setSlug() {
    this.slug =
      this.slug ??
      this.title.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }

  @BeforeUpdate()
  updateSlug() {
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
