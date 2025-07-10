# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EasyEdit is a Next.js application for image editing using AI prompts. It's powered by fal.ai's Flux Kontext API using the official @fal-ai/client SDK and uses Cloudflare R2 for image storage. The project is a fork of Nutlope/easyedit, specifically modified to work with fal.ai's API.

## Development Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint (use `next lint`)

## Architecture

### Core Application Structure
- **Next.js 15 App Router** - Uses app directory structure
- **Client-side state management** - React hooks for image gallery, active image, and form state
- **Server actions** - `app/actions.ts` contains `generateImage` function for API calls
- **Component-based UI** - Modular components in `app/` directory

### Key Components
- `app/page.tsx` - Main interface with image gallery and editing form
- `app/ImageUploader.tsx` - Handles file uploads and sample image selection
- `app/actions.ts` - Server action for Fal.ai API integration
- `app/suggested-prompts/` - AI-powered prompt suggestions
- `app/UserAPIKey.tsx` - API key management component

### API Integration
- **fal.ai Flux Kontext API** - Image generation via official @fal-ai/client SDK
- **Cloudflare R2** - Image storage via S3-compatible API
- **Rate limiting** - Uses Upstash Redis for API rate limiting

### Data Flow
1. User uploads image or selects sample → stored in R2 → URL returned
2. User enters prompt → sent with image URL to fal.ai API
3. Generated image → stored in R2 → displayed in gallery
4. Image versions tracked with incremental version numbers

## Required Configuration

### Environment Variables (`.env.local`)
```
# fal.ai API 配置
FAL_AI_API_KEY=your_fal_ai_api_key

# Cloudflare R2 配置
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=https://your-domain.com
```

### API Key Requirement
- fal.ai API key required for all image generation
- Configured via `FAL_AI_API_KEY` environment variable
- Only supports Flux Kontext Pro model
- Uses official @fal-ai/client SDK with subscribe method
- No user interface for API key input (server-side configuration)

## Development Notes

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **State**: React hooks (useState, useTransition, useEffect)
- **Images**: Next.js Image component with remote patterns
- **Storage**: AWS S3 SDK for Cloudflare R2
- **Validation**: Zod for schema validation
- **UI**: Custom components with Sonner for notifications

### Key Patterns
- Server actions for API calls with proper error handling
- Image dimension adjustment logic in `lib/get-adjusted-dimentions.ts`
- Responsive design with mobile-first approach
- Version tracking for image edits
- Preloading for better UX

### Image Processing
- Supports multiple formats (JPEG, PNG, WebP)
- Automatic dimension adjustment for API compatibility
- Download functionality with proper MIME type detection
- Gallery view with version history