import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BooksService } from 'src/books/services/books/books.service';
import { CreateBooksDto, UpdateBooksDto } from '../../dto/books.dto';

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

  @Patch('/:id')
  updatePartial(@Param('id') id: string, @Body() payload: UpdateBooksDto) {
    console.log(payload);
    console.log(id);
    return this.booksService.updatePartial(id, payload);
  }
  @Put('/:id')
  update(@Param('id') id: string, @Body() payload: Partial<CreateBooksDto>) {
    console.log(payload);
    console.log('entro por donde no era');
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

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.booksService.delete(id);
  }

  @Get('/author/:authorName')
  findBooksByAuthor(@Param('authorName') authorName: string) {
    return this.booksService.searchAuthors(authorName);
  }

  @Get('/photo/:id')
  findBookPhoto(@Param('id') id: string) {
    return this.booksService.getPhoto(id);
  }

  @Post('/recommendations')
  recommendBooks(@Body() payload: CreateBooksDto[]) {
    return this.booksService.recommendBooks(payload);
  }
}
