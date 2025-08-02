// app/api/scrape-business/route.ts

// Add the stealth plugin

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
  address: string | null;
  hours: string | null;
  plusCode: string | null;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

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

    // Fixed the logic here - was returning error when data was found
    if (!businessData) {
      console.error("No data found!");
      return Response.json(
        {
          error: "No data found!",
        },
        { status: 404 }
      );
    }

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

const scrapeGoogleMapsBusiness = async (
  url: string
): Promise<BusinessData | null> => {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await puppeteer.launch({
      headless: false, // Use new headless mode
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
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--lang=en-US,en",
        "--window-size=1366,768",
      ],
    });

    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    });

    console.log("Navigating to URL:", url);
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Wait for the main title element
    await page.waitForSelector("h1.DUwDvf.lfPIob", { timeout: 30000 });

    // Wait a bit for the page to fully load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Scroll down to load more content
    await page.evaluate(() => {
      window.scrollBy(0, 300);
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Extract business data
    const businessData = await page.evaluate((): BusinessData => {
      const getTextContent = (selector: string): string | null => {
        const element = document.querySelector(selector);
        return element ? element.textContent?.trim() || null : null;
      };

      const getAttribute = (
        selector: string,
        attribute: string
      ): string | null => {
        const element = document.querySelector(selector);
        return element ? element.getAttribute(attribute) : null;
      };

      // Business name
      const name = getTextContent("h1.DUwDvf.lfPIob");

      // Category
      const category =
        getTextContent("button[jsaction*='category']") ||
        getTextContent(".DkEaL");

      // Phone number
      const phone =
        getTextContent("button[data-item-id*='phone']") ||
        getTextContent("button[aria-label*='phone']") ||
        getTextContent(".H1fHRe");

      // Website
      const website =
        getAttribute("a[data-item-id*='authority']", "href") ||
        getAttribute("a[aria-label*='website']", "href");

      // Rating and review count
      const ratingElement = document.querySelector(".MW4etd");
      const rating = ratingElement
        ? parseFloat(ratingElement.textContent?.trim() || "0")
        : null;

      const reviewElement = document.querySelector(".UY7F9");
      const reviewText = reviewElement?.textContent?.trim();
      const reviewCount = reviewText
        ? parseInt(reviewText.replace(/[^\d]/g, ""))
        : null;

      // Profile image
      const profileImage = getAttribute("img[decoding='async']", "src");

      // Address
      const address =
        getTextContent("button[data-item-id*='address']") ||
        getTextContent(".LrzXr");

      // Hours
      const hoursElement = document.querySelector(".t39EBf .OqCZI");
      const hours =
        hoursElement?.getAttribute("aria-label") ||
        getTextContent(".t39EBf .OqCZI");

      // Plus code
      const plusCode =
        getTextContent("button[data-item-id*='oloc']") ||
        getTextContent(".H1fHRe");

      return {
        name,
        category,
        phone,
        website,
        reviewCount,
        rating,
        profileImage,
        address,
        hours,
        plusCode,
      };
    });

    console.log("Scraped business data:", businessData);
    return businessData;
  } catch (error) {
    console.error("Error in scrapeGoogleMapsBusiness:", error);
    throw error;
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
};
