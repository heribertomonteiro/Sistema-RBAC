import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    
    @ApiProperty({ example: 'Meu primeiro post' })
    @IsString()
    @MinLength(3)
    title!: string;

    @ApiProperty({ example: 'Conteúdo do post com pelo menos 10 caracteres.' })
    @IsString()
    @MinLength(10)
    content!: string;
}