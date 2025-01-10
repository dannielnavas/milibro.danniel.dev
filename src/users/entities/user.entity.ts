import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Library } from 'src/library/entities/library.entity';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: false })
  role: string;
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Library.name }] })
  libraries: Types.Array<Library>; // 👈 relation 1:N
}

export const UserSchema = SchemaFactory.createForClass(User);
