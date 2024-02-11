import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bycript from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProduct(adminUser);
    return 'Seed ran successfully';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queyBuilder = this.userRepository.createQueryBuilder();
    await queyBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      user.password = bycript.hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }

  private async insertNewProduct(user: User) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
