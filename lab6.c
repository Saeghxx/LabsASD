#include <stdio.h>

int main() {
    int size;
    printf("Enter the size: ");
    scanf("%d", &size);

    int matrix[size][size];

    printf("Matrix elements:\n");
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            scanf("%d", &matrix[i][j]);
        }
    }

    printf("\nInitial matrix:\n");
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            printf("%4d ", matrix[i][j]);
        }
        printf("\n");
    }

    int finish = size - 1;  
    while (finish > 0) {
        int lastSwap = 0;

        for (int i = 0; i < finish; i++) {

            int r1 = size - 1 - i;
            int c1 = i;

            int r2 = size - 2 - i;
            int c2 = i + 1;

            if (matrix[r1][c1] > matrix[r2][c2]) {
                int temp = matrix[r1][c1];
                matrix[r1][c1] = matrix[r2][c2];
                matrix[r2][c2] = temp;

                lastSwap = i;
            }
        }

        finish = lastSwap;
    }

    printf("\nResult matrix:\n");
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            printf("%4d ", matrix[i][j]);
        }
        printf("\n");
    }

    return 0;
}
