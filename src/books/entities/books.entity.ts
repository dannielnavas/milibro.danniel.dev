import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Books extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  isbn: string;
  @Prop({ required: true })
  publication_year: number;
  @Prop({ required: true })
  publisher: string;
  @Prop({ required: true })
  image_url: string;
  @Prop({ required: true })
  wishlist: boolean;
}

export const BooksSchema = SchemaFactory.createForClass(Books);
