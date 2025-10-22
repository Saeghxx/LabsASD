#include <stdio.h>
#include <math.h>

int main()
{
    int n;
    int OpCount = 0;
    double res = 0.0;
    double ressum = 0.0;

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

            double denom = pow(2.0, i) + 1; 
            OpCount += 2;

            ressum = resj / (denom * denom);
            OpCount += 3;

            res += ressum; 
            OpCount++;
        }
        printf("Res = %.7lf \nOperation = %d\n", res, OpCount);
    }
    else
    {
        goto point_zero;
    }
    
    return 0;
}
