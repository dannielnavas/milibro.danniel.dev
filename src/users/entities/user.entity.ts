import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: false })
  role: string;
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  image: string;

  // @Prop({ type: [{ type: Types.ObjectId, ref: Library.name }] })
  // library: Types.Array<Library>;
}

export const UserSchema = SchemaFactory.createForClass(User);
