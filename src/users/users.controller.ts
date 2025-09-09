import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Example: Get all users (optional)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsersService();
  }

  // Get user by ID
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @Get('/:userId')
  getUserById(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getUserDetailsById(userId);
  }
}
