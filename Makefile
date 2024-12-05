CC = gcc
CFLAGS = -std=c11 -O3 -g -Wall -Wextra -Wno-unused-parameter -Wno-address
CFLAGS += -Iinclude
LDFLAGS = -Llib -lcglm -lglfw3dll -lopengl32 -mwindows

SRC   = $(wildcard src/**/*.c) $(wildcard src/*.c) $(wildcard src/**/**/*.c) $(wildcard src/**/**/**/*.c) $(wildcard lib/*.c)
OBJ   = $(SRC:.c=.o)
BIN   = bin

.PHONY: all clean

all: dirs game

dirs:
	@if not exist $(BIN) mkdir $(BIN)

run: all
	$(BIN)\game.exe 2> error.log 1> debug.log

game: $(OBJ)
	$(CC) -o $(BIN)/game $^ $(LDFLAGS)

%.o: %.c
	$(CC) -o $@ -c $< $(CFLAGS)

clean:
	@echo Deleting files and directories...
	del /Q bin\*.exe src\*.o src\gfx\*.o lib\*.o *.log
	@echo Cleanup complete.