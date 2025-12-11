import { Module } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerationController } from './generation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generation } from './entities/generation.entity';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Generation, Department])
  ],
  providers: [GenerationService],
  controllers: [GenerationController]
})
export class GenerationModule {}
