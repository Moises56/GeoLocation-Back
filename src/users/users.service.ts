import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterUsersDto } from './dto/filter-users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: any) {
    try {
      const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
      return await this.prisma.user.create({
        data: {
          ...userData,
          contrasena: hashedPassword,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe un usuario con ese ${error.meta.target[0]}`,
        );
      }
      throw error;
    }
  }

  async findAll(pagination: PaginationDto, filters: FilterUsersDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.nombre && {
        nombre: { contains: filters.nombre },
      }),
      ...(filters.nombreUsuario && {
        nombreUsuario: { contains: filters.nombreUsuario },
      }),
      ...(filters.telefono && {
        telefono: { contains: filters.telefono },
      }),
      ...(filters.rol && {
        rol: filters.rol,
      }),
      ...(filters.estado !== undefined && {
        estado: filters.estado,
      }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async update(id: string, userData: any, currentUser: any) {
    try {
      if (userData.contrasena) {
        userData.contrasena = await bcrypt.hash(userData.contrasena, 10);
      }

      return await this.prisma.user.update({
        where: { id },
        data: userData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe un usuario con ese ${error.meta.target[0]}`,
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw error;
    }
  }
} 