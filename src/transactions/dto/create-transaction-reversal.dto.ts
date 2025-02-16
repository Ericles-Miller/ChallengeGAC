import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateTransactionReversalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Code invalid',
  })
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(235)
  reason: string;
}
