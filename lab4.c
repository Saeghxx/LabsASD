#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>

#define MAX 10
int count = 0;

int sorter(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

void rfill(int A[MAX][MAX], int m, int n, int min, int max) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            A[i][j] = rand() % (max - min + 1) + min;
        }
        qsort(A[i], n, sizeof(int), sorter);
    }
}

int binSearch(int a[], int n, int x) {
    int L = 0, R = n - 1, res = -1;
    while (L <= R) {
        int m = (L + R) / 2;
        if (a[m] >= x) {
            res = m;
            R = m - 1;
        } else {
            L = m + 1;
        }
    }
    return (res != -1) ? res : n - 1;
}

void binSearchRow(int row[], int n, int raw) {
    int idx = binSearch(row, n, 0);
    if (idx >= n || row[idx] > 5) {
        printf("У рядку %d немає чисел у [0..5]\n", raw);
        return;
    }
    int left = idx;
    while (left > 0 && row[left - 1] >= 0 && row[left - 1] <= 5) left--;
    int right = idx;
    while (right < n - 1 && row[right + 1] >= 0 && row[right + 1] <= 5) right++;
    for (int k = left; k <= right; k++) {
        printf("Знайдено %d у [%d][%d]\n", row[k], raw, k);
        count++;
        Sleep(100);
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
            printf("%d ", A[i][j]);

    printf("\n--- Пошук чисел у [0..5] ---\n");
    for (int i = 0; i < m; i++)
        binSearchRow(A[i], n, i);

    printf("\nКількість знайдених чисел: %d\n", count);
    return 0;
}