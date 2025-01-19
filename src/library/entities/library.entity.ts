import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Library extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  wishlist: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  user: User | Types.ObjectId;
}

export const LibrarySchema = SchemaFactory.createForClass(Library);
