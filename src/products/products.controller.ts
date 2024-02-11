import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productsService.create(createProductDto, user);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    return await this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return await this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.remove(id);
  }
}
