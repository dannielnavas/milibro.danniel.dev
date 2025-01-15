import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateBooksDto } from 'src/books/dto/books.dto';
import { BooksService } from 'src/books/services/books/books.service';

@Controller('books')
@UseGuards(AuthGuard('jwt'))
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('/:idLibrary')
  create(@Param('idLibrary') id: string, @Body() payload: CreateBooksDto) {
    return this.booksService.create(payload, id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOneById(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() payload: Partial<CreateBooksDto>) {
    return this.booksService.update(id, payload);
  }
}
