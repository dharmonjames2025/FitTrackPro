#!/bin/bash
# Auto-fix the generated app/build.gradle
sed -i 's/entryFile = file(\[.*\])/entryFile = file("..\/..\/index.tsx")/' android/app/build.gradle
sed -i '/hermesCommand/d' android/app/build.gradle
sed -i '/apply from:/d' android/app/build.gradle
sed -i '/applyNativeModulesAppBuildGradle/d' android/app/build.gradle
