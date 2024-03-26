import { Injectable } from '@nestjs/common';
import { UpdateExternadoSequenceDto } from './dto/update-externado_sequence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternadoSequence } from './entities/externado_sequence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExternadoSequenceService {
  constructor(
    @InjectRepository(ExternadoSequence)
    private readonly externadoSequenceRepository: Repository<ExternadoSequence>
  )
  {}

  async findOneById(idexternado_sequence: number) {
  return await this.externadoSequenceRepository.findOneBy({idexternado_sequence});
  }

  async updateSequences(updateExternadoSequenceDto: UpdateExternadoSequenceDto) {
    return await this.externadoSequenceRepository.save(updateExternadoSequenceDto);
  }

}
