import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { LibraryController } from './controllers/library/library.controller';
import { Library, LibrarySchema } from './entities/library.entity';
import { LibraryService } from './services/library/library.service';

@Module({
  providers: [LibraryService],
  controllers: [LibraryController],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Library.name,
        schema: LibrarySchema,
      },
    ]),
  ],
  exports: [LibraryService],
})
export class LibraryModule {}
