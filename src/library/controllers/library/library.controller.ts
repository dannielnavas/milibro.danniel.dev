import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateLibraryDto } from '../../dto/library.dto';
import { LibraryService } from '../../services/library/library.service';

@Controller('library')
@UseGuards(AuthGuard('jwt'))
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  create(@Body() payload: CreateLibraryDto) {
    return this.libraryService.create(payload);
  }

  @Get('/:idUser/:wishlist')
  findOne(@Param('idUser') id: string, @Param('wishlist') wishlist: boolean) {
    return this.libraryService.findOneByIdUserAndWishlist(id, wishlist);
  }
}
