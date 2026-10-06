@echo off
set JMETER_HOME=%JMETER_HOME%
if "%JMETER_HOME%"=="" set JMETER_HOME=D:\apache-jmeter-5.6.3
set BASE_DIR=%~dp0
set RESULT_DIR=%BASE_DIR%results\%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%

mkdir "%RESULT_DIR%"

call "%JMETER_HOME%\bin\jmeter.bat" -n ^
  -q "%BASE_DIR%jmeter.properties" ^
  -t "%BASE_DIR%test-auth\05-mixed.jmx" ^
  -l "%RESULT_DIR%\result.jtl" ^
  -e -o "%RESULT_DIR%\html" ^
  -Jhost=localhost ^
  -Jport=9090 ^
  -Jthreads=1000 ^
  -Jrampup=10

echo 报告: %RESULT_DIR%\html\index.html
pause
