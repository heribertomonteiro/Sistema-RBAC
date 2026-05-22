import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
    @ApiPropertyOptional({ example: 'Novo título' })
    @IsOptional()
    @IsString()
    @MinLength(3)
    title?: string;

    @ApiPropertyOptional({ example: 'Novo conteúdo com pelo menos 10 caracteres.' })
    @IsOptional()
    @IsString()
    @MinLength(10)
    content?: string;
}
