import { IsIn } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column('text', {
    nullable: false,
  })
  name: string;

  @Column('text', {
    nullable: false,
  })
  lastName: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('text', {
    nullable: false,
  })
  password: string;

  @Column('boolean', {
    nullable: false,
    default: true,
  })
  is_active: boolean;

  @IsIn(['user', 'admin', 'superuser'])
  @Column('text', {
    array: true,
    nullable: false,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products?: Product[];

  @BeforeInsert()
  trimEmail() {
    this.email = this.email.toLowerCase().trim();
  }
}
