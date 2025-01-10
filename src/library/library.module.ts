import { Module } from '@nestjs/common';
import { LibraryService } from './services/library/library.service';
import { LibraryController } from './controllers/library/library.controller';

@Module({
  providers: [LibraryService],
  controllers: [LibraryController]
})
export class LibraryModule {}
