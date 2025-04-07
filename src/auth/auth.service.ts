import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { nombreUsuario: username },
    });

    if (user && (await bcrypt.compare(password, user.contrasena))) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.nombreUsuario,
      sub: user.id,
      rol: user.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        nombreUsuario: user.nombreUsuario,
        rol: user.rol,
        estado: user.estado,
      },
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        contrasena: hashedPassword,
      },
    });
    const { contrasena, ...result } = user;
    return result;
  }
}
