#include <stdio.h>
#include <math.h>

int main() 
{
    int n;
    int OpCount = 0;
    double res = 0.0;

point_zero:
    printf("n = ");
    scanf("%d", &n);

    if (n >= 1)
    {
        for (int i = 1; i <= n; i++)
        {
            double resj = 1.0;
            for (int j = 1; j <= i; j++) {
                resj *= (j + 1);
                OpCount++;
            }

            double denom = 1.0;
            for (int k = 1; k <= i; k++) {
                denom *= 2.0;
                OpCount++;
            }
            denom += 1.0;
            OpCount++;

            res += resj / (denom * denom);
            OpCount += 3;
        }
        printf("result = %.7lf \nOperations %d \n", res, OpCount);
    } 
    else {
        goto point_zero;
    }

    return 0;
}