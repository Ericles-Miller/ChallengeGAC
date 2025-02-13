import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email'] as const), ) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;


}