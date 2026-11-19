# Markdown Collector - Website to Markdown

A **Firefox extension** that helps you save web pages as Markdown and manage them efficiently. Perfect for sharing content with AI assistants like ChatGPT.

## Features

- **Quick Save:** Use keyboard shortcuts to save and convert pages:
  - `Alt+I`: Save and convert current page(s)
  - `Alt+C`: Save, convert, and copy to clipboard
  - `Alt+M`: Open markdown collection
- **AI-Powered Refinement:** Optional LLM integration to refine and structure content based on custom prompts
  - LLM endpoints must use HTTPS; HTTP is allowed only for local loopback servers (`localhost`, `127.0.0.1`, `[::1]`). Redirects are blocked to protect API keys.
- **Multi-Tab Processing:** Select multiple tabs (Ctrl+Click or Shift+Click) and process them:
  - Individual mode: Apply the same AI refinement to each page separately
  - Batch mode: Combine all selected pages into one document (Shift+Enter) and apply the same AI refinement to the combined content
- **Content Management:**
  - Centralized collection page for all saved URLs and their Markdown content
  - Edit content directly within the collection
  - Select multiple entries for copying or deleting
  - Update and review changes with diff view
- **Smart Content Cleanup:** Optional Readability integration to extract main content and remove clutter

## Installation

**Get it from Firefox Add-ons: [Markdown Collector](https://addons.mozilla.org/de/firefox/addon/markdown-collector/)**

_For developers:_

1. Clone: `git clone https://github.com/simonb97/markdown-collector.git`
2. Load in Firefox:
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `manifest.json`

## Quick Start Guide

2. **Load the Extension in Firefox:**

   - Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
   - Click on **"Load Temporary Add-on..."**
   - Select the `manifest.json` file from the cloned repository

   - Single page: Press `Alt+I` or `Alt+C`
   - Multiple pages:
     - Hold Ctrl and click on tabs you want to save
     - Press `Alt+I` or `Alt+C`
     - Choose to process them separately or combine them

1. **Save Pages:**

   - Single Page:
     - Press `Alt+I` to save and convert the current page
     - Press `Alt+C` to save, convert, and copy to clipboard
   - Multiple Pages:
     - Select multiple tabs using Ctrl+Click or Shift+Click
     - Press `Alt+I` or `Alt+C`
     - Choose processing mode:
       - Press Enter: Process each page individually with the same prompt
       - Press Shift+Enter: Combine all pages into one document

1. **AI Refinement (Optional):**

   - Enable LLM refinement in settings
   - Add your API key (supports OpenAI and compatible local models)
   - When saving pages, enter a prompt to refine the content
   - For multiple pages:
     - Individual mode: Same prompt applies to each page
     - Batch mode: Prompt applies to combined content

1. **Manage Collection:**
   - Press `Alt+M` to open the collection page
   - Edit content directly in the markdown boxes
   - Select entries and use the action buttons to:
     - Copy selected entries
     - Update content from source
     - Delete entries
   - Use the search feature to filter entries

## Keyboard Shortcuts

- **Save and Convert:** `Alt+I`
- **Save, Convert, and Copy:** `Alt+C`
- **Open Collection:** `Alt+M`
- **In Prompt Dialog:**
  - Enter: Process individually
  - Shift+Enter: Process as batch (when multiple tabs selected)
  - Esc: Cancel operation

_Shortcuts can be customized in Firefox Add-ons settings._

## Roadmap

See [Roadmap.md](Roadmap.md).

Changelog is at the end of [Roadmap.md](Roadmap.md).


## Automated Firefox releases

GitHub Actions runs tests, builds an extension ZIP, and lints pull requests and
pushes to `main`. When a push to `main` changes the version in
`manifest.json`, the workflow automatically submits the new version to the
**existing listed** [Mozilla Add-ons page](https://addons.mozilla.org/firefox/addon/markdown-collector/).
Mozilla may still require review before the update becomes public.

### One-time setup

1. Create API credentials in the [AMO Developer Hub](https://addons.mozilla.org/developers/addon/api/key/).
2. Add these **GitHub Actions repository secrets** in
   **Settings → Secrets and variables → Actions**:
   - `AMO_JWT_ISSUER`: Mozilla JWT issuer / API key
   - `AMO_JWT_SECRET`: Mozilla JWT secret
3. To submit the already-committed `1.4.4` release, open
   **Actions → Firefox add-on CI/CD → Run workflow** once after adding the secrets.

Subsequent releases require only a version bump in `manifest.json`, merged
to `main`. The release job obtains the existing add-on ID from Mozilla's public
API and inserts it into the **packaged copy** of the manifest; the repository
manifest is unchanged. No ZIP creation or AMO upload is needed locally.

To build locally without publishing: `bash zip.sh`. Output is
`dist/markdown-collector-<version>.zip`.

API credentials never belong in the repository. Pull-request workflows do not
receive them. The workflow submits for review; it cannot bypass Mozilla's
approval process or guarantee immediate publication.

## Contributing

Contributions are welcome! Whether it's reporting bugs, suggesting features, or submitting pull requests, your help is appreciated.

1. **Fork the Repository**
2. **Create a New Branch:**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit Your Changes:**
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push to the Branch:**
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request**

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

## Acknowledgments

- [Turndown](https://github.com/domchristie/turndown) for HTML to Markdown conversion.
- [JsDiff](https://github.com/kpdecker/jsdiff) for showing differences between Markdown texts.
- [Readability](https://github.com/mozilla/readability) for extracting the main content of a page.
<!-- - [OkapiBM25](https://github.com/FurkanToprak/OkapiBM25) for calculating the relevance of a page to a query (used in the search feature). -->
