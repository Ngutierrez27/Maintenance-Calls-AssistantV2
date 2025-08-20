# Build Assets Configuration

This document outlines the build assets that are generated for the Maintenance Call Assistant application.

## Build Configuration

The application is configured using electron-builder to generate the following assets:

### macOS Assets (✅ Generated)
- **ZIP File**: `Maintenance Call Assistant-1.0.0-mac.zip`
- **Update Manifest**: `latest-mac.yml`

### Windows Assets (⚠️ Configuration Ready)
- **Setup EXE**: `Maintenance Call Assistant Setup 1.0.0.exe`
- **Update Manifest**: `latest.yml`

## Build Commands

- `npm run build:mac` - Build for macOS (generates ZIP and latest-mac.yml)
- `npm run build:win` - Build for Windows (generates EXE and latest.yml)
- `npm run build` - Build for all platforms
- `npm run dist` - Build without publishing

## Notes

- The macOS build generates a ZIP file (not DMG) as required by the updater
- The Windows build requires Wine on Linux systems or building on Windows
- Update manifests (YAML files) are automatically generated for auto-updater functionality
- All builds follow the naming convention specified in the problem statement

## File Structure

After building, the `dist/` folder contains:
```
dist/
├── Maintenance Call Assistant-1.0.0-mac.zip      # macOS installer
├── latest-mac.yml                                 # macOS update manifest
├── Maintenance Call Assistant Setup 1.0.0.exe    # Windows installer (when built)
└── latest.yml                                     # Windows update manifest (when built)
```