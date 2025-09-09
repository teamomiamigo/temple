# USDA FoodData Central API Integration

## Overview
The Temple app now integrates with the [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide#bkmk-3) to provide comprehensive food nutrition data.

## API Key
- **API Key**: `6Att1OUVY7jNQg3yTZF6UkZgZqBsp4F6vTikAIPY`
- **Source**: [USDA FoodData Central](https://fdc.nal.usda.gov/api-guide#bkmk-3)
- **Rate Limit**: 1,000 requests per hour per IP address

## Features Implemented

### 1. Food Search
- Search for foods using the USDA database
- Returns comprehensive nutrition information
- Supports both Foundation Foods and Branded Foods

### 2. API Endpoints Used
- **Search**: `GET /foods/search` - Search for foods by name
- **Details**: `GET /food/{fdcId}` - Get detailed food information

### 3. Data Types Supported
Based on the [USDA documentation](https://fdc.nal.usda.gov/data-documentation):

- **Foundation Foods**: Analytically derived values from USDA
- **Branded Foods**: Data from food labels (manufacturer data)
- **SR Legacy**: Historic data from Standard Reference
- **FNDDS**: Food and Nutrient Database for Dietary Studies
- **Experimental Foods**: Data from peer-reviewed journals

## Usage in App

### Testing the API
1. Go to **Nutrition** tab
2. Tap the **+** button
3. Choose **"Log an Item"** or **"Log a Meal"**
4. Tap **"🧪 Test USDA API"** button to verify connection

### Searching for Foods
1. Enter a food name in the search field
2. Tap **"Search"**
3. Results will show foods from the USDA database
4. Select a food and adjust quantity
5. Add to your meal

## API Response Format

The API returns foods with the following nutrition data:
- **Calories** (Energy)
- **Protein** (g)
- **Carbohydrates** (g)
- **Fat** (g)
- **Fiber** (g)
- **Sugar** (g)
- **Sodium** (mg)

## Error Handling

- **Connection Issues**: Falls back to mock data
- **Rate Limiting**: Respects 1,000 requests/hour limit
- **Invalid Responses**: Logs errors and shows user-friendly messages

## Future Enhancements

1. **Barcode Scanning**: Integrate with Edamam API for barcode lookup
2. **Custom Foods**: Allow users to create custom food entries
3. **Meal Templates**: Save common meal combinations
4. **Nutrition Analytics**: Track trends and patterns

## API Documentation References

- [USDA API Guide](https://fdc.nal.usda.gov/api-guide#bkmk-3)
- [Data Type Documentation](https://fdc.nal.usda.gov/data-documentation)
- [API Specification](https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1)

## Rate Limits and Best Practices

- **Rate Limit**: 1,000 requests per hour per IP
- **Best Practice**: Cache search results when possible
- **Error Handling**: Implement exponential backoff for failed requests
- **Data Attribution**: Always cite USDA FoodData Central as the source

## License

USDA FoodData Central data is in the public domain under CC0 1.0 Universal license. No permission is needed for use, but we request attribution:

> U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, 2019. fdc.nal.usda.gov.
