#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>

#define MAX 10
int count = 0;

void rfill(int A[MAX][MAX], int m, int n, int min, int max) {
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            A[i][j] = rand() % (max - min + 1) + min;

    for (int j = 0; j < n; j++) {
        for (int i = 0; i < m - 1; i++) {
            for (int k = i + 1; k < m; k++) {
                if (A[i][j] > A[k][j]) {
                    int temp = A[i][j];
                    A[i][j] = A[k][j];
                    A[k][j] = temp;
                }
            }
        }
    }
}

int binSearch(int col[], int m, int x) {
    int L = 0, R = m - 1, res = -1;
    while (L <= R) {
        int mid = (L + R) / 2;
        if (col[mid] >= x) {
            res = mid;
            R = mid - 1;
        } else {
            L = mid + 1;
        }
    }
    return res;
}

void searchColumn(int A[MAX][MAX], int m, int colIndex) {
    
    int col[MAX];
    for (int i = 0; i < m; i++)
        col[i] = A[i][colIndex];

    int idx = binSearch(col, m, 0);
    if (idx == -1 || col[idx] > 5) {
        printf("У стовпці %d немає чисел у [0..5]\n", colIndex);
        return;
    }

    int top = idx;
    while (top > 0 && col[top - 1] >= 0 && col[top - 1] <= 5)
        top--;

    int bottom = idx;
    while (bottom < m - 1 && col[bottom + 1] >= 0 && col[bottom + 1] <= 5)
        bottom++;

    for (int i = top; i <= bottom; i++) {
        printf("Знайдено %d у [%d][%d]\n", A[i][colIndex], i, colIndex);
        count++;
        Sleep(50);
    }
}

int main() {
    SetConsoleOutputCP(65001);
    srand(time(NULL));

    int m = 7, n = 7;
    int A[MAX][MAX];

    rfill(A, m, n, 0, 10);  

    printf("Матриця A[%d][%d]:\n", m, n);
    for (int i = 0; i < m; i++, printf("\n"))
        for (int j = 0; j < n; j++)
            printf("%3d ", A[i][j]);

    printf("\n--- Пошук чисел у [0..5] по стовпцях ---\n");
    for (int j = 0; j < n; j++)
        searchColumn(A, m, j);

    printf("\nКількість знайдених чисел: %d\n", count);
    return 0;
}
