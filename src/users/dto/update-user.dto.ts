import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['email'] as const) {
  @ApiProperty({ type: Boolean, example: true, required: false })
  @IsBoolean()
  isActive?: boolean;
}
