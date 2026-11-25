import { IsString, IsNumber, IsInt, IsEmail, IsDateString, IsOptional, IsNotEmpty, IsIn, Min, Max } from 'class-validator';
          import { PartialType } from '@nestjs/mapped-types';
          export class CreatePermitTypeDto {
            @IsString() @IsNotEmpty() permitname: string;
@IsString() @IsOptional() description: string;
@IsNumber({ maxDecimalPlaces: 2 }) @Min(0) fee: number;
          }
          export class UpdatePermitTypeDto extends PartialType(CreatePermitTypeDto) {}
