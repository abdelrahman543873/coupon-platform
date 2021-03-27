import { IsString, MaxLength, MinLength } from "class-validator";

export class TermsAndConditionsInput {
  @IsString()
  @MinLength(10)
  @MaxLength(255)
  enDescription;

  @IsString()
  @MinLength(10)
  @MaxLength(255)
  arDescription;
}
