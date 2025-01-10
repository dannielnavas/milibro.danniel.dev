import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Books } from 'src/books/entities/books.entity';

@Schema()
export class Library extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  wishlist: boolean;
  @Prop({ type: [{ type: Types.ObjectId, ref: Books.name }] })
  books: Types.Array<Books>; // 👈 relation 1:N
}

export const LibrarySchema = SchemaFactory.createForClass(Library);
