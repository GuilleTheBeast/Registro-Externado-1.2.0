import { Controller } from '@nestjs/common';
import { ExternadoUserTypesService } from './externado_user_types.service';

@Controller('externado-user-types')
export class ExternadoUserTypesController {
  constructor(private readonly externadoUserTypesService: ExternadoUserTypesService) {}

}
