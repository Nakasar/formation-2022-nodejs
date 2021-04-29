import { IsString, MaxLength, MinLength } from 'class-validator';

export class HeroDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  power!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description!: string;
}
