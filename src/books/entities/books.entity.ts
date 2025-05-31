import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Library } from 'src/library/entities/library.entity';

type BookStatus = 'reading' | 'completed' | 'wishlist' | 'none';

@Schema({
  timestamps: true,
})
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
  image_url: string;
  @Prop({ required: true })
  wishlist: boolean;
  @Prop({ required: true })
  lenguaje: string;
  @Prop()
  startDate: string;
  @Prop()
  endDate: string;
  @Prop({
    type: Types.ObjectId,
    ref: Library.name,
  })
  library: Library | Types.ObjectId;
  @Prop({ required: true, default: 'none' })
  status: BookStatus;
  @Prop()
  genre: string;
  @Prop()
  totalPages: number;
  @Prop()
  description: string;
}

export const BooksSchema = SchemaFactory.createForClass(Books);
