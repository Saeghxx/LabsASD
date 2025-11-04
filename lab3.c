#include <stdio.h>
#include <windows.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    if (argc < 2 || (argv[1] == "--terminal") != 0)
    {
        system("start lab3.exe --terminal");
        return 0;
    }

    HANDLE hout = GetStdHandle(STD_OUTPUT_HANDLE);
    COORD pos;

    int rows = 24;
    int cols = 80;

    for (int i = 0; i < rows; i++)
    {
        for (int j = 0; j < cols; j++)
        {
            printf("~");
        }
        printf("\n");
    }

    pos.X = cols / 2;
    pos.Y = rows / 2;

    int step = 1;     
    int moves = 0;        
    int changes = 0;      
    int direction = 0;    

    while (1)
    {
    
        SetConsoleCursorPosition(hout, pos);
        printf("#");
        fflush(stdout);
        usleep(1000);

        switch (direction)
        {
        case 0: pos.X++; break; 
        case 1: pos.Y++; break; 
        case 2: pos.X--; break; 
        case 3: pos.Y--; break; 
        }

        moves++;

        if (moves == step)
        {
            moves = 0;
            direction = (direction + 1) % 4;
            changes++;

            if (changes % 2 == 0)
                step++;
        }

        if (pos.X < 0 || pos.X >= cols || pos.Y < 0 || pos.Y >= rows)
            break;
    }

    COORD endPos = {0, rows};
    SetConsoleCursorPosition(hout, endPos);
    getchar();
    return 0;
}
