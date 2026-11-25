import { IsString, IsNumber, IsInt, IsEmail, IsDateString, IsOptional, IsNotEmpty, IsIn, Min, Max } from 'class-validator';
          import { PartialType } from '@nestjs/mapped-types';
          export class CreateApplicationDto {
            @IsString() @IsNotEmpty() businessname: string;
@IsIn(['pending', 'approved', 'rejected']) @IsOptional() status: string;
@IsDateString() @IsOptional() submittedat: Date;
@IsInt() @Min(1) userid: number;
@IsInt() @Min(1) permittypeid: number;
          }
          export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
