import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createLocationDto: CreateLocationDto,
    userId: string,
    ip: string,
  ) {
    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Crear la ubicación
    const location = await this.prisma.location.create({
      data: {
        ...createLocationDto,
        userId,
        estado: createLocationDto.estado || 'activo',
        timestamp: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            nombreUsuario: true,
          },
        },
      },
    });

    // Crear log de la acción
    await this.prisma.log.create({
      data: {
        userId,
        accion: 'CREATE_LOCATION',
        ip,
        descripcion: `Usuario ${user.nombreUsuario} creó una nueva ubicación en lat: ${createLocationDto.latitud}, lon: ${createLocationDto.longitud}`,
      },
    });

    return location;
  }

  async findAll() {
    return this.prisma.location.findMany({
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            nombreUsuario: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.location.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            nombreUsuario: true,
          },
        },
      },
    });
  }

  async update(id: string, updateLocationDto: any, userId: string, ip: string) {
    const location = await this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            nombreUsuario: true,
          },
        },
      },
    });

    await this.prisma.log.create({
      data: {
        userId,
        accion: 'UPDATE_LOCATION',
        ip,
        descripcion: `Ubicación ${id} actualizada. Nuevo estado: ${updateLocationDto.estado || 'sin cambios'}`,
      },
    });

    return location;
  }

  async remove(id: string, userId: string, ip: string) {
    const location = await this.prisma.location.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            nombreUsuario: true,
          },
        },
      },
    });

    await this.prisma.log.create({
      data: {
        userId,
        accion: 'DELETE_LOCATION',
        ip,
        descripcion: `Ubicación ${id} eliminada`,
      },
    });

    return location;
  }

  async findByUser(userId: string) {
    return this.prisma.location.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            nombreUsuario: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getLatestLocations() {
    return this.prisma.location.findMany({
      where: {
        estado: 'activo',
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            nombreUsuario: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async getSummary(userId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Obtener el total de ubicaciones del usuario
      const totalUbicaciones = await this.prisma.location.count({
        where: { userId }
      });

      // Obtener las ubicaciones de hoy
      const ubicacionesHoy = await this.prisma.location.count({
        where: {
          userId,
          timestamp: {
            gte: today
          }
        }
      });

      // Obtener la última ubicación
      const ultimaUbicacion = await this.prisma.location.findFirst({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              nombreUsuario: true,
            },
          },
        },
      });

      // Asegurarnos de que siempre devolvemos un objeto, incluso si no hay última ubicación
      return {
        totalUbicaciones: totalUbicaciones || 0,
        ubicacionesHoy: ubicacionesHoy || 0,
        ultimaUbicacion: ultimaUbicacion || null
      };
    } catch (error) {
      console.error('Error en getSummary:', error);
      // Devolver un objeto con valores por defecto en caso de error
      return {
        totalUbicaciones: 0,
        ubicacionesHoy: 0,
        ultimaUbicacion: null,
        error: 'Error al obtener el resumen'
      };
    }
  }
}
