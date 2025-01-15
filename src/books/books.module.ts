import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryModule } from 'src/library/library.module';
import { BooksController } from './controllers/books/books.controller';
import { Books, BooksSchema } from './entities/books.entity';
import { BooksService } from './services/books/books.service';

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports: [
    LibraryModule,
    MongooseModule.forFeature([
      {
        name: Books.name,
        schema: BooksSchema,
      },
    ]),
  ],
  exports: [BooksService],
})
export class BooksModule {}
