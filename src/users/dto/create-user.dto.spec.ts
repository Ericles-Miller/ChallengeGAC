import { validate } from 'class-validator';
import { compare } from 'bcryptjs';
import { CreateUserDto } from './create-user.dto';

describe('Suit test Create-user.dto', () => {
  it.each([
    ['John Doe', 'john@example.com', '@1Wsd01q', 5000],
    ['John Doe', 'john@example.com', 'Qw$vdsa124'.repeat(2), 15000],
    ['John Lock', 'johnLock@example.com', 'Qw$vdsa124', 0],
    ['a'.repeat(80), 'aa@example.com', 'Qw$vdsa124', 0],
  ])(' should return a valid Dto', async (name: string, email: string, password: string, balance: number) => {
    const createUserDto = new CreateUserDto();
    createUserDto.name = name;
    createUserDto.email = email;
    createUserDto.password = password;
    createUserDto.balance = balance;

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(0);

    const isPasswordEncrypted = await compare(password, createUserDto.password);
    expect(isPasswordEncrypted).toBe(true);
  });

  it.each([
    ['John Doe', 'john@example.com', '@1Wsd01q', -1],
    ['John Doe', 'john@example.com', 'Qw$vdsa124'.repeat(2), null],
    ['John Lock', 'johnLock@example.com', 'Qw$v', 100],
    ['a', `${'a'.repeat(220)}` + '@example.com', 'Qw$vdsa124', 10.5],
    ['a'.repeat(80), 'aa@example.com', 'Qw$vdsa124', undefined],
    ['a'.repeat(81), 'aa@example.com', 'Qw$vdsa124', null],
    ['a'.repeat(20), 'aa@example.com', 'Qw$vdsa124', undefined],
    ['a'.repeat(20), 'aa@example.com', '', 40],
    ['a'.repeat(20), 'aa@example.com', null, 40],
    ['a'.repeat(20), 'aa@example.com', undefined, 40],
    ['a'.repeat(20), '', 'Qw$vdsa124', '40'],
    ['a'.repeat(20), null, 'Qw$vdsa124', '40'],
    ['a'.repeat(20), undefined, 'Qw$vdsa124', '40'],
    ['', 'aa@example.com', 'Qw$vdsa124', 40],
    [null, 'aa@example.com', 'Qw$vdsa124', 40],
    [undefined, 'aa@example.com', 'Qw$vdsa124', 40],
  ])(
    ' should return a invalid Dto',
    async (name: string, email: string, password: string, balance: number) => {
      const createUserDto = new CreateUserDto();
      createUserDto.name = name;
      createUserDto.email = email;
      createUserDto.password = password;
      createUserDto.balance = balance;

      const errors = await validate(createUserDto);
      expect(errors.length).toBeGreaterThan(0);
    },
  );
});
