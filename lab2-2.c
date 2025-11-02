#include <stdio.h>
#include <math.h>

int main()
{
    int n;
    int OpCount = 0;
    double ressum = 0;

point_zero:
    printf("n = ");
    scanf("%d", &n);

    if (n >= 1)
    {
        double resj = 1.0;  
        double pow2 = 1.0;     
        for (int i = 1; i <= n; i++)
        {
            resj *= (i + 1);
            OpCount++;

            pow2 *= 2.0; 
            OpCount++;

            double denom = pow2 + 1.0;
            OpCount++; 

            ressum += resj / (denom * denom);
            OpCount += 3;
        }

        printf("S = %.7lf\nOperations = %d\n", ressum, OpCount);
    }
    else
    {
        goto point_zero;
    }

    return 0;
}