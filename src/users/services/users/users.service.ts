import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}

  async findOne(id: string) {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const registerUser = {
      ...data,
    };
    const hashPassword = await bcrypt.hashSync(registerUser.password, 10);
    registerUser.password = hashPassword;
    const newUser = new this.users(registerUser);
    return newUser.save();
  }

  async findOneByEmail(email: string) {
    const user = await this.users.findOne({
      email,
    });
    console.log(user);

    return user;
  }
}
