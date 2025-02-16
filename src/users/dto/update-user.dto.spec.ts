import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import { compare } from 'bcryptjs';

describe('Suit test Update-user.dto', () => {
  it.each([
    ['John Doe', '@1Wsd01q', 5000, true],
    ['John Doe', 'Qw$vdsa124'.repeat(2), 15000, false],
    ['John Lock', 'Qw$vdsa124', 0, false],
    ['a'.repeat(80), 'Qw$vdsa124', 0, true],
    ['Ja', 'Qw$vdsa124', 10000, true],
    ['John Doe', 'Qw$vdsa124'.repeat(2), 15000, null],
    ['John Doe', 'Qw$vdsa124'.repeat(2), 15000, undefined],
    ['John Doe', 'Qw$vdsa124'.repeat(2), null, false],
    ['John Doe', 'Qw$vdsa124'.repeat(2), undefined, false],
    ['John Doe', null, 15000, true],
    ['John Doe', undefined, 15000, true],
    [null, 'Qw$vdsa124'.repeat(2), 3333, false],
    [undefined, 'Qw$vdsa124'.repeat(2), 3333, false],
  ])(
    ' should return a valid Dto',
    async (name: string, password: string, balance: number, isActive: boolean) => {
      const updateUserDto = new UpdateUserDto();
      updateUserDto.name = name;
      updateUserDto.password = password;
      updateUserDto.balance = balance;
      updateUserDto.isActive = isActive;

      const errors = await validate(updateUserDto);
      expect(errors.length).toBe(0);

      if (password) {
        const isPasswordEncrypted = await compare(password, updateUserDto.password);
        expect(isPasswordEncrypted).toBe(true);
      }
    },
  );

  it.each([
    ['John Doe', 'Qw$vdsa124'.repeat(2), -15000, true],
    ['', 'Qw$vdsa124'.repeat(2), 15000, false],
    ['John Doe'.repeat(250), 'Qw$vdsa124', 15000, null],
    ['J', 'Qa124', 15000, undefined],
    ['John Doe', '', 15000, true],
    ['John Doe', 'a@ex.com'.repeat(250), 15000, true],
  ])(
    'should return a invalid Dto',
    async (name: string, password: string, balance: number, isActive: boolean) => {
      const updateUserDto = new UpdateUserDto();
      updateUserDto.name = name;
      updateUserDto.password = password;
      updateUserDto.balance = balance;
      updateUserDto.isActive = isActive;

      const errors = await validate(updateUserDto);
      expect(errors.length).toBeGreaterThan(0);
    },
  );
});
