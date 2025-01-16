import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  ErrEmailExisted,
  ErrUserNotFound,
  User,
  UserCondDTO,
  UserCreationDTO,
  userCreationDTOSchema,
  UserUpdateDTO,
  userUpdateDTOSchema,
} from './model';
import { AppError } from 'src/shared';
import * as bcrypt from 'bcrypt';
import { v7 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async create(dto: UserCreationDTO): Promise<string> {
    const data = userCreationDTOSchema.parse(dto);

    // 1. Check email existed
    const user = await this.userRepo.findByCond({ email: data.email });
    if (user) throw AppError.from(ErrEmailExisted, 400);

    // 2. Gen salt and hash password
    const salt = bcrypt.genSaltSync(8);
    const hashPassword = await bcrypt.hash(data.password, salt);

    // 3. Create new user
    const newId = v7();
    const newUser: User = {
      ...data,
      password: hashPassword,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Insert new user to database
    await this.userRepo.insert(newUser);
    return newId;
  }

  async findByCond(condition: UserCondDTO): Promise<User | null> {
    return this.userRepo.findByCond(condition);
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepo.findById(id);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  async update(id: string, dto: UserUpdateDTO): Promise<void> {
    const data = userUpdateDTOSchema.parse(dto);

    const existedUser = await this.userRepo.findById(id);

    if (!existedUser) {
      throw AppError.from(ErrUserNotFound, 404);
    }

    await this.userRepo.update(id, data);
  }

  async remove(id: string): Promise<void> {
    const existedUser = await this.userRepo.findById(id);

    if (!existedUser) {
      throw AppError.from(ErrUserNotFound, 404);
    }

    return this.userRepo.delete(id);
  }
}
