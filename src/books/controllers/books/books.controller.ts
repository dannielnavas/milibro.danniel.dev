import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateBooksDto } from 'src/books/dto/books.dto';
import { BooksService } from 'src/books/services/books/books.service';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() payload: CreateBooksDto) {
    return this.booksService.create(payload);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() payload: Partial<CreateBooksDto>) {
    return this.booksService.update(id, payload);
  }
}
