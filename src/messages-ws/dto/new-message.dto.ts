import { IsNotEmpty, IsString } from 'class-validator';

export class NewMessageDto {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
