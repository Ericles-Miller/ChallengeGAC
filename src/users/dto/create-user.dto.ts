import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, MinLength, MaxLength, IsNotEmpty, Min, Matches } from 'class-validator';

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
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  password: string;

  @ApiProperty({ type: Number, required: true, example: 0.1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.0)
  balance: number;
}
