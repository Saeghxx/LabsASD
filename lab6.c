#include <stdio.h>
#include <stdbool.h>
int main()
{
 int N, i,j, Flag, Condition;
 float T;
 printf("Enter N: ");
 scanf("%u", &N);
 float arr[N][N];
 for(i = 0; i < N; i++)
 {
 for(j = 0; j < N; j++)
 {
 scanf ("%f", &arr[i][j]);
 }
 }
 printf("\n Unsorted matrix \n");
 for(i = 0; i < N; i++)
 {
 printf("\n");
 for(j = 0; j < N; j++)
 {
 printf(" %.0f", arr[i][j]);
 }
 }
 Flag= N-1;
 Condition = true;
 while (Condition==true){
 Condition=false;
 for(i = 0; i < Flag ; i++){
 if(arr[N-1-i][i]<arr[N-2-i][i+1]){
 T = arr[N-1-i][i];
 arr[N-1-i][i] = arr[N-2-i][i+1];
 arr[N-2-i][i+1] = T;
 Condition = true;
 }
 }
 Flag --;
 }
 printf("\n Result matrix \n");
 for(i = 0; i < N; i++){
 printf("\n");
 for(j = 0; j < N; j++){
 printf(" %.0f", arr[i][j]);
 }
 }
 return 0;
}