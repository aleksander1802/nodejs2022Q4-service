import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from './entities/track.entity';

@ApiTags('Tracks')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new track',
    description: 'Add new track information',
  })
  @ApiCreatedResponse({
    description: 'Successful operation',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Body does not contain required fields',
  })
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get tracks list',
    description: 'Gets all library tracks list',
  })
  @ApiOkResponse({ description: 'Successful operation', type: [Track] })
  async findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single track by id',
    description: 'Gets single track by id',
  })
  @ApiOkResponse({ description: 'Successful operation', type: Track })
  @ApiBadRequestResponse({
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Track was not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update track information',
    description: 'Update library track information by UUID',
  })
  @ApiOkResponse({
    description: 'The track has been updated',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Track was not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete track',
    description: 'Delete track from library',
  })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Track was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tracksService.remove(id);
  }
}
