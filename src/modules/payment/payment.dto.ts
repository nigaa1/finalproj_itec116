import { IsString, IsNumber, IsInt, IsEmail, IsDateString, IsOptional, IsNotEmpty, IsIn, Min, Max } from 'class-validator';
          import { PartialType } from '@nestjs/mapped-types';
          export class CreatePaymentDto {
            @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) amount: number;
@IsString() @IsNotEmpty() paymentmethod: string;
@IsDateString() @IsOptional() paidat: Date;
@IsInt() @Min(1) applicationid: number;
          }
          export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
