// app/api/scrape-business/route.ts
import puppeteer, { Browser, Page } from "puppeteer";
import { NextRequest } from "next/server";

interface BusinessData {
  name: string | null;
  category: string | null;
  phone: string | null;
  website: string | null;
  reviewCount: number | null;
  rating: number | null;
  profileImage: string | null;
}

interface RequestBody {
  url: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { url }: RequestBody = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate if it's a Google Maps URL
    if (!url.includes("google.com/maps")) {
      return Response.json(
        { error: "Invalid Google Maps URL" },
        { status: 400 }
      );
    }

    const businessData = await scrapeGoogleMapsBusiness(url);

    return Response.json({
      success: true,
      data: businessData,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return Response.json(
      {
        error: "Failed to scrape business data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function scrapeGoogleMapsBusiness(url: string): Promise<BusinessData> {
  let browser: Browser | null = null;

  try {
    // Launch browser with optimized settings
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    });

    const page: Page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (
        resourceType === "stylesheet" ||
        resourceType === "font" ||
        resourceType === "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for the business information to load
    await page.waitForSelector('[data-attrid="title"]', { timeout: 10000 });

    // Extract business data using multiple selector strategies
    const businessData: BusinessData = await page.evaluate((): BusinessData => {
      const data: BusinessData = {
        name: null,
        category: null,
        phone: null,
        website: null,
        reviewCount: null,
        rating: null,
        profileImage: null,
      };

      // Business Name - Multiple selectors for robustness
      const nameSelectors: string[] = [
        '[data-attrid="title"] span',
        'h1[data-attrid="title"]',
        ".x3AX1-LfntMc-header-title-title",
        ".qrShPb span",
        ".DUwDvf",
      ];

      for (const selector of nameSelectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element && element.textContent?.trim()) {
          data.name = element.textContent.trim();
          break;
        }
      }

      // Business Category
      const categorySelectors: string[] = [
        '[data-attrid="subtitle"]',
        ".DkEaL",
        ".mgr77e .DkEaL",
      ];

      for (const selector of categorySelectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element && element.textContent?.trim()) {
          data.category = element.textContent.trim();
          break;
        }
      }

      // Phone Number
      const phoneSelectors: string[] = [
        '[data-item-id="phone:tel:"] .Io6YTe',
        '[data-value*="tel:"]',
        "span[data-phone]",
        ".rogA2c .Io6YTe",
      ];

      for (const selector of phoneSelectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element && element.textContent?.trim()) {
          data.phone = element.textContent.trim();
          break;
        }
      }

      // Website
      const websiteSelectors: string[] = [
        '[data-item-id*="authority"] a',
        '[data-value*="http"] a',
        '.CsEnBe a[href^="http"]',
        '.rogA2c a[href^="http"]',
      ];

      for (const selector of websiteSelectors) {
        const element = document.querySelector(selector) as HTMLAnchorElement;
        if (element && element.href) {
          data.website = element.href;
          break;
        }
      }

      // Rating
      const ratingSelectors: string[] = [
        ".MW4etd",
        ".ceNzKf",
        '[jsaction*="pane.rating"] span',
      ];

      for (const selector of ratingSelectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element && element.textContent?.trim()) {
          const ratingText = element.textContent.trim();
          const ratingMatch = ratingText.match(/([0-9]\.?[0-9]?)/);
          if (ratingMatch) {
            data.rating = parseFloat(ratingMatch[1]);
            break;
          }
        }
      }

      // Review Count
      const reviewSelectors: string[] = [
        ".UY7F9",
        ".RDApEe",
        '[jsaction*="pane.rating"] + span',
        ".MW4etd + .UY7F9",
      ];

      for (const selector of reviewSelectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element && element.textContent?.trim()) {
          const reviewText = element.textContent.trim();
          const reviewMatch = reviewText.match(/\(([0-9,]+)\)/);
          if (reviewMatch) {
            data.reviewCount = parseInt(reviewMatch[1].replace(/,/g, ""));
            break;
          }
        }
      }

      // Profile Image
      const imageSelectors: string[] = [
        ".ZKCDEc img",
        ".U39Pmb img",
        '[data-photo-index="0"] img',
        ".gallery-image img",
      ];

      for (const selector of imageSelectors) {
        const element = document.querySelector(selector) as HTMLImageElement;
        if (element && element.src && !element.src.includes("data:image")) {
          data.profileImage = element.src;
          break;
        }
      }

      return data;
    });

    return businessData;
  } catch (error) {
    console.error("Error in scrapeGoogleMapsBusiness:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
