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

  async getUserById(id: string) {
    return this.users.findById(id).exec();
  }

  async update(id: string, changes: string) {
    console.log('id', id);
    console.log('changes', changes);
    const userData = await this.getUserById(id);
    console.log('userData', userData);
    if (!userData) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const updateLibrary = {
      ...userData,
      libraries: userData.libraries || [], // Inicializar libraries si es undefined
    };
    console.log('updateLibrary', updateLibrary);
    updateLibrary.libraries.push(changes);
    console.log('updateLibrary', updateLibrary);
    const user = await this.users
      .findByIdAndUpdate(id, { $set: updateLibrary }, { new: true })
      .exec();
    console.log('user', user);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }
}
