import { ArrayNotEmpty, IsArray, IsString, MaxLength, ArrayMaxSize } from "class-validator";

export class ImportDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  @ArrayMaxSize(100)
  productIds: string[];
}
