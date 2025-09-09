// users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Get all users
  async getAllUsersService() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        shortUrl: {
          select: {
            id: true,
            shortId: true,
            redirectUrl: true,
          },
        },
      },
    });
  }

  // Get user by ID
  async getUserDetailsById(userId: number) {
    return this.prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        shortUrl: {
          select: {
            id: true,
            shortId: true,
            redirectUrl: true,
          },
        },
      },
    });
  }
}
