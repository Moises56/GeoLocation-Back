import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLocationDto } from './dto/create-location.dto';

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @Roles('ADMIN', 'MODERATOR', 'OPERADOR')
  create(@Body() createLocationDto: CreateLocationDto, @Req() req: any) {
    return this.locationsService.create(createLocationDto, req.user.id, req.ip);
  }

  @Get()
  @Roles('ADMIN', 'MODERATOR')
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('latest')
  @Roles('ADMIN', 'MODERATOR')
  getLatestLocations() {
    return this.locationsService.getLatestLocations();
  }

  @Get('my-locations')
  @Roles('ADMIN', 'MODERATOR', 'OPERADOR')
  findMyLocations(@Req() req: any) {
    return this.locationsService.findByUser(req.user.id);
  }

  @Get(':id')
  @Roles('ADMIN', 'MODERATOR')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MODERATOR')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: any,
    @Req() req: any,
  ) {
    return this.locationsService.update(
      id,
      updateLocationDto,
      req.user.id,
      req.ip,
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'MODERATOR')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.locationsService.remove(id, req.user.id, req.ip);
  }
}
