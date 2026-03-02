import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostService {

    constructor(private prisma: PrismaService) {}

    async create(post: { title: string, content: string, authorId: number }) {
        return await this.prisma.post.create({
            data: {
                title: post.title,
                content: post.content,
                authorId: post.authorId,
            },
        });
    }

}
