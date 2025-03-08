; ModuleID = 'main'
source_filename = "main"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-i128:128-f80:128-n8:16:32:64-S128"

define i32 @call_me_please(i32 %0, i32 %1) {
entry:
  %a = alloca i32, align 4
  store i32 %0, ptr %a, align 4
  %b = alloca i32, align 4
  store i32 %1, ptr %b, align 4
  br label %code

code:                                             ; preds = %entry
  %2 = load i32, ptr %b, align 4
  %3 = load i32, ptr %a, align 4
  %4 = add i32 %3, %2
  ret i32 %4
}
