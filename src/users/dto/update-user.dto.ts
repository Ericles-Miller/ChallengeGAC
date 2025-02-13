import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['email', 'password'] as const) {
  @ApiProperty({ type: Boolean, example: true, required: false })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  password?: string;
}
