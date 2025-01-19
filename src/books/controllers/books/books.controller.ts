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
}
