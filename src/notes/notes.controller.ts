import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SuccessMessage } from 'src/common/decorators/success_message.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseNoteDto } from './dto/response-note.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { QueryNoteDto } from './dto/query-note.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @SuccessMessage("Create Note Successfully")
  public create(@Body() createNoteDto: CreateNoteDto,@CurrentUser() user: User): Promise<ResponseNoteDto> {
    return this.notesService.create(createNoteDto,user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @SuccessMessage("Get all Notes Successfully")
  public findAll(@CurrentUser() user: User, @Query() query:QueryNoteDto): Promise<PaginatedResponse<ResponseNoteDto>> {
    return this.notesService.findAllByUserId(user,query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @SuccessMessage("Get Note Detail Successfully")
  findOne(@Param('id') id: string, @CurrentUser() user: User):Promise<ResponseNoteDto> {
    return this.notesService.findOne(+id,user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @SuccessMessage("Update Note Successfully")
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @CurrentUser() user: User) :Promise<ResponseNoteDto> {
    return this.notesService.update(+id, user, updateNoteDto);
  }

  @Put(':id/toggle-complete')
  @UseGuards(JwtAuthGuard)
  @SuccessMessage("Toggle Note status Successfully")
  updateStatus(@Param('id') id: string,@CurrentUser() user: User) :Promise<ResponseNoteDto> {
    return this.notesService.updateStatus(+id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @SuccessMessage("Delete Note Successfully")
  remove(@Param('id') id: string,@CurrentUser() user: User) {
    return this.notesService.remove(+id, user);
  }
}
