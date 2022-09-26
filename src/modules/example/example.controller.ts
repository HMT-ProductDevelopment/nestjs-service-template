import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ExampleQueries } from "@shared/queries/example.queries";
import { BaseController, Mediator } from "be-core";
import { UserAuthorize } from "~/guard";
import { AddCommand, UpdateCommand } from "./command";
import { DeleteCommand } from "./command/delete.command";

@Controller('example')
@UseGuards(UserAuthorize)
export class ExampleController extends BaseController {
    constructor(
        private mediator: Mediator,
        private exampleQueries: ExampleQueries
    ) {
        super();
    }
    @Post()
    async add(
        @Body() command: AddCommand
    ) {
        return this.mediator.send(command)
    }
    @Get()
    async gets(
        @Query('pageIndex', ParseIntPipe) pageIndex: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ) {
        return this.exampleQueries.gets(pageIndex, pageSize)
    }

    @Get(':code')
    async get(
        @Param('code') code: string
    ) {
        return this.exampleQueries.getByCode(code);
    }


    @Patch(':code')
    async update(
        @Param('code') code: string,
        @Body() command: UpdateCommand
    ) {
        command.code = code
        this.mediator.send(command)

    }
    @Delete(':code')
    async delete(
        @Param('code') code: string
    ) {
        const command = new DeleteCommand(code)
            ; this.mediator.send(command)

    }
}