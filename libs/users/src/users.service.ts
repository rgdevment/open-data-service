import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email is already in use.');
    }

    const existingUserByDocument = await this.userRepository.findOneBy({
      documentType: createUserDto.documentType,
      documentValue: createUserDto.documentValue,
    });
    if (existingUserByDocument) {
      throw new ConflictException('Document is already registered.');
    }

    const existingUserByPhone = await this.userRepository.findOneBy({
      phone: createUserDto.phone,
    });
    if (existingUserByPhone) {
      throw new ConflictException('Phone number is already in use.');
    }

    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findOneByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
}
