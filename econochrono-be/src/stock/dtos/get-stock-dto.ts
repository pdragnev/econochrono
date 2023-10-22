import { IsNumberString } from 'class-validator';

export class GetStockDto {
  @IsNumberString()
  stockId: string;
}
