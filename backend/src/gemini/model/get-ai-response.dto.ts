import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetAIMessageDTO {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsOptional()
  sessionID?: string;
}
