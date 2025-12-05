#include <stdio.h>

int main() {
    int i, size, border, swap;
    printf("Enter the size: ");
    scanf("%d", &size);

    int finish = size - 1;
    int matrix[size][size];

    printf("Matrix elements:\n");
    for (i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            scanf("%d", &matrix[i][j]);
        }
    }

    printf("Initial matrix:\n");
    for (i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            printf(" %d", matrix[i][j]);
        }
        printf("\n");
    }
    printf("\n");

    while (finish > 0) {
        border = 0;
        for (i = 0; i < finish; i++) {
            if (matrix[size - 1 - i][i] > matrix[size - 2 - i][i + 1]) {
                swap = matrix[size - 1 - i][i];
                matrix[size - 1 - i][i] = matrix[size - 2 - i][i + 1];
                matrix[size - 2 - i][i + 1] = swap;
                border = i;
            }
        }
        finish = border;
    }

    printf("Result matrix:\n");
    for (i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            printf(" %d", matrix[i][j]);
        }
        printf("\n");
    }

    return 0;
}