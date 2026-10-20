# Implementation Plan: Image Cache Busting

I will implement cache busting for all image requests to ensure they always fetch the latest version.

## Tasks:

1.  **Modify `src/utils/imageHelper.ts`**:
    *   Update `getFreshImageUrl` to always append a `?v=<timestamp>` query parameter to all image URLs, regardless of whether they are standard URLs, base64 data, or `/api/upload` paths.
    *   Ensure the timestamp is generated to be stable but unique enough when updates occur.

2.  **Verify UI Components**:
    *   Check `src/components/Header.tsx`, `src/components/SliderBanner.tsx`, and other components to ensure they use `getFreshImageUrl` for all image tags.

3.  **Testing**:
    *   Verify that images update immediately after an admin change without requiring a hard refresh.
    *   Check for any potential performance regressions caused by disabling image caching.
