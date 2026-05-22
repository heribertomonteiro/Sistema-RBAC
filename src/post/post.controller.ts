import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from '../dto/create-post.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UpdatePostDto } from '../dto/update-post.dto';

@ApiTags('posts')
@Controller('post')
export class PostController {
    prisma: any;

    constructor(private postService: PostService) {}

    @ApiOperation({ summary: '(User) Create a post (starts unpublished)' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.User)
    @Post()
    async create(@Req() req: any, @Body() dto: CreatePostDto) {
        const authorId = req.user?.id;
        if (!authorId) {
            throw new UnauthorizedException('Authenticated user id not found');
        }
        return await this.postService.create({ title: dto.title, content: dto.content, authorId });
    }

    @ApiOperation({ summary: 'List published posts (public)' })
    @Get()
    async findAll() {
        return await this.postService.findPublished();
    }

    @ApiOperation({ summary: '(Moderator) List all posts for moderation' })
    @ApiBearerAuth('jwt')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Moderator)
    @Get('moderation')
    async findAllForModeration() {
        return await this.postService.findAllForModeration();
    }

    @ApiOperation({ summary: '(Moderator) Update a post' })
    @ApiBearerAuth('jwt')
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Moderator)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
        if (!dto.title && !dto.content) {
            throw new BadRequestException('At least one of title/content must be provided');
        }
        return this.postService.update(id, {
            title: dto.title,
            content: dto.content,
        });
    }

    @ApiOperation({ summary: '(Moderator) Publish a post' })
    @ApiBearerAuth('jwt')
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Moderator)
    @Patch(':id/publish')
    async publish(@Param('id', ParseIntPipe) id: number) {
        return this.postService.setPublished(id, true);
    }

    @ApiOperation({ summary: '(Moderator) Unpublish a post' })
    @ApiBearerAuth('jwt')
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Moderator)
    @Patch(':id/unpublish')
    async unpublish(@Param('id', ParseIntPipe) id: number) {
        return this.postService.setPublished(id, false);
    }

    @ApiOperation({ summary: '(Moderator) Delete a post' })
    @ApiBearerAuth('jwt')
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Moderator)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.postService.remove(id);
    }
}
