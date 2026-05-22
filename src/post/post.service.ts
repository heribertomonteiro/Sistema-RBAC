import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostService {

    constructor(private prisma: PrismaService) {}

    async create(post: { title: string, content: string, authorId: number }) {
        return await this.prisma.post.create({
            data: {
                title: post.title,
                content: post.content,
                author: { connect: { id: post.authorId } },
                published: true
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async findPublished() {
        return await this.prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    async findAllForModeration() {
        return await this.prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    async update(postId: number, data: { title?: string; content?: string }) {
        return this.prisma.post.update({
            where: { id: postId },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    async setPublished(postId: number, published: boolean) {
        return this.prisma.post.update({
            where: { id: postId },
            data: { published },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    async remove(postId: number) {
        return this.prisma.post.delete({
            where: { id: postId },
        });
    }

}
