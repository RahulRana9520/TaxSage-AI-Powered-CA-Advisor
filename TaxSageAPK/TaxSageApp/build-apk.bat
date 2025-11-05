@echo off
echo Building TaxSage APK...
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Setting up Android build environment...
call npx expo prebuild --platform android

echo.
echo Step 3: Building APK...
cd android
call .\gradlew assembleRelease
cd ..

echo.
echo Build completed! 
echo APK location: android\app\build\outputs\apk\release\app-release.apk
echo.
pause