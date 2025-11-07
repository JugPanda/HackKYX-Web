@echo off
REM Build script for Windows to compile game for web
echo Building game for web deployment...
python -m pygbag --build main.py
echo.
echo Build complete! Files are in the build/web directory.
echo You can now deploy the build/web folder to any web server.
pause

