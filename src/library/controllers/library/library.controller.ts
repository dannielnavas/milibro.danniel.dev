import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateLibraryDto } from 'src/library/dto/library.dto';
import { LibraryService } from '../../services/library/library.service';

@Controller('library')
@UseGuards(AuthGuard('jwt'))
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('/:idUser')
  create(@Param('idUser') id: string, @Body() payload: CreateLibraryDto) {
    return this.libraryService.create(payload, id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.libraryService.findOneById(id);
  }
}
