import { Controller } from '@nestjs/common';
import { ExternadoSequenceService } from './externado_sequence.service';

@Controller('externado-sequence')
export class ExternadoSequenceController {
  constructor(private readonly externadoSequenceService: ExternadoSequenceService) {}

}
