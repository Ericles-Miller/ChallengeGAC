import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, MinLength, MaxLength, IsNotEmpty, Min } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true, example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ type: String, required: true, example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(235)
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({ type: Number, required: true, example: 0.1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.1)
  balance: number;
}
