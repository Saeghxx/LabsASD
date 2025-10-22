#include <stdio.h>

int main() {
    short x, res;

    scanf("%hd", &x);

if ((x > -10 && x <= -5) || (x > 5 && x <= 15)) {
    res=(x*x*x) - 6;
    printf("res = %hd\n", res);
    }
else if (x >= 25) {
    res=2*(x*x*x) - 3*x + 2;
    printf("res = %hd\n", res);
    }
else {
    printf("Error\n");
    }

    return 0;
}

