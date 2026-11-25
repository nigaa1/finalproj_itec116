import { IsString, IsNumber, IsInt, IsEmail, IsDateString, IsOptional, IsNotEmpty, IsIn, Min, Max } from 'class-validator';
          import { PartialType } from '@nestjs/mapped-types';
          export class CreateApplicationDocumentDto {
            @IsString() @IsNotEmpty() filename: string;
@IsString() @IsNotEmpty() filepath: string;
@IsDateString() @IsOptional() uploadedat: Date;
@IsInt() @Min(1) applicationid: number;
          }
          export class UpdateApplicationDocumentDto extends PartialType(CreateApplicationDocumentDto) {}
