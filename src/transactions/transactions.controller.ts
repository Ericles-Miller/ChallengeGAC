import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/Jwt-auth-guard';
import { Transaction } from './entities/transaction.entity';
import { Request } from 'express';
import { PaginatedListDto } from 'src/shared/Dtos/PaginatedList.dto';
import { TransactionReversal } from './entities/transaction-reversal.entity';
import { CreateTransactionReversalDto } from './dto/create-transaction-reversal.dto';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary: 'create transaction',
    description: `
    sample request: create transaction
    Post /transactions
    {
      "amount": 100,
      "receiverId": "0987654321"
    }
    `,
  })
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 200,
    type: Transaction,
    description: 'Find user successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() request: Request,
  ): Promise<Transaction> {
    const { userId } = request.user;
    return await this.transactionsService.create(userId, createTransactionDto);
  }

  @Get()
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'senderName', required: false, type: String })
  @ApiOperation({
    summary: 'find all transactions of user ',
    description: `
    sample request: find all transactions by name sender paginated
    Get /transactions/?page=3&limit=5&senderName=John

    sample request: find all transactions sender paginated
    Get /transactions/?page=3&limit=5
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'list all Transactions successfully',
    type: PaginatedListDto<Transaction[]>,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findAll(
    @Req() request: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('senderName')
    senderName?: string,
  ): Promise<PaginatedListDto<Transaction[]>> {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;
    const { userId } = request.user;

    return await this.transactionsService.findAll(pageNumber, limitNumber, userId, senderName);
  }

  @Get(':id')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'find transaction by id',
    description: `
    sample request: find transaction by id
    Get /transactions/fec9f1f7-ccdf-414a-81c6-687fc32542d7
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'list all Transactions successfully',
    type: Transaction,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return await this.transactionsService.findOne(id);
  }

  @Post('reversal')
  @ApiBearerAuth('sessionAuth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'transaction reversal',
    description: `
    sample request: 
    Post /transactions/reversal 
    {
      "code": "123456",
      "reason": "reason"
    }
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'transaction reversal create successfully',
    type: TransactionReversal,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async reversal(
    @Body() createTransactionReversalDto: CreateTransactionReversalDto,
    @Req() request: Request,
  ): Promise<TransactionReversal> {
    const { userId } = request.user;
    return await this.transactionsService.reversal(userId, createTransactionReversalDto);
  }
}
