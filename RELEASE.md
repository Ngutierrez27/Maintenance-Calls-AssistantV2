# Release Process

This repository uses automated GitHub Actions to handle releases.

## How it works

When you push a version tag (e.g., `v1.0.0`, `v2.1.3`), the GitHub Actions workflow will automatically:

1. ✅ Checkout the code
2. ✅ Set up Node.js environment
3. ✅ Install dependencies
4. ✅ Run build process
5. ✅ Create a GitHub release with:
   - **Draft: false** (published immediately)
   - **Pre-release: false** (marked as a stable release)
   - Automatic release notes generation

## Creating a Release

To create a new release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The release will be automatically published without requiring manual intervention to uncheck "Draft" or "Pre-release" options.

## Release Configuration

The release workflow is configured in `.github/workflows/release.yml` and ensures that all releases are:
- Automatically published (not drafts)
- Marked as stable releases (not pre-releases)
- Include auto-generated release notes