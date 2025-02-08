import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateChannelDto, UpdateChannelDto, AddMembersDto, RemoveMembersDto, CreateDirectMessageDto, ChannelQueryDto } from './dto/channel.dto';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @Request() req) {
    return this.channelService.create(createChannelDto, req.user);
  }

  @Post('direct')
  createDirectMessage(@Body() createDirectMessageDto: CreateDirectMessageDto, @Request() req) {
    return this.channelService.createDirectMessage(createDirectMessageDto, req.user);
  }

  @Get()
  findAll(@Query() query: ChannelQueryDto, @Request() req) {
    return this.channelService.findAll(req.user, query);
  }

  /**
   * Récupère tous les canaux accessibles pour l'utilisateur connecté
   * (canaux publics ou canaux privés dont l'utilisateur est membre)
   */
  @Get('accessible')
  findAccessibleChannels(@Request() req) {
    return this.channelService.findAccessibleChannels(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.channelService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
    @Request() req,
  ) {
    return this.channelService.update(id, updateChannelDto, req.user);
  }

  @Post(':id/members')
  addMembers(
    @Param('id') id: string,
    @Body() addMembersDto: AddMembersDto,
    @Request() req,
  ) {
    return this.channelService.addMembers(id, addMembersDto, req.user);
  }

  @Delete(':id/members')
  removeMembers(
    @Param('id') id: string,
    @Body() removeMembersDto: RemoveMembersDto,
    @Request() req,
  ) {
    return this.channelService.removeMembers(id, removeMembersDto, req.user);
  }

  @Post(':id/leave')
  leave(@Param('id') id: string, @Request() req) {
    return this.channelService.leave(id, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.channelService.delete(id, req.user);
  }
} 