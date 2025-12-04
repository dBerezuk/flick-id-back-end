import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth/auth.decorator";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { GenreService } from "./genre.service";

@Controller("genres")
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getAll() {
    return await this.genreService.getAll();
  }

  @Get(":id")
  async getFind(@Param("id") id: string) {
    return await this.genreService.getFindByFields({ id });
  }

  @Post()
  @Auth(true)
  async create(@Body() dto: CreateGenreDto) {
    return await this.genreService.create(dto);
  }

  @Patch("/:id")
  @Auth(true)
  async update(@Param("id") id: string, @Body() dto: UpdateGenreDto) {
    return await this.genreService.update(id, dto);
  }

  @Delete("/:id")
  @Auth(true)
  async delete(@Param("id") id: string) {
    await this.genreService.delete(id);

    return true;
  }
}
