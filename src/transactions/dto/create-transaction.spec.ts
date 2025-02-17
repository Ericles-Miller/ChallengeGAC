import { validate } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

describe('CreateTransactionDto unit tests', () => {
  it.each([
    [100, '3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    [0.01, '3fa85f64-5717-4562-b3fc-2c963f66afa6'],
  ])('should return a valid Dto', async (amount: number, receiverId: string) => {
    const createTransactionDto = new CreateTransactionDto();
    createTransactionDto.amount = amount;
    createTransactionDto.receiverId = receiverId;

    const errors = await validate(createTransactionDto);
    expect(errors.length).toBe(0);
  });

  it.each([
    [0, '3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    [0.0, '3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    [100, ''],
    [100, null],
    [100, undefined],
    [0, ''],
    [0, null],
    [0, undefined],
    [0.0, ''],
    [0.0, null],
    [0.0, undefined],
    ['', '3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    [null, '3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    [undefined, '3fa85f64-5717-4562-b3fc-2c963f66afa6'],
  ])('should return a invalid Dto', async (amount: number, receiverId: string) => {
    const createTransactionDto = new CreateTransactionDto();
    createTransactionDto.amount = amount;
    createTransactionDto.receiverId = receiverId;

    const errors = await validate(createTransactionDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
