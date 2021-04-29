import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class HeroDto {
  @IsUUID()
  id!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  power: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description: string;
}
