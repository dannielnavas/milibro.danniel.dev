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
import { BooksService } from 'src/books/services/books/books.service';
import { CreateBooksDto } from '../../dto/books.dto';

@Controller('books')
@UseGuards(AuthGuard('jwt'))
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() payload: CreateBooksDto) {
    return this.booksService.create(payload);
  }

  @Get('/:idLibrary')
  findOne(@Param('idLibrary') id: string) {
    return this.booksService.findOneByIdLibrary(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() payload: Partial<CreateBooksDto>) {
    return this.booksService.update(id, payload);
  }

  @Get('/search/:isbn')
  searchBookByIsbn(@Param('isbn') isbn: string) {
    console.log(isbn);
    return this.booksService.searchBookByIsbn(isbn);
  }

  @Get('/search-title/:title')
  searchBookByTitle(@Param('title') title: string) {
    return this.booksService.searchBookByTitle(title);
  }
}
