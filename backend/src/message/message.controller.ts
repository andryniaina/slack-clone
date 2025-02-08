import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto, UpdateMessageDto, GetMessagesQueryDto, AddReactionDto } from './dto/message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return this.messageService.create(createMessageDto, req.user);
  }

  @Get()
  findAll(@Query() query: GetMessagesQueryDto, @Request() req) {
    return this.messageService.findAll(query, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.messageService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req,
  ) {
    return this.messageService.update(id, updateMessageDto, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.messageService.delete(id, req.user);
  }

  @Post(':id/reactions')
  addReaction(
    @Param('id') id: string,
    @Body() addReactionDto: AddReactionDto,
    @Request() req,
  ) {
    return this.messageService.addReaction(id, addReactionDto, req.user);
  }

  @Post(':id/read')
  markAsRead(
    @Param('id') id: string,
    @Body('channelId') channelId: string,
    @Request() req,
  ) {
    return this.messageService.markAsRead(channelId, id, req.user);
  }

  @Get('channel/:channelId')
  getChannelMessages(
    @Param('channelId') channelId: string,
    @Request() req,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
  ) {
    return this.messageService.getChannelMessages(channelId, {
      limit: limit ? parseInt(limit.toString()) : undefined,
      before,
    }, req.user);
  }
} 