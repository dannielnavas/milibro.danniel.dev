import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryController } from './controllers/library/library.controller';
import { Library, LibrarySchema } from './entities/library.entity';
import { LibraryService } from './services/library/library.service';

@Module({
  providers: [LibraryService],
  controllers: [LibraryController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Library.name,
        schema: LibrarySchema,
      },
    ]),
  ],
})
export class LibraryModule {}
