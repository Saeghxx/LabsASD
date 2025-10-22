#include <stdio.h>

int main() {
    short x;
    int res;

    scanf("%hd", &x);

    if (x > -10) {

        if (x <= -5) {
            res = (x*x*x) - 6;
            printf("res=%d\n", res);
        }
        else if (x <= 15) {
            if (x > 5) {
                res = (x*x*x) - 6;
                printf("res=%d\n", res);
            }
            else {
                printf("Error\n");
            }
        }
        else if (x >= 25) {
            res = 2*(x*x*x) - 3*x + 2;
            printf("res=%d\n", res);
        }
        else {
            printf("Error\n");
        }
    }
    else {
        printf("Error\n");
    }
    return 0;
}
