import { validate } from 'class-validator';
import { CreateTransactionReversalDto } from './create-transaction-reversal.dto';

describe('Suit tests CreateTransactionReversalDto', () => {
  it.each([
    ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', 'a'.repeat(235)],
    ['3fa85f6457174562b3fcZ2c963f66afa6', 'aa'],
  ])('should return a valid Dto', async (code: string, reason: string) => {
    const createTransactionReversalDto = new CreateTransactionReversalDto();
    createTransactionReversalDto.code = code;
    createTransactionReversalDto.reason = reason;

    const errors = await validate(createTransactionReversalDto);
    expect(errors.length).toBe(0);
  });

  it.each([
    ['', 'a'.repeat(236)],
    ['', ''],
    ['', null],
    ['', undefined],
    [null, 'a'.repeat(236)],
    [null, ''],
    [null, null],
    [null, undefined],
    [undefined, 'a'.repeat(236)],
    [undefined, ''],
    [undefined, null],
    [undefined, undefined],
    ['', ''],
    ['', null],
    ['', undefined],
    [null, ''],
    [null, null],
    [null, undefined],
    [undefined, ''],
    [undefined, null],
    [undefined, undefined],
  ])('should return a invalid Dto', async (code: string, reason: string) => {
    const createTransactionReversalDto = new CreateTransactionReversalDto();
    createTransactionReversalDto.code = code;
    createTransactionReversalDto.reason = reason;

    const errors = await validate(createTransactionReversalDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
