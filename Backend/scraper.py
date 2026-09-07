import requests
from bs4 import BeautifulSoup
import re


def scrape_page(url):
    """
    Download a public webpage and return its HTML.
    """

    headers = {
        "User-Agent": "USA Shopping Assistant/1.0"
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=10
    )

    response.raise_for_status()

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    return soup


def create_product(
    name="",
    brand="",
    price=None,
    old_price=None,
    rating=None,
    reviews=None,
    category="",
    image="",
    product_url="",
    source=""
):
    """
    Create a standard USA product object.
    """

    return {
        "name": name,
        "brand": brand,
        "price": price,
        "oldPrice": old_price,
        "rating": rating,
        "reviews": reviews,
        "category": category,
        "image": image,
        "url": product_url,
        "source": source,
        "features": []
    }


def extract_page_info(soup):
    """
    Extract basic information from the webpage.
    """

    title = soup.title.get_text(strip=True) if soup.title else "No title"

    headings = []

    for heading in soup.find_all(["h1", "h2", "h3"]):

        text = heading.get_text(" ", strip=True)

        if text:
            headings.append(text)

    return {
        "title": title,
        "headings": headings
    }


def extract_price(text):
    """
    Try to find a price inside text.
    """

    if not text:
        return None

    pattern = r"(?:\$|USD\s*)\s?(\d+(?:,\d{3})*(?:\.\d{1,2})?)"

    match = re.search(pattern, text, re.IGNORECASE)

    if not match:
        return None

    price_text = match.group(1).replace(",", "")

    try:
        return float(price_text)
    except ValueError:
        return None


def extract_rating(text):
    """
    Try to find a rating such as 4.5 or 4.5/5.
    """

    if not text:
        return None

    pattern = r"\b([0-5](?:\.\d)?)\s*(?:/5)?"

    match = re.search(pattern, text)

    if not match:
        return None

    try:
        rating = float(match.group(1))

        if 0 <= rating <= 5:
            return rating

    except ValueError:
        pass

    return None


def extract_product_from_page(soup, url="", source=""):
    """
    Extract a basic product from a webpage.

    This is an initial generic extractor.
    Website-specific scrapers will be added later.
    """

    page_info = extract_page_info(soup)

    name = page_info["title"]

    if page_info["headings"]:
        name = page_info["headings"][0]

    page_text = soup.get_text(" ", strip=True)

    price = extract_price(page_text)

    rating = extract_rating(page_text)

    image = ""

    first_image = soup.find("img")

    if first_image:

        image = (
            first_image.get("src")
            or first_image.get("data-src")
            or ""
        )

    return create_product(
        name=name,
        price=price,
        rating=rating,
        image=image,
        product_url=url,
        source=source
    )


if __name__ == "__main__":

    url = "https://example.com"

    soup = scrape_page(url)

    print("Scraping successful!")
    print()

    print("Extracting product information...")

    product = extract_product_from_page(
        soup,
        url=url,
        source="Example"
    )

    print()
    print("Extracted product:")
    print(product)