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
    summary: 'Create track',
    description: 'Create a new track',
  })
  @ApiCreatedResponse({
    description: 'The track has been created',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Body does not contain required fields',
  })
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get tracks',
    description: 'Get all tracks',
  })
  @ApiOkResponse({ description: 'Success', type: [Track] })
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get track',
    description: 'Get the specified track by ID',
  })
  @ApiOkResponse({ description: 'Success', type: Track })
  @ApiBadRequestResponse({
    description: 'Bad request. Invalid ID',
  })
  @ApiNotFoundResponse({ description: 'Track not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tracksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update track',
    description: 'Update track info by ID',
  })
  @ApiOkResponse({ description: 'The track has been updated', type: Track })
  @ApiBadRequestResponse({
    description: 'Bad request. Invalid ID',
  })
  @ApiNotFoundResponse({ description: 'Track not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete track',
    description: 'Delete the specified track by ID',
  })
  @ApiNoContentResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad request. Invalid ID',
  })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tracksService.remove(id);
  }
}
