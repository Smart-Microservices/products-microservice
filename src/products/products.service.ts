import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalRecords = await this.prisma.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalRecords / limit!);

    const options = {
      take: limit,
      skip: (page! - 1) * limit!,
      where: { available: true },
    };

    if (page! > lastPage) {
      throw new NotFoundException(
        `La página ${page} excede la última página ${lastPage}`,
      );
    }

    return {
      data: await this.prisma.product.findMany({
        ...options,
        orderBy: { id: 'asc' },
      }),
      metadata: {
        total: totalRecords,
        pageCurrent: page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id, available: true },
    });
    if (!product) {
      throw new NotFoundException(`Producto con id #${id} no encontrado`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    void __; // Ignorar el id en el DTO

    await this.findOne(id);

    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException(
        `No se proporcionaron datos para actualizar el producto con id #${id}`,
      );
    }

    const product = await this.prisma.product.update({
      where: { id },
      data,
    });

    return product;
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: { available: false } as UpdateProductDto,
    });

    return product;
  }
}
