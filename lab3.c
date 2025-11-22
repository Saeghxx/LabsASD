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
            printf("~");
        printf("\n");
    }

    pos.X = cols - rows / 2;
    pos.Y = rows / 2 - 1;

    int colCoord = cols - rows + 1;
    int rowCoord = 1;

    int direction = 0; 

    while (colCoord < 81 && rowCoord < 25)
    {
       
        if (colCoord < 81)
        {
            for (int i = 0; i < colCoord; i++)
            {
                SetConsoleCursorPosition(hout, pos);
                printf("*");
                fflush(stdout);
                usleep(1000);

                if (direction == 0)
                    pos.X--; 
                else
                    pos.X++; 
            }
            colCoord++;
        }
        if (rowCoord < 24)
        {
            for (int i = 0; i < rowCoord; i++)
            {
                SetConsoleCursorPosition(hout, pos);
                printf("*");
                fflush(stdout);
                usleep(1000);

                if (direction == 0)
                    pos.Y--; 
                else
                    pos.Y++; 
            }
            rowCoord++;
        }

        direction = !direction;
    }

    COORD endPos = {0, rows};
    SetConsoleCursorPosition(hout, endPos);
    getchar();
    return 0;
} 