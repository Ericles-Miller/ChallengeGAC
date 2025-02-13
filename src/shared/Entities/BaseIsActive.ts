import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/shared/Entities/base.entity';
import { Column } from 'typeorm';

export abstract class BaseIsActive extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  constructor() {
    super();
  }
  protected activate(): void {
    if (this.isActive) throw new BadRequestException('Is already active.');

    this.isActive = true;
  }

  protected deactivate(): void {
    if (!this.isActive) throw new BadRequestException('Is already inactive.');

    this.isActive = false;
  }

  public setIsActive(status: boolean): void {
    status ? this.activate() : this.deactivate();

    this.setUpdatedAt();
  }
}
